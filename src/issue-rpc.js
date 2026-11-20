import { CodeupError, createCodeupApi } from './codeup.js'

/** Authenticated browser-to-Host channel; payloads never contain access tokens. */
export const RPC_CHANNEL = '/dsh-dev-dashboard'

const MAX_BODY_BYTES = 1024 * 1024
const ENDPOINT_SEGMENT = /^[A-Za-z0-9_$.-]+$/

function unwrapVolatile(value, fallback) {
  if (value && typeof value === 'object' && typeof value.get === 'function') {
    try { return value.get() } catch { return fallback }
  }
  return value === undefined ? fallback : value
}

function tokenRef(id) {
  return `DSH_GIT_WORKBENCH_${id.replaceAll('-', '_').toUpperCase()}`
}

function rpcError(code, message, details = {}) {
  const error = new Error(message)
  error.code = code
  error.details = details
  return error
}

function requireObject(payload) {
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw rpcError('bad-request', '请求参数必须是对象。')
  }
  return payload
}

function optionalString(value, name, maxLength = 200) {
  if (value === undefined || value === null || value === '') return ''
  if (typeof value !== 'string' || value.length > maxLength) {
    throw rpcError('bad-request', `请求参数 ${name} 无效。`)
  }
  return value
}

function requiredString(value, name, maxLength = 200) {
  const result = optionalString(value, name, maxLength)
  if (!result) throw rpcError('bad-request', `缺少请求参数 ${name}。`)
  return result
}

function optionalInteger(value, name, fallback, min, max) {
  if (value === undefined || value === null) return fallback
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) {
    throw rpcError('bad-request', `请求参数 ${name} 无效。`)
  }
  return value
}

function requiredInteger(value, name, min, max) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) {
    throw rpcError('bad-request', `请求参数 ${name} 无效。`)
  }
  return value
}

function optionalCursor(value) {
  if (value === undefined || value === null) return null
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw rpcError('bad-request', '请求参数 cursor 无效。')
  }
  return {
    projectIndex: requiredInteger(value.projectIndex, 'cursor.projectIndex', 0, 100000),
    page: requiredInteger(value.page, 'cursor.page', 1, 100000),
    offset: requiredInteger(value.offset, 'cursor.offset', 0, 10000),
    anchorId: optionalString(value.anchorId, 'cursor.anchorId', 200),
  }
}

function codeupAccount(config, accountId) {
  const accounts = unwrapVolatile(config?.accounts, [])
  const account = Array.isArray(accounts)
    ? accounts.find(item => item && item.id === accountId && item.platform === 'codeup')
    : undefined
  if (!account) throw rpcError('account-not-found', '找不到这个 Codeup 账户，请重新选择。')
  return account
}

function ok(value) {
  return { ok: true, value }
}

function failure(error) {
  const known = error instanceof CodeupError || typeof error?.code === 'string'
  const aborted = error?.name === 'AbortError' || error?.name === 'TimeoutError'
  const message = aborted
    ? '请求已取消或超时。'
    : known && typeof error?.message === 'string'
      ? error.message
      : '云效请求失败，请检查网络后重试。'
  const details = error instanceof CodeupError && Number.isInteger(error.details?.status)
    ? { status: error.details.status }
    : {}
  return {
    ok: false,
    error: {
      code: aborted ? 'request-aborted' : known ? error.code : 'internal',
      message,
      details,
    },
  }
}

/** Resolve the endpoint from a request path below our channel prefix. */
function endpointFromPath(pathname) {
  if (!pathname.startsWith(`${RPC_CHANNEL}/`)) return undefined
  const endpoint = pathname.slice(RPC_CHANNEL.length + 1)
  if (endpoint.split('/').some(segment =>
    segment === '' || segment === '.' || segment === '..' || !ENDPOINT_SEGMENT.test(segment))) {
    return undefined
  }
  return endpoint
}

function sendJson(res, status, body) {
  if (res.writableEnded || res.headersSent) return
  const text = JSON.stringify(body)
  res.writeHead(status, {
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(text),
    'cache-control': 'no-store',
  })
  res.end(text)
}

/** Read a bounded JSON body from a node:http request. */
function readJsonBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    let settled = false
    const finish = (handler, value) => {
      if (settled) return
      settled = true
      handler(value)
    }
    req.on('data', (chunk) => {
      if (settled) return
      size += chunk.length
      if (size > maxBytes) {
        finish(reject, new Error('request body too large'))
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (settled) return
      try { finish(resolve, JSON.parse(Buffer.concat(chunks).toString('utf8'))) }
      catch (error) { finish(reject, error) }
    })
    req.on('error', error => finish(reject, error))
    req.on('aborted', () => finish(reject, new Error('request aborted')))
  })
}

/**
 * Serve one authenticated RPC exchange over our own prefix route.
 *
 * `connection.rpc.handle` is unusable here: it registers the HTTP route through
 * the Connection service's own Context, which cannot read `webServer` without
 * an inject declaration ("cannot get property webServer without inject"), so
 * the POST falls through to the SPA fallback with HTTP 405. Registering the
 * prefix route directly against `webServer`, and admitting each request with
 * Connection, keeps the same wire protocol without that broken indirection.
 */
