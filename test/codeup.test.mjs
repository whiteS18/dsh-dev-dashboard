import test from 'node:test'
import assert from 'node:assert/strict'
import { CodeupError, createCodeupApi } from '../src/codeup.js'

const TOKEN = 'pt-unit-test-secret'
const USER_ID = 'user-1'
const ORG_ID = 'org-1'
const PROJECT_ID = 'project-1'

function response(body, { status = 200, headers = {} } = {}) {
  const normalizedHeaders = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), String(value)]),
  )
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: name => normalizedHeaders[name.toLowerCase()] ?? null },
    text: async () => typeof body === 'string' ? body : JSON.stringify(body),
  }
}

function mockFetch(handler) {
  const calls = []
  const fetchImpl = async (url, init = {}) => {
    const call = { url: String(url), init }
    calls.push(call)
    return handler(call)
  }
  return { calls, fetchImpl }
}

function body(call) {
  return call.init.body ? JSON.parse(call.init.body) : null
}

function pathname(call) {
  return new URL(call.url).pathname
}

function page(bodyValue, totalPages = 1) {
  return response(bodyValue, {
    headers: {
      'x-page': 1,
      'x-per-page': 200,
      'x-total-pages': totalPages,
      'x-total': bodyValue.length,
    },
  })
}

function workitem(id, { assignedTo = null, participants = [], modified = 1700000000000 } = {}) {
  return {
    id,
    subject: `Subject ${id}`,
    description: `Description ${id}`,
    formatType: 'MARKDOWN',
    categoryId: 'Task',
    serialNumber: `TASK-${id}`,
    assignedTo: assignedTo ? { id: assignedTo, name: assignedTo } : null,
    participants: participants.map(idValue => ({ id: idValue, name: idValue })),
    space: { id: PROJECT_ID, name: 'Project one' },
    workitemType: { id: 'type-task', name: '任务' },
    status: { id: '100010', name: '处理中', displayName: '处理中', nameEn: 'In Progress' },
    gmtCreate: 1690000000000,
    gmtModified: modified,
    updateStatusAt: null,
  }
}

function metadataRoute(call) {
  if (pathname(call) === '/oapi/v1/platform/user') {
    return response({
      id: USER_ID,
      name: 'Test user',
      username: 'tester',
      email: 'tester@example.invalid',
      lastOrganization: ORG_ID,
    })
  }
  if (pathname(call) === '/oapi/v1/platform/organizations') {
    return response([{ id: ORG_ID, name: 'Org one', description: 'Unit test' }])
  }
  if (pathname(call).endsWith('/projects:search')) {
    return page([{
      id: PROJECT_ID,
      name: 'Project one',
      description: 'Project description',
      customCode: 'PO',
      gmtCreate: 1690000000000,
      gmtModified: null,
      status: { id: 'doing', name: '进行中' },
    }])
  }
  return null
}

