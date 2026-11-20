const BASE_URL = 'https://openapi-rdc.aliyuncs.com'
const CATEGORY = 'Req,Task,Bug'
const PAGE_SIZE = 200
const DEFAULT_WORKITEM_PAGE_SIZE = 20
const MAX_WORKITEM_PAGE_SIZE = 200
// Safety guards for a pathological organization, far above a personal account's
// size. Normal accounts never reach them, so the "results may be incomplete"
// warning no longer appears for an ordinary all-projects scan.
const MAX_PROJECT_PAGES = 50
const MAX_WORKITEM_PAGES = 50
const SCOPES = new Set(['all', 'assigned', 'participant'])

export class CodeupError extends Error {
  constructor(code, message, details = {}) {
    super(message)
    this.name = 'CodeupError'
    this.code = code
    this.details = details
  }
}

function asString(value) {
  if (typeof value === 'string') return value
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return ''
}

function required(value, name) {
  const result = asString(value).trim()
  if (!result) throw new CodeupError('bad-request', `缺少请求参数 ${name}。`)
  return result
}

function cleanToken(token) {
  const value = required(token, 'token')
  if (/[\r\n]/.test(value)) {
    throw new CodeupError('bad-request', '访问令牌格式无效。')
  }
  return value
}

function cleanScope(scope) {
  const value = asString(scope).trim() || 'all'
  if (!SCOPES.has(value)) {
    throw new CodeupError('bad-request', '工作项范围必须是 all、assigned 或 participant。')
  }
  return value
}

function cleanPageSize(pageSize) {
  if (pageSize === undefined || pageSize === null) return DEFAULT_WORKITEM_PAGE_SIZE
  const value = Number(pageSize)
  if (!Number.isInteger(value) || value < 1 || value > MAX_WORKITEM_PAGE_SIZE) {
    throw new CodeupError('bad-request', '分页大小无效。')
  }
  return value
}

function cleanCursor(cursor) {
  if (cursor === undefined || cursor === null) return null
  if (typeof cursor !== 'object' || Array.isArray(cursor)) {
    throw new CodeupError('bad-request', '分页游标无效。')
  }
  const projectIndex = Number(cursor.projectIndex)
  const page = Number(cursor.page)
  const offset = Number(cursor.offset)
  const anchorId = cursor.anchorId === undefined || cursor.anchorId === null ? '' : asString(cursor.anchorId)
  if (
    !Number.isInteger(projectIndex) || projectIndex < 0
    || !Number.isInteger(page) || page < 1
    || !Number.isInteger(offset) || offset < 0
    || anchorId.length > 200
  ) {
    throw new CodeupError('bad-request', '分页游标无效。')
  }
  return { projectIndex, page, offset, anchorId }
}

function person(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return { id: asString(value.id), name: asString(value.name) }
}

function people(value) {
  return Array.isArray(value) ? value.map(person).filter(Boolean) : []
}

function reference(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return { id: asString(value.id), name: asString(value.name) }
}

function status(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return {
    id: asString(value.id),
    name: asString(value.name),
    displayName: asString(value.displayName),
    nameEn: asString(value.nameEn),
  }
}

/** ISO 8601 and Unix milliseconds are both seen in Yunxiao responses. */
function time(value) {
  if (value === null || value === undefined || value === '') return null
  const normalized = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value
  if (typeof normalized !== 'number' && typeof normalized !== 'string') return null
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function header(response, name) {
  const headers = response?.headers
  if (!headers) return null
  if (typeof headers.get === 'function') {
    const value = headers.get(name)
    if (value !== null && value !== undefined && value !== '') return value
  }
  if (typeof headers === 'object') {
    const key = Object.keys(headers).find(item => item.toLowerCase() === name.toLowerCase())
    if (key) return headers[key]
  }
  return null
}

function positiveInteger(value) {
  const number = Number.parseInt(value, 10)
  return Number.isSafeInteger(number) && number >= 0 ? number : null
}

function hasNextPage(response, rows, page) {
  const totalPages = positiveInteger(header(response, 'x-total-pages'))
  if (totalPages !== null) return page < totalPages
  const total = positiveInteger(header(response, 'x-total'))
  if (total !== null) return page * PAGE_SIZE < total
  const nextPage = positiveInteger(header(response, 'x-next-page'))
  if (nextPage !== null) return nextPage > page
  return rows.length === PAGE_SIZE
}

function normalizeUser(value) {
  return {
    id: asString(value?.id),
    name: asString(value?.name),
    username: asString(value?.username),
    email: asString(value?.email),
    lastOrganization: asString(value?.lastOrganization),
  }
}

function normalizeOrganization(value) {
  return {
    id: asString(value?.id),
    name: asString(value?.name),
    description: asString(value?.description),
  }
}

function normalizeProject(value) {
  return {
    id: asString(value?.id),
    name: asString(value?.name),
    description: asString(value?.description),
    customCode: asString(value?.customCode),
    scope: asString(value?.scope),
    logicalStatus: asString(value?.logicalStatus),
    status: status(value?.status),
    gmtCreate: time(value?.gmtCreate),
    gmtModified: time(value?.gmtModified),
  }
}

function customFieldValues(value) {
  if (!Array.isArray(value)) return []
  return value.filter(field => field && typeof field === 'object').map((field) => {
    const rawValues = Array.isArray(field.values) ? field.values : []
    const values = rawValues.map((entry) => {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        return { identifier: '', displayValue: asString(entry) }
      }
      return {
        identifier: asString(entry.identifier),
        displayValue: asString(entry.displayValue) || asString(entry.identifier),
      }
    })
    const displayValues = values.map(entry => entry.displayValue).filter(Boolean)
    return {
      fieldId: asString(field.fieldId),
      fieldName: asString(field.fieldName),
      fieldFormat: asString(field.fieldFormat),
      values,
      displayValues,
      displayValue: displayValues.join(', '),
    }
  })
}

