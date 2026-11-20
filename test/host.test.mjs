import test from 'node:test'
import assert from 'node:assert/strict'
import { CodeupError } from '../src/codeup.js'
import { apply as applyPlugin } from '../src/index.js'
import { registerIssueRpc, RPC_CHANNEL } from '../src/issue-rpc.js'

const ACCOUNT = { id: 'account-1', platform: 'codeup', username: 'tester' }
const TOKEN = 'pt-host-test-secret'
const REF = 'DSH_GIT_WORKBENCH_ACCOUNT_1'

/** Drive the registered prefix-route handler with a fake node:http exchange. */
function exchange(handler, { endpoint = 'load', payload = {}, method = 'POST', mediaType = 'application/json', body } = {}) {
  return new Promise((resolve, reject) => {
    const text = body ?? JSON.stringify({
      type: 'client-request', rpcId: 'rpc-1', method: endpoint, payload,
    })
    const listeners = new Map()
    const on = (map, event, fn) => map.set(event, [...(map.get(event) ?? []), fn])
    const req = {
      method,
      url: `${RPC_CHANNEL}/${endpoint}`,
      headers: { 'content-type': mediaType },
      on(event, fn) { on(listeners, event, fn); return this },
    }
    const resListeners = new Map()
    const res = {
      writableEnded: false, headersSent: false, status: 200, headers: {}, body: '',
      writeHead(status, headers) {
        this.status = status
        this.headers = headers
        this.headersSent = true
        return this
      },
      end(text = '') {
        this.body = text
        this.writableEnded = true
        let parsed
        try { parsed = JSON.parse(text) } catch { parsed = text }
        resolve({ status: this.status, body: parsed })
      },
      on(event, fn) { on(resListeners, event, fn); return this },
    }
    Promise.resolve(handler(req, res)).catch(reject)
    queueMicrotask(() => {
      for (const fn of listeners.get('data') ?? []) fn(Buffer.from(text))
      for (const fn of listeners.get('end') ?? []) fn()
    })
  })
}

function setup({ config = { accounts: [ACCOUNT] }, token = TOKEN, api, credentialsAvailable = true, connectionAvailable = true, webServerAvailable = true } = {}) {
  const injections = []
  const effects = []
  const routes = []
  const resolvedRefs = []
  const webServer = { register(route) { routes.push(route); return () => {} } }
  const connection = {
    admit() {
      if (!connectionAvailable) return { rejection: 401 }
      return { peer: { id: 'peer-1' } }
    },
  }
  const credentialsService = {
    async resolve(ref) { resolvedRefs.push(ref); return token ? { value: token, source: 'test' } : undefined },
  }
  const get = (name) => {
    if (name === 'connection') return connection
    if (name === 'webServer') return webServerAvailable ? webServer : undefined
    if (name === 'credentials') return credentialsAvailable ? credentialsService : undefined
    return undefined
  }
  const ctx = {
    get,
    inject(names, callback) {
      injections.push(names)
      callback({ get, effect(setupEffect) { effects.push(setupEffect()); return () => {} } })
    },
  }
  registerIssueRpc(ctx, config, api)
  assert.deepEqual(injections, [['connection', 'webServer']])
  assert.equal(effects.length, 1)
  assert.equal(routes.length, 1)
  assert.equal(routes[0].kind, 'prefix')
  assert.equal(routes[0].path, RPC_CHANNEL)
  return {
    call: (endpoint, payload) => exchange(routes[0].handler, { endpoint, payload })
      .then(response => response.body.result),
    exchange: options => exchange(routes[0].handler, options),
    resolvedRefs,
    routes,
  }
}

test('load resolves the current account token and forwards bounded filters without returning credentials', async () => {
  let received
  const { call, resolvedRefs } = setup({
    config: { accounts: { get: () => [ACCOUNT] } },
    api: {
      async load(input) { received = input; return { items: [{ id: 'issue-1', title: 'Test issue' }] } },
      async detail() { throw new Error('unexpected detail call') },
    },
  })
  const result = await call('load', {
    accountId: ACCOUNT.id, organizationId: 'org-1', projectId: 'project-1', scope: 'assigned',
  })
  assert.equal(result.ok, true)
  assert.deepEqual(resolvedRefs, [REF])
  assert.equal(received.token, TOKEN)
  assert.equal(received.organizationId, 'org-1')
  assert.equal(received.projectId, 'project-1')
  assert.equal(received.scope, 'assigned')
  assert.ok(received.signal instanceof AbortSignal)
  assert.equal(JSON.stringify(result).includes(TOKEN), false)
})