test('load(all) uses one unfiltered pass per project and merges local relations', async () => {
  let searchCount = 0
  const both = workitem('both', { assignedTo: USER_ID, participants: [USER_ID] })
  const participantOnly = workitem('participant-only', {
    assignedTo: 'someone-else',
    participants: [USER_ID],
  })
  const unrelated = workitem('unrelated', {
    assignedTo: 'someone-else',
    participants: ['another-user'],
  })
  const { calls, fetchImpl } = mockFetch((call) => {
    const metadata = metadataRoute(call)
    if (metadata) return metadata
    if (pathname(call).endsWith('/workitems:search')) {
      searchCount += 1
      const payload = body(call)
      assert.equal(payload.category, 'Req,Task,Bug')
      assert.equal(payload.perPage, 200)
      assert.equal(payload.spaceId, PROJECT_ID)
      assert.equal(payload.spaceType, 'Project')
      assert.equal(payload.page, 1)
      // Both relations come from one server response; no assignedTo filter.
      assert.equal(Object.hasOwn(payload, 'conditions'), false)
      return page([both, participantOnly, unrelated])
    }
    throw new Error(`Unexpected request: ${call.url}`)
  })

  const result = await createCodeupApi(fetchImpl).load({
    token: TOKEN,
    organizationId: ORG_ID,
    projectId: PROJECT_ID,
    scope: 'all',
  })

  assert.equal(searchCount, 1)
  assert.equal(result.selectedOrganizationId, ORG_ID)
  assert.equal(result.selectedProjectId, PROJECT_ID)
  assert.equal(result.scope, 'all')
  assert.equal(result.truncated, false)
  assert.deepEqual(result.items.map(item => item.id), ['both', 'participant-only'])
  assert.deepEqual(result.items[0].relations, ['assigned', 'participant'])
  assert.deepEqual(result.items[1].relations, ['participant'])
  assert.equal(result.stats.itemsScanned, 3)
  assert.equal(result.stats.itemsMatched, 2)
  assert.equal(result.stats.itemsReturned, 2)
  assert.equal(result.stats.assigned, 1)
  assert.equal(result.stats.participant, 2)
  assert.ok(calls.length >= 4)
  for (const call of calls) {
    assert.equal(call.init.headers['x-yunxiao-token'], TOKEN)
    assert.equal(call.init.headers['Content-Type'], 'application/json')
  }
  assert.equal(JSON.stringify(result).includes(TOKEN), false)
})

test('load(participant) scans without an undocumented participant server filter and filters locally', async () => {
  let searchCount = 0
  const { fetchImpl } = mockFetch((call) => {
    const metadata = metadataRoute(call)
    if (metadata) return metadata
    if (pathname(call).endsWith('/workitems:search')) {
      searchCount += 1
      const payload = body(call)
      assert.equal(Object.hasOwn(payload, 'conditions'), false)
      return page([
        workitem('mine', { participants: [USER_ID] }),
        workitem('not-mine', { participants: ['someone-else'] }),
        workitem('assigned-is-not-enough', { assignedTo: USER_ID, participants: [] }),
      ])
    }
    throw new Error(`Unexpected request: ${call.url}`)
  })

  const result = await createCodeupApi(fetchImpl).load({
    token: TOKEN,
    organizationId: ORG_ID,
    projectId: PROJECT_ID,
    scope: 'participant',
  })
  assert.equal(searchCount, 1)
  assert.deepEqual(result.items.map(item => item.id), ['mine'])
  assert.deepEqual(result.items[0].relations, ['participant'])
})

test('load scans every project and follows every workitem page without a false truncation warning', async () => {
  const projects = Array.from({ length: 6 }, (_, index) => ({
    id: `project-${index + 1}`,
    name: `Project ${index + 1}`,
  }))
  const scannedProjects = []
  const { fetchImpl } = mockFetch((call) => {
    if (pathname(call) === '/oapi/v1/platform/user') {
      return response({ id: USER_ID, name: 'Test user', lastOrganization: ORG_ID })
    }
    if (pathname(call) === '/oapi/v1/platform/organizations') {
      return response([{ id: ORG_ID, name: 'Org one' }])
    }
    if (pathname(call).endsWith('/projects:search')) {
      return response(projects, { headers: { 'x-total': 6, 'x-total-pages': 1 } })
    }
    if (pathname(call).endsWith('/workitems:search')) {
      const payload = body(call)
      scannedProjects.push(payload.spaceId)
      if (payload.page === 1) {
        return page([workitem(`${payload.spaceId}-a`, { assignedTo: USER_ID })], 2)
      }
      return page([workitem(`${payload.spaceId}-b`, { participants: [USER_ID] })], 2)
    }
    throw new Error(`Unexpected request: ${call.url}`)
  })
  const result = await createCodeupApi(fetchImpl).load({
    token: TOKEN,
    organizationId: ORG_ID,
    scope: 'all',
  })
  assert.equal(result.truncated, false)
  assert.equal(result.stats.truncatedReason, '')
  assert.equal(result.stats.projectsSearched, 6)
  assert.equal(result.stats.pagesFetched, 12)
  assert.equal(result.items.length, 12)
  assert.deepEqual(scannedProjects, projects.flatMap(project => [project.id, project.id]))
})