async function serveRpc(req, res, connection, dispatch) {
  const admission = connection.admit(req)
  if ('rejection' in admission) {
    if (!res.writableEnded) {
      res.writeHead(admission.rejection)
      res.end(admission.rejection === 401 ? 'unauthorized' : 'forbidden')
    }
    return
  }

  let pathname
  try { pathname = new URL(req.url ?? '/', 'http://localhost').pathname }
  catch { pathname = '' }
  const endpoint = endpointFromPath(pathname)
  if (req.method !== 'POST' || endpoint === undefined) {
    if (!res.writableEnded) { res.writeHead(404); res.end('not found') }
    return
  }
  const mediaType = String(req.headers['content-type'] ?? '').split(';', 1)[0].trim().toLowerCase()
  if (mediaType !== 'application/json') {
    if (!res.writableEnded) { res.writeHead(415); res.end('content type must be application/json') }
    return
  }

  let message
  try { message = await readJsonBody(req, MAX_BODY_BYTES) }
  catch { if (!res.writableEnded) { res.writeHead(400); res.end('body is not JSON') }; return }

  const rpcId = typeof message?.rpcId === 'string' ? message.rpcId : 'invalid-request'
  const fail = (code, text, details = {}) => sendJson(res, 200, {
    type: 'server-response',
    rpcId,
    result: { ok: false, error: { code, message: text, details } },
  })
  if (message?.type !== 'client-request' || typeof message.method !== 'string') {
    return fail('gateway/bad-request', 'invalid client-request message', { issues: [] })
  }
  if (message.method !== endpoint) {
    return fail('gateway/bad-request',
      `method ${JSON.stringify(message.method)} does not match endpoint ${JSON.stringify(endpoint)}`,
      { issues: [] })
  }

  const controller = new AbortController()
  res.on('close', () => controller.abort())
  let result
  try {
    result = await dispatch(endpoint, message.payload, controller.signal, admission.peer)
  } catch (_error) {
    result = { ok: false, error: { code: 'internal', message: '工作台后台服务异常。', details: {} } }
  }
  sendJson(res, 200, { type: 'server-response', rpcId, result })
}

/**
 * Register the small Host API used by the page; the UI never resolves credentials.
 * Both services are hard dependencies: the prefix route lives on `webServer`
 * and every request is admitted by Connection. Credentials stay an optional
 * lookup so a missing credential service yields a clear RPC error instead of an
 * unhandled POST falling through to the SPA fallback (HTTP 405).
 */
export function registerIssueRpc(ctx, config, api = createCodeupApi()) {
  const dispatch = async (endpoint, rawPayload, signal) => {
    let token = ''
    try {
      const payload = requireObject(rawPayload)
      const accountId = requiredString(payload.accountId, 'accountId', 100)
      const account = codeupAccount(config, accountId)
      signal?.throwIfAborted()
      const credentials = ctx.get('credentials')
      if (credentials === undefined) {
        throw rpcError('credentials-unavailable', '本机凭据服务不可用，请检查 DSH 配置。')
      }
      const credential = await credentials.resolve(tokenRef(account.id))
      signal?.throwIfAborted()
      token = typeof credential?.value === 'string' ? credential.value : ''
      if (!token) throw rpcError('missing-token', '这个账户没有可用令牌，请编辑账户更新令牌。')

      if (endpoint === 'load') {
        return ok(await api.load({
          token,
          organizationId: optionalString(payload.organizationId, 'organizationId'),
          projectId: optionalString(payload.projectId, 'projectId') || 'all',
          scope: optionalString(payload.scope, 'scope', 30) || 'all',
          pageSize: optionalInteger(payload.pageSize, 'pageSize', 20, 1, 200),
          cursor: optionalCursor(payload.cursor),
          signal,
        }))
      }
      if (endpoint === 'detail') {
        return ok(await api.detail({
          token,
          organizationId: requiredString(payload.organizationId, 'organizationId'),
          issueId: requiredString(payload.issueId, 'issueId'),
          signal,
        }))
      }
      throw rpcError('bad-request', '不支持的工作台请求。')
    } catch (error) {
      const result = failure(error)
      if (token && result.error.message.includes(token)) {
        result.error.message = result.error.message.replaceAll(token, '[redacted]')
      }
      return result
    }
  }

  ctx.inject(['connection', 'webServer'], (scoped) => {
    const connection = scoped.get('connection')
    const webServer = scoped.get('webServer')
    if (typeof connection?.admit !== 'function' || typeof webServer?.register !== 'function') return
    scoped.effect(() => webServer.register({
      kind: 'prefix',
      path: RPC_CHANNEL,
      handler: (req, res) => serveRpc(req, res, connection, dispatch),
    }), 'git-workbench: Codeup issue RPC route')
  })
}