function labels(value) {
  if (!Array.isArray(value)) return []
  return value.filter(label => label && typeof label === 'object').map(label => ({
    id: asString(label.id),
    name: asString(label.name),
    color: asString(label.color),
  }))
}

function normalizeWorkitem(value, project) {
  const subject = asString(value?.subject)
  return {
    id: asString(value?.id),
    subject,
    title: subject,
    description: asString(value?.description),
    formatType: asString(value?.formatType) || null,
    categoryId: asString(value?.categoryId) || null,
    logicalStatus: asString(value?.logicalStatus) || null,
    serialNumber: asString(value?.serialNumber) || null,
    status: status(value?.status),
    statusStageId: asString(value?.statusStageId) || null,
    assignedTo: person(value?.assignedTo),
    participants: people(value?.participants),
    space: reference(value?.space) ?? (project ? { id: project.id, name: project.name } : null),
    workitemType: reference(value?.workitemType),
    creator: person(value?.creator),
    modifier: person(value?.modifier),
    verifier: person(value?.verifier),
    labels: labels(value?.labels),
    customFieldValues: customFieldValues(value?.customFieldValues),
    gmtCreate: time(value?.gmtCreate),
    gmtModified: time(value?.gmtModified),
    updateStatusAt: time(value?.updateStatusAt),
  }
}

function arrayBody(result) {
  if (!Array.isArray(result.data)) {
    throw new CodeupError('invalid-response', '云效返回的数据结构无效。')
  }
  return result.data
}

function objectBody(result) {
  if (!result.data || typeof result.data !== 'object' || Array.isArray(result.data)) {
    throw new CodeupError('invalid-response', '云效返回的数据结构无效。')
  }
  return result.data
}

function httpError(statusCode) {
  if (statusCode === 401 || statusCode === 403) {
    return new CodeupError('permission-denied', '云效认证或权限检查失败，请检查令牌和只读权限。', { status: statusCode })
  }
  if (statusCode === 404) {
    return new CodeupError('not-found', '未找到请求的云效资源。', { status: statusCode })
  }
  if (statusCode === 429) {
    return new CodeupError('rate-limited', '云效请求过于频繁，请稍后重试。', { status: statusCode })
  }
  return new CodeupError('http-error', `云效请求失败（HTTP ${statusCode || '未知'}）。`, { status: statusCode || 0 })
}