test('only an extreme page count sets truncated, with an explicit reason', async () => {
  const { fetchImpl } = mockFetch((call) => {
    const metadata = metadataRoute(call)
    if (metadata) return metadata
    if (pathname(call).endsWith('/workitems:search')) {
      // The API keeps claiming more pages: the per-project safety guard stops it.
      return page([], 9999)
    }
    throw new Error(`Unexpected request: ${call.url}`)
  })
  const result = await createCodeupApi(fetchImpl).load({
    token: TOKEN,
    organizationId: ORG_ID,
    projectId: PROJECT_ID,
  })
  assert.equal(result.truncated, true)
  assert.match(result.stats.truncatedReason, /workitems/)
  assert.ok(result.stats.pagesFetched >= 50)
})

test('detail maps display values and normalizes ISO, Unix milliseconds, and null times', async () => {
  const { calls, fetchImpl } = mockFetch((call) => {
    assert.equal(
      pathname(call),
      `/oapi/v1/projex/organizations/${ORG_ID}/workitems/issue-1`,
    )
    return response({
      ...workitem('issue-1', { assignedTo: USER_ID, participants: [USER_ID] }),
      description: '# Detailed description',
      formatType: 'MARKDOWN',
      gmtCreate: 1700000000000,
      gmtModified: '2024-01-02T03:04:05.000Z',
      updateStatusAt: null,
      customFieldValues: [{
        fieldId: 'priority',
        fieldName: '优先级',
        fieldFormat: 'list',
        values: [
          { identifier: 'high', displayValue: '高' },
          { identifier: 'fallback-id', displayValue: '' },
        ],
      }],
    })
  })
  const result = await createCodeupApi(fetchImpl).detail({
    token: TOKEN,
    organizationId: ORG_ID,
    issueId: 'issue-1',
  })

  assert.equal(calls.length, 1)
  assert.equal(calls[0].init.headers['x-yunxiao-token'], TOKEN)
  assert.equal(result.description, '# Detailed description')
  assert.equal(result.formatType, 'MARKDOWN')
  assert.equal(result.status.displayName, '处理中')
  assert.equal(result.assignedTo.id, USER_ID)
  assert.equal(result.participants[0].id, USER_ID)
  assert.equal(result.space.id, PROJECT_ID)
  assert.equal(result.workitemType.name, '任务')
  assert.equal(result.serialNumber, 'TASK-issue-1')
  assert.equal(result.gmtCreate, new Date(1700000000000).toISOString())
  assert.equal(result.gmtModified, '2024-01-02T03:04:05.000Z')
  assert.equal(result.updateStatusAt, null)
  assert.deepEqual(result.customFieldValues[0].displayValues, ['高', 'fallback-id'])
  assert.equal(result.customFieldValues[0].displayValue, '高, fallback-id')
  assert.deepEqual(result.customFieldValues[0].values, [
    { identifier: 'high', displayValue: '高' },
    { identifier: 'fallback-id', displayValue: 'fallback-id' },
  ])
  assert.equal(JSON.stringify(result).includes(TOKEN), false)
})

test('HTTP and network errors never expose token, authentication headers, or raw response text', async () => {
  const rawResponse = JSON.stringify({
    message: `Authentication failed for ${TOKEN}; RAW_RESPONSE_MUST_NOT_LEAK`,
    request: { 'x-yunxiao-token': TOKEN },
  })
  const httpApi = createCodeupApi(async () => response(rawResponse, { status: 401 }))
  await assert.rejects(
    httpApi.detail({ token: TOKEN, organizationId: ORG_ID, issueId: 'issue-1' }),
    (error) => {
      assert.ok(error instanceof CodeupError)
      assert.equal(error.code, 'permission-denied')
      assert.equal(error.details.status, 401)
      const exposed = `${error.message}\n${JSON.stringify(error.details)}`
      assert.equal(exposed.includes(TOKEN), false)
      assert.equal(exposed.includes('RAW_RESPONSE_MUST_NOT_LEAK'), false)
      assert.equal(exposed.includes('x-yunxiao-token'), false)
      return true
    },
  )

  const networkApi = createCodeupApi(async () => {
    throw new Error(`Socket failed for ${TOKEN}; RAW_NETWORK_ERROR_MUST_NOT_LEAK`)
  })
  await assert.rejects(
    networkApi.detail({ token: TOKEN, organizationId: ORG_ID, issueId: 'issue-1' }),
    (error) => {
      assert.ok(error instanceof CodeupError)
      assert.equal(error.code, 'network')
      assert.equal(error.message.includes(TOKEN), false)
      assert.equal(error.message.includes('RAW_NETWORK_ERROR_MUST_NOT_LEAK'), false)
      return true
    },
  )
})