test('detail validates IDs and returns the normalized detail result', async () => {
  let received
  const { call } = setup({
    api: {
      async load() { throw new Error('unexpected load call') },
      async detail(input) { received = input; return { id: input.issueId, description: 'Details' } },
    },
  })
  const result = await call('detail', { accountId: ACCOUNT.id, organizationId: 'org-1', issueId: 'issue-1' })
  assert.equal(result.ok, true)
  assert.equal(result.value.description, 'Details')
  assert.equal(received.organizationId, 'org-1')
  assert.equal(received.issueId, 'issue-1')
  assert.equal(received.token, TOKEN)
  assert.equal(JSON.stringify(result).includes(TOKEN), false)
})

test('rejects unknown, non-Codeup, malformed, and missing-token requests', async () => {
  const otherAccount = { ...ACCOUNT, platform: 'github' }
  const forbidden = setup({
    config: { accounts: [otherAccount] },
    api: { load() { throw new Error('must not load') }, detail() { throw new Error('must not load detail') } },
  })
  const result = await forbidden.call('load', { accountId: ACCOUNT.id })
  assert.equal(result.ok, false)
  assert.equal(result.error.code, 'account-not-found')
  assert.equal(forbidden.resolvedRefs.length, 0)

  const missing = setup({ token: '', api: { async load() { return {} }, async detail() { return {} } } })
  const missingResult = await missing.call('load', { accountId: ACCOUNT.id })
  assert.equal(missingResult.error.code, 'missing-token')

  const malformed = setup({ api: { async load() { return {} }, async detail() { return {} } } })
  const malformedResult = await malformed.call('load', { accountId: ACCOUNT.id, organizationId: 42 })
  assert.equal(malformedResult.error.code, 'bad-request')
})

test('declares webServer as a hard dependency so the channel always mounts a named HTTP route', () => {
  const injections = []
  registerIssueRpc({ get: () => undefined, inject(names) { injections.push(names) } }, { accounts: [ACCOUNT] }, {
    async load() { throw new Error('must not load') },
    async detail() { throw new Error('must not load detail') },
  })
  assert.deepEqual(injections, [['connection', 'webServer']])
})

test('mounts no route when webServer is unavailable (the old HTTP 405 failure mode)', () => {
  const effects = []
  const connection = { admit: () => ({ peer: {} }) }
  const get = name => name === 'connection' ? connection : undefined
  const ctx = {
    get,
    inject(_names, callback) {
      callback({ get, effect(setup) { effects.push(setup()); return () => {} } })
    },
  }
  registerIssueRpc(ctx, { accounts: [ACCOUNT] }, {
    async load() { return {} }, async detail() { return {} },
  })
  assert.equal(effects.length, 0)
})

test('registers the channel even when credentials is absent, and reports a clear RPC error', async () => {
  const { call, resolvedRefs } = setup({
    credentialsAvailable: false,
    api: {
      async load() { throw new Error('must not call the API without credentials') },
      async detail() { throw new Error('must not call the API without credentials') },
    },
  })
  const result = await call('load', { accountId: ACCOUNT.id })
  assert.equal(result.ok, false)
  assert.equal(result.error.code, 'credentials-unavailable')
  assert.equal(resolvedRefs.length, 0)
})

test('rejects unauthenticated, non-POST, non-JSON, and mismatched requests before dispatch', async () => {
  const unauthorized = setup({ connectionAvailable: false, api: { async load() { return {} }, async detail() { return {} } } })
  const denied = await unauthorized.exchange({ endpoint: 'load' })
  assert.equal(denied.status, 401)

  const { exchange: send } = setup({ api: { async load() { return {} }, async detail() { return {} } } })
  assert.equal((await send({ endpoint: 'load', method: 'GET' })).status, 404)
  assert.equal((await send({ endpoint: 'load', mediaType: 'text/plain' })).status, 415)
  const mismatched = await send({ endpoint: 'load', payload: {}, body: JSON.stringify({ type: 'client-request', rpcId: 'r', method: 'detail', payload: {} }) })
  assert.equal(mismatched.body.result.error.code, 'gateway/bad-request')
})