export function createCodeupApi(fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== 'function') {
    throw new CodeupError('fetch-unavailable', '当前环境不支持云效 HTTP 请求。')
  }

  async function request(token, path, { method = 'GET', body, signal } = {}) {
    let response
    try {
      response = await fetchImpl(`${BASE_URL}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-yunxiao-token': token,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal,
      })
    } catch (error) {
      if (error?.name === 'AbortError' || error?.name === 'TimeoutError' || signal?.aborted) throw error
      // Fetch errors can contain request metadata; deliberately discard their text.
      throw new CodeupError('network', '云效请求失败，请检查网络后重试。')
    }

    const statusCode = Number(response?.status) || 0
    const ok = response?.ok ?? (statusCode >= 200 && statusCode < 300)
    if (!ok) throw httpError(statusCode)

    let text
    try {
      text = await response.text()
    } catch (error) {
      if (error?.name === 'AbortError' || error?.name === 'TimeoutError' || signal?.aborted) throw error
      throw new CodeupError('network', '读取云效响应失败，请检查网络后重试。')
    }
    try {
      return { data: text ? JSON.parse(text) : null, response }
    } catch {
      // Never include response text: it may contain credentials or private data.
      throw new CodeupError('invalid-response', '云效返回了无法解析的响应。', { status: statusCode })
    }
  }

  async function load({
    token,
    organizationId = '',
    projectId = 'all',
    scope = 'all',
    pageSize = DEFAULT_WORKITEM_PAGE_SIZE,
    cursor = null,
    signal,
  } = {}) {
    const accessToken = cleanToken(token)
    const requestedOrganization = asString(organizationId).trim()
    const requestedProject = asString(projectId).trim() || 'all'
    const selectedScope = cleanScope(scope)
    const effectivePageSize = cleanPageSize(pageSize)
    const parsedCursor = cleanCursor(cursor)
    const isInitialLoad = parsedCursor === null

    let user
    let organizations = []
    let selectedOrganizationId = requestedOrganization
    if (isInitialLoad || !selectedOrganizationId) {
      const [userResult, organizationResult] = await Promise.all([
        request(accessToken, '/oapi/v1/platform/user', { signal }),
        request(accessToken, '/oapi/v1/platform/organizations', { signal }),
      ])
      user = normalizeUser(objectBody(userResult))
      organizations = arrayBody(organizationResult).map(normalizeOrganization)
      selectedOrganizationId = requestedOrganization
        || organizations.find(item => item.id === user.lastOrganization)?.id
        || organizations[0]?.id
        || ''
    } else {
      const userResult = await request(accessToken, '/oapi/v1/platform/user', { signal })
      user = normalizeUser(objectBody(userResult))
    }

    const singleProject = requestedProject !== 'all'
    const selectedProjectId = singleProject ? requestedProject : 'all'
    let projects = []
    let availableProjectCount = 0
    let projectPagesLimited = false
    if (selectedOrganizationId && (isInitialLoad || !singleProject)) {
      const org = encodeURIComponent(selectedOrganizationId)
      let page = 1
      while (page <= MAX_PROJECT_PAGES) {
        const result = await request(
          accessToken,
          `/oapi/v1/projex/organizations/${org}/projects:search`,
          {
            method: 'POST',
            body: { orderBy: 'gmtCreate', page, perPage: PAGE_SIZE, sort: 'desc' },
            signal,
          },
        )
        const rows = arrayBody(result).map(normalizeProject)
        projects.push(...rows)
        const total = positiveInteger(header(result.response, 'x-total'))
        if (total !== null) availableProjectCount = Math.max(availableProjectCount, total)
        if (!hasNextPage(result.response, rows, page)) break
        page += 1
      }
      if (page > MAX_PROJECT_PAGES) projectPagesLimited = true
      availableProjectCount = Math.max(availableProjectCount, projects.length)
    }

    const selectedProjects = singleProject
      ? [projects.find(item => item.id === requestedProject) ?? { id: requestedProject, name: requestedProject }]
      : projects

    const itemsById = new Map()
    let workitemPagesLimited = false
    let hasMore = false
    let nextCursor = null
    const stats = {
      projectsTotal: availableProjectCount,
      projectsSearched: 0,
      pagesFetched: 0,
      itemsScanned: 0,
      itemsMatched: 0,
      itemsReturned: 0,
      assigned: 0,
      participant: 0,
      truncatedReason: '',
    }

    const hasRelation = (raw, relation) => {
      if (relation === 'assigned') return person(raw?.assignedTo)?.id === user.id
      return people(raw?.participants).some(item => item.id === user.id)
    }

    function merge(raw, project, relations) {
      const id = asString(raw?.id)
      if (!id) return
      const previous = itemsById.get(id)
      const mergedRelations = [...new Set([...(previous?.relations ?? []), ...relations])]
        .sort((a, b) => (a === 'assigned' ? -1 : 1) - (b === 'assigned' ? -1 : 1))
      itemsById.set(id, { ...normalizeWorkitem(raw, project), relations: mergedRelations })
    }

    /**
     * One unfiltered pass per project: both relations are computed locally from
     * the same rows, stopping as soon as one paginated batch (`effectivePageSize`)
     * is collected and returning a cursor to resume on scroll.
     */
    async function scanFromCursor() {
      const startProjectIndex = parsedCursor ? parsedCursor.projectIndex : 0
      for (let projectIndex = startProjectIndex; projectIndex < selectedProjects.length; projectIndex += 1) {
        const project = selectedProjects[projectIndex]
        stats.projectsSearched += 1
        let page = projectIndex === startProjectIndex && parsedCursor ? parsedCursor.page : 1
        let offset = projectIndex === startProjectIndex && parsedCursor ? parsedCursor.offset : 0
        let anchorId = projectIndex === startProjectIndex && parsedCursor ? parsedCursor.anchorId : ''

        while (true) {
          if (page > MAX_WORKITEM_PAGES) {
            workitemPagesLimited = true
            break
          }
          const result = await request(
            accessToken,
            `/oapi/v1/projex/organizations/${encodeURIComponent(selectedOrganizationId)}/workitems:search`,
            {
              method: 'POST',
              body: {
                category: CATEGORY,
                orderBy: 'gmtCreate',
                page,
                perPage: PAGE_SIZE,
                sort: 'desc',
                spaceId: project.id,
                spaceType: 'Project',
              },
              signal,
            },
          )
          const rows = arrayBody(result)
          stats.pagesFetched += 1
          let startIndex = 0
          if (offset > 0 || anchorId) {
            if (anchorId) {
              const anchorIndex = rows.findIndex(row => asString(row?.id) === anchorId)
              startIndex = anchorIndex >= 0 ? anchorIndex + 1 : Math.min(offset, rows.length)
            } else {
              startIndex = Math.min(offset, rows.length)
            }
            offset = 0
            anchorId = ''
          }
          const pageHasNext = hasNextPage(result.response, rows, page)

          for (let i = startIndex; i < rows.length; i += 1) {
            const raw = rows[i]
            stats.itemsScanned += 1
            const relations = []
            if ((selectedScope === 'all' || selectedScope === 'assigned') && hasRelation(raw, 'assigned')) {
              relations.push('assigned')
            }
            if ((selectedScope === 'all' || selectedScope === 'participant') && hasRelation(raw, 'participant')) {
              relations.push('participant')
            }
            if (relations.length > 0) merge(raw, project, relations)
            if (itemsById.size >= effectivePageSize) {
              const nextIndex = i + 1
              const currentId = asString(raw?.id)
              if (nextIndex < rows.length) {
                hasMore = true
                nextCursor = { projectIndex, page, offset: nextIndex, anchorId: currentId }
              } else if (pageHasNext && page + 1 <= MAX_WORKITEM_PAGES) {
                hasMore = true
                nextCursor = { projectIndex, page: page + 1, offset: 0, anchorId: currentId }
              } else {
                if (pageHasNext && page + 1 > MAX_WORKITEM_PAGES) {
                  workitemPagesLimited = true
                }
                if (projectIndex + 1 < selectedProjects.length) {
                  hasMore = true
                  nextCursor = { projectIndex: projectIndex + 1, page: 1, offset: 0, anchorId: '' }
                } else {
                  hasMore = false
                  nextCursor = null
                }
              }
              return
            }
          }

          if (!pageHasNext) break
          page += 1
        }
      }
    }

    if (selectedOrganizationId) {
      await scanFromCursor()
    }

    const items = [...itemsById.values()].slice(0, effectivePageSize)
    const truncated = projectPagesLimited || workitemPagesLimited
    stats.truncatedReason = [
      projectPagesLimited ? 'projects' : '',
      workitemPagesLimited ? 'workitems' : '',
    ].filter(Boolean).join('+')
    stats.itemsMatched = itemsById.size
    stats.itemsReturned = items.length
    stats.assigned = items.filter(item => item.relations.includes('assigned')).length
    stats.participant = items.filter(item => item.relations.includes('participant')).length

    return {
      user,
      organizations,
      projects,
      selectedOrganizationId,
      selectedProjectId,
      scope: selectedScope,
      items,
      totalCount: isInitialLoad && !hasMore ? items.length : null,
      hasMore,
      nextCursor,
      truncated,
      stats,
    }
  }

  async function count({
    token,
    organizationId = '',
    projectId = 'all',
    scope = 'all',
    signal,
  } = {}) {
    const accessToken = cleanToken(token)
    const requestedOrganization = asString(organizationId).trim()
    const requestedProject = asString(projectId).trim() || 'all'
    const selectedScope = cleanScope(scope)

    let user
    let organizations = []
    let selectedOrganizationId = requestedOrganization
    if (!selectedOrganizationId) {
      const [userResult, organizationResult] = await Promise.all([
        request(accessToken, '/oapi/v1/platform/user', { signal }),
        request(accessToken, '/oapi/v1/platform/organizations', { signal }),
      ])
      user = normalizeUser(objectBody(userResult))
      organizations = arrayBody(organizationResult).map(normalizeOrganization)
      selectedOrganizationId = organizations.find(item => item.id === user.lastOrganization)?.id
        || organizations[0]?.id
        || ''
    } else {
      const userResult = await request(accessToken, '/oapi/v1/platform/user', { signal })
      user = normalizeUser(objectBody(userResult))
    }

    const singleProject = requestedProject !== 'all'
    const selectedProjectId = singleProject ? requestedProject : 'all'
    let projects = []
    let availableProjectCount = 0
    let projectPagesLimited = false
    if (selectedOrganizationId && !singleProject) {
      const org = encodeURIComponent(selectedOrganizationId)
      let page = 1
      while (page <= MAX_PROJECT_PAGES) {
        const result = await request(
          accessToken,
          `/oapi/v1/projex/organizations/${org}/projects:search`,
          {
            method: 'POST',
            body: { orderBy: 'gmtCreate', page, perPage: PAGE_SIZE, sort: 'desc' },
            signal,
          },
        )
        const rows = arrayBody(result).map(normalizeProject)
        projects.push(...rows)
        const total = positiveInteger(header(result.response, 'x-total'))
        if (total !== null) availableProjectCount = Math.max(availableProjectCount, total)
        if (!hasNextPage(result.response, rows, page)) break
        page += 1
      }
      if (page > MAX_PROJECT_PAGES) projectPagesLimited = true
      availableProjectCount = Math.max(availableProjectCount, projects.length)
    }

    const selectedProjects = singleProject
      ? [{ id: requestedProject, name: requestedProject }]
      : projects

    const matchedIds = new Set()
    const assignedIds = new Set()
    const participantIds = new Set()
    let workitemPagesLimited = false
    const stats = {
      projectsTotal: singleProject ? 1 : availableProjectCount,
      projectsSearched: 0,
      pagesFetched: 0,
      itemsScanned: 0,
      truncatedReason: '',
    }

    const hasRelation = (raw, relation) => {
      if (relation === 'assigned') return person(raw?.assignedTo)?.id === user.id
      return people(raw?.participants).some(item => item.id === user.id)
    }

    if (selectedOrganizationId) {
      const org = encodeURIComponent(selectedOrganizationId)
      for (const project of selectedProjects) {
        stats.projectsSearched += 1
        let page = 1
        while (true) {
          if (page > MAX_WORKITEM_PAGES) {
            workitemPagesLimited = true
            break
          }
          const result = await request(
            accessToken,
            `/oapi/v1/projex/organizations/${org}/workitems:search`,
            {
              method: 'POST',
              body: {
                category: CATEGORY,
                orderBy: 'gmtCreate',
                page,
                perPage: PAGE_SIZE,
                sort: 'desc',
                spaceId: project.id,
                spaceType: 'Project',
              },
              signal,
            },
          )
          const rows = arrayBody(result)
          stats.pagesFetched += 1
          for (const raw of rows) {
            stats.itemsScanned += 1
            const id = asString(raw?.id)
            if (!id) continue
            const isAssigned = (selectedScope === 'all' || selectedScope === 'assigned') && hasRelation(raw, 'assigned')
            const isParticipant = (selectedScope === 'all' || selectedScope === 'participant') && hasRelation(raw, 'participant')
            if (isAssigned) assignedIds.add(id)
            if (isParticipant) participantIds.add(id)
            if (isAssigned || isParticipant) matchedIds.add(id)
          }
          if (!hasNextPage(result.response, rows, page)) break
          page += 1
        }
      }
    }

    const truncated = projectPagesLimited || workitemPagesLimited
    stats.truncatedReason = [
      projectPagesLimited ? 'projects' : '',
      workitemPagesLimited ? 'workitems' : '',
    ].filter(Boolean).join('+')

    return {
      selectedOrganizationId,
      selectedProjectId,
      scope: selectedScope,
      total: matchedIds.size,
      assigned: assignedIds.size,
      participant: participantIds.size,
      truncated,
      stats,
    }
  }

  async function detail({ token, organizationId, issueId, signal } = {}) {
    const accessToken = cleanToken(token)
    const org = encodeURIComponent(required(organizationId, 'organizationId'))
    const issue = encodeURIComponent(required(issueId, 'issueId'))
    const result = await request(
      accessToken,
      `/oapi/v1/projex/organizations/${org}/workitems/${issue}`,
      { signal },
    )
    return normalizeWorkitem(objectBody(result))
  }

  return { load, count, detail }
}