test('load paginates 20 matched work items per call and resumes seamlessly via cursor', async () => {
  const projects = [
    { id: 'proj-1', name: 'Project 1' },
    { id: 'proj-2', name: 'Project 2' },
  ]
  const proj1Items = Array.from({ length: 28 }, (_, index) =>
    workitem(`p1-${index + 1}`, { assignedTo: USER_ID }))
  const proj2Items = Array.from({ length: 17 }, (_, index) =>
    workitem(`p2-${index + 1}`, { participants: [USER_ID] }))
  const requestedPaths = []
  let shiftInserted = false

  const { fetchImpl } = mockFetch((call) => {
    requestedPaths.push(pathname(call))
    if (pathname(call) === '/oapi/v1/platform/user') {
      return response({ id: USER_ID, name: 'Test user', lastOrganization: ORG_ID })
    }
    if (pathname(call) === '/oapi/v1/platform/organizations') {
      return response([{ id: ORG_ID, name: 'Org one' }])
    }
    if (pathname(call).endsWith('/projects:search')) {
      return response(projects, { headers: { 'x-total': 2, 'x-total-pages': 1 } })
    }
    if (pathname(call).endsWith('/workitems:search')) {
      const payload = body(call)
      if (payload.spaceId === 'proj-1') {
        const rows = shiftInserted
          ? [workitem('new-top', { assignedTo: USER_ID }), ...proj1Items]
          : proj1Items
        return page(rows, 1)
      }
      if (payload.spaceId === 'proj-2') {
        return page(proj2Items, 1)
      }
    }
    throw new Error(`Unexpected request: ${call.url}`)
  })

  const api = createCodeupApi(fetchImpl)

  // First page: stops at 20 items in proj-1 without scanning proj-2.
  const first = await api.load({ token: TOKEN, organizationId: ORG_ID, scope: 'all' })
  assert.equal(first.items.length, 20)
  assert.equal(first.hasMore, true)
  assert.deepEqual(first.nextCursor, { projectIndex: 0, page: 1, offset: 20, anchorId: 'p1-20' })
  assert.equal(first.stats.projectsSearched, 1)
  assert.equal(first.items[0].id, 'p1-1')
  assert.equal(first.items[19].id, 'p1-20')

  // Simulate an item inserted at the top before page 2 is fetched: anchorId keeps position exact.
  shiftInserted = true
  requestedPaths.length = 0
  const second = await api.load({
    token: TOKEN,
    organizationId: ORG_ID,
    scope: 'all',
    cursor: first.nextCursor,
  })
  assert.equal(requestedPaths.includes('/oapi/v1/platform/organizations'), false)
  assert.equal(second.items.length, 20)
  assert.equal(second.hasMore, true)
  assert.deepEqual(second.items.map(item => item.id), [
    ...Array.from({ length: 8 }, (_, i) => `p1-${21 + i}`),
    ...Array.from({ length: 12 }, (_, i) => `p2-${1 + i}`),
  ])

  const third = await api.load({
    token: TOKEN,
    organizationId: ORG_ID,
    scope: 'all',
    cursor: second.nextCursor,
  })
  assert.equal(third.items.length, 5)
  assert.equal(third.hasMore, false)
  assert.equal(third.nextCursor, null)
  assert.deepEqual(third.items.map(item => item.id), [
    'p2-13', 'p2-14', 'p2-15', 'p2-16', 'p2-17',
  ])
})