test('RPC failures expose only stable errors and status, never token-bearing error details', async () => {
  const { call } = setup({
    api: {
      async load() {
        throw new CodeupError('permission-denied', `Denied: ${TOKEN}`, {
          status: 403,
          raw: TOKEN,
          headers: { 'x-yunxiao-token': TOKEN },
        })
      },
      async detail() { throw new Error(`Unexpected ${TOKEN}`) },
    },
  })
  const result = await call('load', { accountId: ACCOUNT.id })
  assert.equal(result.ok, false)
  assert.equal(result.error.code, 'permission-denied')
  assert.equal(result.error.message.includes(TOKEN), false)
  assert.deepEqual(result.error.details, { status: 403 })
  assert.equal(JSON.stringify(result).includes('x-yunxiao-token'), false)

  const detailResult = await call('detail', { accountId: ACCOUNT.id, organizationId: 'org-1', issueId: 'issue-1' })
  assert.equal(detailResult.ok, false)
  assert.equal(detailResult.error.code, 'internal')
  assert.equal(detailResult.error.message.includes(TOKEN), false)
  assert.deepEqual(detailResult.error.details, {})
})

test('load validates and forwards pageSize and cursor with a default pageSize of 20', async () => {
  let received
  const { call } = setup({
    api: {
      async load(input) { received = input; return { items: [], hasMore: false, nextCursor: null } },
      async detail() { throw new Error('unexpected detail call') },
    },
  })

  const defaultResult = await call('load', { accountId: ACCOUNT.id, organizationId: 'org-1' })
  assert.equal(defaultResult.ok, true)
  assert.equal(received.pageSize, 20)
  assert.equal(received.cursor, null)

  const cursor = { projectIndex: 1, page: 2, offset: 5, anchorId: 'issue-5' }
  const pagedResult = await call('load', {
    accountId: ACCOUNT.id,
    organizationId: 'org-1',
    pageSize: 20,
    cursor,
  })
  assert.equal(pagedResult.ok, true)
  assert.equal(received.pageSize, 20)
  assert.deepEqual(received.cursor, cursor)

  for (const badPayload of [
    { accountId: ACCOUNT.id, pageSize: 0 },
    { accountId: ACCOUNT.id, pageSize: 201 },
    { accountId: ACCOUNT.id, pageSize: '20' },
    { accountId: ACCOUNT.id, cursor: 'bad' },
    { accountId: ACCOUNT.id, cursor: { projectIndex: -1, page: 1, offset: 0 } },
    { accountId: ACCOUNT.id, cursor: { projectIndex: 0, page: 0, offset: 0 } },
  ]) {
    const badResult = await call('load', badPayload)
    assert.equal(badResult.ok, false)
    assert.equal(badResult.error.code, 'bad-request')
  }
})

test('count resolves the account token and forwards filters to api.count', async () => {
  let received
  const { call, resolvedRefs } = setup({
    api: {
      async load() { throw new Error('unexpected load call') },
      async count(input) { received = input; return { total: 42, assigned: 30, participant: 15, truncated: false } },
      async detail() { throw new Error('unexpected detail call') },
    },
  })
  const result = await call('count', {
    accountId: ACCOUNT.id, organizationId: 'org-1', projectId: 'project-1', scope: 'all',
  })
  assert.equal(result.ok, true)
  assert.equal(result.value.total, 42)
  assert.deepEqual(resolvedRefs, [REF])
  assert.equal(received.token, TOKEN)
  assert.equal(received.organizationId, 'org-1')
  assert.equal(received.projectId, 'project-1')
  assert.equal(received.scope, 'all')
  assert.ok(received.signal instanceof AbortSignal)
  assert.equal(JSON.stringify(result).includes(TOKEN), false)
})

test('apply hides the auto-generated settings form and registers issue RPC', () => {
  const configured = []
  const injections = []
  const fiber = { uid: 'fiber-1' }
  const ctx = {
    fiber,
    get: () => undefined,
    inject(names, callback) {
      injections.push(names)
      if (names[0] === 'settings') {
        callback({
          settings: {
            configure(presentation, owner) {
              configured.push({ presentation, owner })
              return () => {}
            },
          },
          effect(setup) { return setup() },
        })
      }
    },
  }
  applyPlugin(ctx, {})
  assert.deepEqual(configured, [{ presentation: { auto: false }, owner: fiber }])
  assert.deepEqual(injections, [['settings'], ['connection', 'webServer']])
})