test('load returns hasMore=false on exact 20-item boundary and skips project search on single-project cursor load', async () => {
  const exactItems = Array.from({ length: 20 }, (_, index) =>
    workitem(`exact-${index + 1}`, { assignedTo: USER_ID }))
  const requestedPaths = []
  const { fetchImpl } = mockFetch((call) => {
    requestedPaths.push(pathname(call))
    const metadata = metadataRoute(call)
    if (metadata) return metadata
    if (pathname(call).endsWith('/workitems:search')) {
      return page(exactItems, 1)
    }
    throw new Error(`Unexpected request: ${call.url}`)
  })

  const api = createCodeupApi(fetchImpl)
  const exact = await api.load({
    token: TOKEN,
    organizationId: ORG_ID,
    projectId: PROJECT_ID,
  })
  assert.equal(exact.items.length, 20)
  assert.equal(exact.hasMore, false)
  assert.equal(exact.nextCursor, null)

  requestedPaths.length = 0
  await api.load({
    token: TOKEN,
    organizationId: ORG_ID,
    projectId: PROJECT_ID,
    cursor: { projectIndex: 0, page: 1, offset: 10, anchorId: 'exact-10' },
  })
  assert.equal(requestedPaths.includes('/oapi/v1/platform/organizations'), false)
  assert.equal(requestedPaths.some(p => p.endsWith('/projects:search')), false)

  await assert.rejects(
    api.load({ token: TOKEN, organizationId: ORG_ID, pageSize: 0 }),
    error => error instanceof CodeupError && error.code === 'bad-request',
  )
  await assert.rejects(
    api.load({ token: TOKEN, organizationId: ORG_ID, cursor: { projectIndex: -1, page: 1, offset: 0 } }),
    error => error instanceof CodeupError && error.code === 'bad-request',
  )
})

test('count scans all selected projects and pages to compute exact matched totals', async () => {
  const projects = [
    { id: 'proj-1', name: 'Project 1' },
    { id: 'proj-2', name: 'Project 2' },
  ]
  const proj1Page1 = Array.from({ length: 22 }, (_, i) => workitem(`p1-a-${i + 1}`, { assignedTo: USER_ID }))
  const proj1Page2 = [
    workitem('p1-b-1', { assignedTo: USER_ID, participants: [USER_ID] }),
    workitem('p1-other', { assignedTo: 'someone-else' }),
  ]
  const proj2Page1 = Array.from({ length: 12 }, (_, i) => workitem(`p2-${i + 1}`, { participants: [USER_ID] }))

  const { fetchImpl } = mockFetch((call) => {
    if (pathname(call) === '/oapi/v1/platform/user') {
      return response({ id: USER_ID, name: 'Test user', lastOrganization: ORG_ID })
    }
    if (pathname(call) === '/oapi/v1/platform/organizations') {
      return response([{ id: ORG_ID, name: 'Org one' }])
    }
    if (pathname(call).endsWith('/projects:search')) {
      return response(projects, { headers: { 'x-total': 2, 'x-total-pages': 1 } })
    }
    if (pathname(call).endsWith('/workitems:search')) {
      const payload = body(call)
      if (payload.spaceId === 'proj-1') {
        return payload.page === 1 ? page(proj1Page1, 2) : page(proj1Page2, 2)
      }
      if (payload.spaceId === 'proj-2') {
        return page(proj2Page1, 1)
      }
    }
    throw new Error(`Unexpected request: ${call.url}`)
  })

  const api = createCodeupApi(fetchImpl)
  const firstPage = await api.load({ token: TOKEN, organizationId: ORG_ID, scope: 'all' })
  assert.equal(firstPage.items.length, 20)
  assert.equal(firstPage.hasMore, true)
  assert.equal(firstPage.totalCount, null)

  const summary = await api.count({ token: TOKEN, organizationId: ORG_ID, scope: 'all' })
  assert.equal(summary.total, 35)
  assert.equal(summary.assigned, 23)
  assert.equal(summary.participant, 13)
  assert.equal(summary.truncated, false)

  const singleProject = await api.count({ token: TOKEN, organizationId: ORG_ID, projectId: 'proj-2', scope: 'all' })
  assert.equal(singleProject.total, 12)
  assert.equal(singleProject.assigned, 0)
  assert.equal(singleProject.participant, 12)
})

test('repositories resolves and deduplicates task-linked repositories from extRelationRecords and custom fields', async () => {
  const { fetchImpl } = mockFetch((call) => {
    const path = pathname(call)
    if (path === '/oapi/v1/platform/user') {
      return response({ id: USER_ID, name: 'Test user', username: 'git-tester', lastOrganization: ORG_ID })
    }
    if (path === `/oapi/v1/projex/organizations/${ORG_ID}/workitems/issue-1`) {
      return response({
        ...workitem('issue-1'),
        customFieldValues: [{
          fieldId: 'cf-repo',
          fieldName: '关联仓库',
          fieldFormat: 'text',
          values: [{ identifier: '', displayValue: 'https://codeup.aliyun.com/org-1/group/web-app.git' }],
        }],
      })
    }
    if (path === `/oapi/v1/projex/organizations/${ORG_ID}/workitems/issue-1/extRelationRecords`) {
      return response([
        { id: 'rel-1', category: 'codeupBranch', projectId: '101', url: 'https://codeup.aliyun.com/org-1/backend/tree/feat-1' },
        { id: 'rel-2', category: 'codeupCommit', projectId: '101', url: 'https://codeup.aliyun.com/org-1/backend/commit/abc' },
        { id: 'rel-3', category: 'ChangeRequest', changeRequestId: 'cr-1', url: 'https://flow.aliyun.com/cr/1' },
      ])
    }
    if (path === `/oapi/v1/codeup/organizations/${ORG_ID}/repositories/101`) {
      return response({
        id: 101,
        name: 'backend',
        path: 'backend',
        pathWithNamespace: 'org-1/backend',
        httpUrlToRepository: 'https://codeup.aliyun.com/org-1/backend.git',
        sshUrlToRepo: 'git@codeup.aliyun.com:org-1/backend.git',
        webUrl: 'https://codeup.aliyun.com/org-1/backend',
      })
    }
    if (path === `/oapi/v1/codeup/organizations/${ORG_ID}/repositories/${encodeURIComponent('org-1/group/web-app')}`) {
      return response({
        id: 202,
        name: 'web-app',
        path: 'web-app',
        pathWithNamespace: 'org-1/group/web-app',
        httpUrlToRepo: 'https://codeup.aliyun.com/org-1/group/web-app.git',
        sshUrlToRepo: 'git@codeup.aliyun.com:org-1/group/web-app.git',
      })
    }
    throw new Error(`Unexpected request: ${call.url}`)
  })

  const result = await createCodeupApi(fetchImpl).repositories({
    token: TOKEN,
    organizationId: ORG_ID,
    issueId: 'issue-1',
  })
  assert.equal(result.user.username, 'git-tester')
  assert.deepEqual(result.repositories.map(item => ({ id: item.id, path: item.path, httpUrl: item.httpUrl })), [
    { id: '101', path: 'backend', httpUrl: 'https://codeup.aliyun.com/org-1/backend.git' },
    { id: '202', path: 'web-app', httpUrl: 'https://codeup.aliyun.com/org-1/group/web-app.git' },
  ])
})

test('repositories falls back to per-category extRelationRecords on 400 and returns empty when unlinked', async () => {
  const seenUrls = []
  const { fetchImpl } = mockFetch((call) => {
    seenUrls.push(call.url)
    const parsed = new URL(call.url)
    if (parsed.pathname === '/oapi/v1/platform/user') {
      return response({ id: USER_ID, name: 'Test user', username: 'git-tester' })
    }
    if (parsed.pathname === `/oapi/v1/projex/organizations/${ORG_ID}/workitems/issue-empty`) {
      return response(workitem('issue-empty'))
    }
    if (parsed.pathname === `/oapi/v1/projex/organizations/${ORG_ID}/workitems/issue-empty/extRelationRecords`) {
      if (!parsed.searchParams.get('category')) {
        return response({ error: 'category required' }, { status: 400 })
      }
      return response([])
    }
    throw new Error(`Unexpected request: ${call.url}`)
  })

  const result = await createCodeupApi(fetchImpl).repositories({
    token: TOKEN,
    organizationId: ORG_ID,
    issueId: 'issue-empty',
  })
  assert.deepEqual(result.repositories, [])
  assert.ok(seenUrls.some(url => url.includes('category=codeupBranch')))
  assert.ok(seenUrls.some(url => url.includes('category=codeupMergeRequest')))
})

test('listRepositories lists paginated organization repositories with search and repository() resolves a single repo', async () => {
  const seenUrls = []
  const { fetchImpl } = mockFetch((call) => {
    seenUrls.push(call.url)
    const parsed = new URL(call.url)
    if (parsed.pathname === '/oapi/v1/platform/user') {
      return response({ id: USER_ID, name: 'Test user', username: 'git-tester', lastOrganization: ORG_ID })
    }
    if (parsed.pathname === '/oapi/v1/platform/organizations') {
      return response([{ id: ORG_ID, name: 'Org one', description: 'Unit test' }])
    }
    if (parsed.pathname === `/oapi/v1/codeup/organizations/${ORG_ID}/repositories`) {
      assert.equal(parsed.searchParams.get('page'), '1')
      assert.equal(parsed.searchParams.get('perPage'), '20')
      assert.equal(parsed.searchParams.get('search'), 'backend')
      assert.equal(parsed.searchParams.get('orderBy'), 'last_activity_at')
      assert.equal(parsed.searchParams.get('sort'), 'desc')
      return response(
        [{
          id: 101,
          name: 'backend',
          path: 'backend',
          pathWithNamespace: 'org-1/backend',
          description: 'Core backend service',
          visibilityLevel: 0,
          archived: false,
          defaultBranch: 'main',
          httpUrlToRepo: 'https://codeup.aliyun.com/org-1/backend.git',
          sshUrlToRepo: 'git@codeup.aliyun.com:org-1/backend.git',
          webUrl: 'https://codeup.aliyun.com/org-1/backend',
          createdAt: '2026-01-01T00:00:00Z',
          lastActivityAt: '2026-11-20T08:00:00Z',
        }],
        { headers: { 'x-total': '25', 'x-total-pages': '2' } },
      )
    }
    if (parsed.pathname === `/oapi/v1/codeup/organizations/${ORG_ID}/repositories/101`) {
      return response({
        id: 101,
        name: 'backend',
        path: 'backend',
        pathWithNamespace: 'org-1/backend',
        httpUrlToRepo: 'https://codeup.aliyun.com/org-1/backend.git',
        sshUrlToRepo: 'git@codeup.aliyun.com:org-1/backend.git',
        webUrl: 'https://codeup.aliyun.com/org-1/backend',
      })
    }
    throw new Error(`Unexpected request: ${call.url}`)
  })

  const api = createCodeupApi(fetchImpl)
  const listed = await api.listRepositories({
    token: TOKEN,
    search: 'backend',
    page: 1,
    pageSize: 20,
  })
  assert.equal(listed.selectedOrganizationId, ORG_ID)
  assert.equal(listed.organizations.length, 1)
  assert.equal(listed.totalCount, 25)
  assert.equal(listed.hasMore, true)
  assert.equal(listed.nextPage, 2)
  assert.equal(listed.items.length, 1)
  assert.equal(listed.items[0].id, '101')
  assert.equal(listed.items[0].fullName, 'org-1/backend')
  assert.equal(listed.items[0].visibility, 'private')
  assert.equal(listed.items[0].defaultBranch, 'main')
  assert.equal(listed.items[0].description, 'Core backend service')

  const single = await api.repository({
    token: TOKEN,
    organizationId: ORG_ID,
    repositoryId: '101',
  })
  assert.equal(single.user.username, 'git-tester')
  assert.equal(single.repository.path, 'backend')
  assert.equal(single.repository.httpUrl, 'https://codeup.aliyun.com/org-1/backend.git')
  assert.equal(JSON.stringify(listed).includes(TOKEN), false)
})
