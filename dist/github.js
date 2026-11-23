const BASE_URL = 'https://api.github.com'
const PAGE_SIZE = 100
const DEFAULT_ISSUE_PAGE_SIZE = 20
const MAX_ISSUE_PAGE_SIZE = 200
const MAX_REPO_PAGES = 10
const MAX_ISSUE_PAGES = 50
const SCOPES = new Set(['all', 'assigned', 'participant'])
const REPO_SEGMENT = /^[A-Za-z0-9._-]+$/

export class GitHubError extends Error {
  constructor(code, message, details = {}) {
    super(message)
    this.name = 'GitHubError'
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
  if (!result) throw new GitHubError('bad-request', `缺少请求参数 ${name}。`)
  return result
}

function cleanToken(token) {
  const value = required(token, 'token')
  if (/[\r\n]/.test(value)) {
    throw new GitHubError('bad-request', '访问令牌格式无效。')
  }
  return value
}

function cleanScope(scope) {
  const value = asString(scope).trim() || 'all'
  if (!SCOPES.has(value)) {
    throw new GitHubError('bad-request', 'Issue 范围必须是 all、assigned 或 participant。')
  }
  return value
}

function cleanPageSize(pageSize) {
  if (pageSize === undefined || pageSize === null) return DEFAULT_ISSUE_PAGE_SIZE
  const value = Number(pageSize)
  if (!Number.isInteger(value) || value < 1 || value > MAX_ISSUE_PAGE_SIZE) {
    throw new GitHubError('bad-request', '分页大小无效。')
  }
  return value
}

function cleanCursor(cursor) {
  if (cursor === undefined || cursor === null) return null
  if (typeof cursor !== 'object' || Array.isArray(cursor)) {
    throw new GitHubError('bad-request', '分页游标无效。')
  }
  const projectIndex = Number(cursor.projectIndex)
  const page = Number(cursor.page)
  const offset = Number(cursor.offset)
  const anchorId = cursor.anchorId === undefined || cursor.anchorId === null ? '' : asString(cursor.anchorId)
  const mode = cursor.mode === undefined || cursor.mode === null ? '' : asString(cursor.mode).trim()
  if (
    !Number.isInteger(projectIndex) || projectIndex < 0
    || !Number.isInteger(page) || page < 1
    || !Number.isInteger(offset) || offset < 0
    || anchorId.length > 200
    || (mode && mode !== 'global' && mode !== 'repos')
  ) {
    throw new GitHubError('bad-request', '分页游标无效。')
  }
  return mode
    ? { projectIndex, page, offset, anchorId, mode }
    : { projectIndex, page, offset, anchorId }
}

function isSafeRepoSegment(segment) {
  const value = asString(segment).trim()
  return Boolean(value && value !== '.' && value !== '..' && REPO_SEGMENT.test(value))
}

function parseRepoFullName(value) {
  const raw = asString(value).trim()
  const parts = raw.split('/')
  if (parts.length !== 2) return null
  const [owner, repo] = parts
  if (!isSafeRepoSegment(owner) || !isSafeRepoSegment(repo)) return null
  return { owner, repo, fullName: `${owner}/${repo}` }
}

function parseIssueId(value) {
  const raw = required(value, 'issueId')
  const hashIndex = raw.lastIndexOf('#')
  if (hashIndex <= 0) {
    throw new GitHubError('bad-request', 'GitHub Issue 标识无效。')
  }
  const repoRef = parseRepoFullName(raw.slice(0, hashIndex))
  const numberText = raw.slice(hashIndex + 1).trim()
  if (!repoRef || !/^\d+$/.test(numberText)) {
    throw new GitHubError('bad-request', 'GitHub Issue 标识无效。')
  }
  const number = Number.parseInt(numberText, 10)
  if (!Number.isSafeInteger(number) || number < 1) {
    throw new GitHubError('bad-request', 'GitHub Issue 标识无效。')
  }
  return { ...repoRef, number }
}

function time(value) {
  if (value === null || value === undefined || value === '') return null
  const date = new Date(value)
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

function hasNextPage(response, rows, perPage = PAGE_SIZE) {
  const link = header(response, 'link')
  if (link) {
    return /<[^>]+>\s*;\s*rel="next"/i.test(link)
  }
  return rows.length === perPage
}

function safeGitHubUrl(rawUrl) {
  const trimmed = asString(rawUrl).trim()
  if (!trimmed) return ''
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return ''
    return parsed.href
  } catch {
    return ''
  }
}

function sanitizeRepoDirName(value) {
  const raw = asString(value).trim().replace(/\.git$/i, '')
  if (!raw || raw === '.' || raw === '..') return ''
  if (/[\\/\0\r\n]/.test(raw) || raw.startsWith('-')) return ''
  return raw
}

function normalizeUser(value) {
  const login = asString(value?.login)
  return {
    id: asString(value?.id),
    name: asString(value?.name) || login,
    username: login,
    email: asString(value?.email),
  }
}

function normalizePerson(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const login = asString(value.login)
  const id = asString(value.id)
  if (!login && !id) return null
  return { id: id || login, name: login || id }
}

function normalizeLabels(value) {
  if (!Array.isArray(value)) return []
  return value
    .map((entry) => {
      if (typeof entry === 'string') {
        const name = entry.trim()
        return name ? { id: name, name, color: '' } : null
      }
      if (!entry || typeof entry !== 'object') return null
      const name = asString(entry.name).trim()
      if (!name) return null
      return {
        id: asString(entry.id) || name,
        name,
        color: asString(entry.color),
      }
    })
    .filter(Boolean)
}

function extractRepoFromIssue(raw, fallbackRepo = null) {
  if (raw?.repository && typeof raw.repository === 'object') {
    const fullName = asString(raw.repository.full_name).trim()
    const parsed = parseRepoFullName(fullName)
    if (parsed) {
      return {
        ...parsed,
        id: asString(raw.repository.id),
        httpUrl: asString(raw.repository.clone_url),
        sshUrl: asString(raw.repository.ssh_url),
        webUrl: asString(raw.repository.html_url),
      }
    }
  }
  const repoUrl = asString(raw?.repository_url).trim()
  if (repoUrl) {
    try {
      const segments = new URL(repoUrl).pathname.split('/').filter(Boolean)
      const reposIdx = segments.lastIndexOf('repos')
      if (reposIdx >= 0 && segments.length >= reposIdx + 3) {
        const parsed = parseRepoFullName(`${segments[reposIdx + 1]}/${segments[reposIdx + 2]}`)
        if (parsed) return parsed
      }
    } catch {
      // Fall through to html_url / fallbackRepo.
    }
  }
  const htmlUrl = asString(raw?.html_url).trim()
  if (htmlUrl) {
    try {
      const segments = new URL(htmlUrl).pathname.split('/').filter(Boolean)
      if (segments.length >= 2) {
        const parsed = parseRepoFullName(`${segments[0]}/${segments[1]}`)
        if (parsed) return parsed
      }
    } catch {
      // Fall through to fallbackRepo.
    }
  }
  if (fallbackRepo) {
    const parsed = parseRepoFullName(fallbackRepo.id || fallbackRepo.fullName)
    if (parsed) return parsed
  }
  return null
}

function classifyIssueType(raw, labels) {
  const typeName = asString(raw?.type?.name).trim()
  const lowerType = typeName.toLowerCase()
  const labelNames = labels.map(item => item.name.toLowerCase())

  const isBug = lowerType === 'bug'
    || lowerType === 'defect'
    || typeName.includes('缺陷')
    || labelNames.some(name => name === 'bug' || name === 'defect' || name.startsWith('type: bug') || name.startsWith('kind/bug'))
  if (isBug) {
    return {
      categoryId: 'Bug',
      workitemType: { id: 'bug', name: typeName || 'Bug' },
    }
  }

  const isReq = lowerType === 'feature'
    || lowerType === 'enhancement'
    || lowerType === 'requirement'
    || typeName.includes('需求')
    || labelNames.some(name =>
      name === 'enhancement' || name === 'feature' || name === 'feature-request'
      || name.startsWith('type: feature') || name.startsWith('kind/feature'))
  if (isReq) {
    return {
      categoryId: 'Req',
      workitemType: { id: 'req', name: typeName || 'Feature' },
    }
  }

  const isTask = lowerType === 'task'
    || typeName.includes('任务')
    || labelNames.some(name => name === 'task' || name.startsWith('kind/task'))
  if (isTask) {
    return {
      categoryId: 'Task',
      workitemType: { id: 'task', name: typeName || 'Task' },
    }
  }

  return {
    categoryId: 'Issue',
    workitemType: { id: 'issue', name: typeName || 'Issue' },
  }
}

function classifyIssueStage(raw, assignees, labels) {
  const state = asString(raw?.state).trim().toLowerCase()
  const reason = asString(raw?.state_reason).trim().toLowerCase()
  if (state === 'closed') {
    if (reason === 'not_planned') {
      return {
        statusStageId: '5',
        status: { id: 'not_planned', name: 'Not Planned', displayName: 'Not Planned', nameEn: 'Not Planned' },
      }
    }
    return {
      statusStageId: '4',
      status: { id: 'closed', name: 'Closed', displayName: 'Closed', nameEn: 'Closed' },
    }
  }
  const hasInProgressLabel = labels.some((label) => {
    const lower = label.name.toLowerCase()
    return lower === 'in progress' || lower === 'in-progress' || lower === 'wip' || lower === 'doing'
  })
  if (assignees.length > 0 || hasInProgressLabel) {
    return {
      statusStageId: '2',
      status: { id: 'open', name: 'Open', displayName: 'Open', nameEn: 'Open' },
    }
  }
  return {
    statusStageId: '1',
    status: { id: 'open', name: 'Open', displayName: 'Open', nameEn: 'Open' },
  }
}

function buildCustomFields(raw) {
  const fields = []
  const milestoneTitle = asString(raw?.milestone?.title).trim()
  if (milestoneTitle) {
    fields.push({
      fieldId: 'milestone',
      fieldName: 'Milestone',
      fieldFormat: 'text',
      values: [{ identifier: asString(raw.milestone.number), displayValue: milestoneTitle }],
      displayValues: [milestoneTitle],
      displayValue: milestoneTitle,
    })
  }
  const comments = Number(raw?.comments)
  if (Number.isInteger(comments) && comments > 0) {
    const text = String(comments)
    fields.push({
      fieldId: 'comments',
      fieldName: 'Comments',
      fieldFormat: 'number',
      values: [{ identifier: text, displayValue: text }],
      displayValues: [text],
      displayValue: text,
    })
  }
  return fields
}

function normalizeIssue(raw, fallbackRepo, user) {
  const repoRef = extractRepoFromIssue(raw, fallbackRepo)
  const number = Number(raw?.number)
  const id = repoRef && Number.isSafeInteger(number) && number > 0
    ? `${repoRef.fullName}#${number}`
    : asString(raw?.id)
  const serialNumber = Number.isSafeInteger(number) && number > 0 ? `#${number}` : id
  const title = asString(raw?.title)
  const issueLabels = normalizeLabels(raw?.labels)
  const rawAssignees = Array.isArray(raw?.assignees) && raw.assignees.length > 0
    ? raw.assignees
    : (raw?.assignee ? [raw.assignee] : [])
  const assignees = rawAssignees.map(normalizePerson).filter(Boolean)
  const creator = normalizePerson(raw?.user)
  const { categoryId, workitemType } = classifyIssueType(raw, issueLabels)
  const { statusStageId, status } = classifyIssueStage(raw, assignees, issueLabels)

  const currentLogin = asString(user?.username).toLowerCase()
  const currentId = asString(user?.id)
  const isSameUser = (person) => {
    if (!person) return false
    if (currentId && person.id && person.id === currentId) return true
    if (currentLogin && person.name && person.name.toLowerCase() === currentLogin) return true
    return false
  }
  const relations = []
  if (assignees.some(isSameUser)) relations.push('assigned')
  if (isSameUser(creator)) relations.push('participant')

  const assignedTo = assignees.length > 0
    ? { id: assignees[0].id, name: assignees.map(item => item.name).join('、') }
    : null

  return {
    id,
    organizationId: repoRef?.owner || '',
    subject: title,
    title,
    description: asString(raw?.body),
    formatType: 'MARKDOWN',
    categoryId,
    logicalStatus: asString(raw?.state) || null,
    serialNumber,
    status,
    statusStageId,
    assignedTo,
    participants: assignees,
    space: repoRef ? { id: repoRef.fullName, name: repoRef.fullName } : null,
    workitemType,
    creator,
    modifier: null,
    verifier: null,
    labels: issueLabels,
    customFieldValues: buildCustomFields(raw),
    webUrl: safeGitHubUrl(raw?.html_url),
    gmtCreate: time(raw?.created_at),
    gmtModified: time(raw?.updated_at),
    updateStatusAt: time(raw?.closed_at),
    relations,
  }
}

function normalizeRepoProject(raw, includeOwnerInName) {
  const fullName = asString(raw?.full_name).trim()
  const owner = asString(raw?.owner?.login).trim()
  const name = asString(raw?.name).trim()
  return {
    id: fullName,
    name: includeOwnerInName ? fullName : (name || fullName),
    fullName,
    owner,
    description: asString(raw?.description),
    hasIssues: raw?.has_issues !== false,
    openIssuesCount: Number.isInteger(raw?.open_issues_count) ? raw.open_issues_count : 0,
    httpUrl: asString(raw?.clone_url),
    sshUrl: asString(raw?.ssh_url),
    webUrl: safeGitHubUrl(raw?.html_url),
    gmtCreate: time(raw?.created_at),
    gmtModified: time(raw?.updated_at),
  }
}

function normalizeRepository(rawRepo, fallbackFullName = '') {
  if (!rawRepo || typeof rawRepo !== 'object') return null
  const fullName = asString(rawRepo.full_name).trim() || asString(fallbackFullName).trim()
  const parsed = parseRepoFullName(fullName)
  if (!parsed) return null
  const owner = asString(rawRepo.owner?.login).trim() || parsed.owner
  const name = asString(rawRepo.name).trim() || parsed.repo
  const dirName = sanitizeRepoDirName(name) || sanitizeRepoDirName(parsed.repo)
  const httpUrl = asString(rawRepo.clone_url).trim()
  const sshUrl = asString(rawRepo.ssh_url).trim()
  if (!dirName || (!httpUrl && !sshUrl)) return null
  const rawVisibility = asString(rawRepo.visibility).trim().toLowerCase()
  const visibility = (rawVisibility === 'private' || rawVisibility === 'internal' || rawVisibility === 'public')
    ? rawVisibility
    : (rawRepo.private === true ? 'private' : rawRepo.private === false ? 'public' : '')
  return {
    id: parsed.fullName,
    repoId: asString(rawRepo.id),
    organizationId: owner,
    name,
    path: dirName,
    pathWithNamespace: parsed.fullName,
    fullName: parsed.fullName,
    owner,
    description: asString(rawRepo.description).trim(),
    visibility,
    archived: Boolean(rawRepo.archived),
    isFork: Boolean(rawRepo.fork),
    defaultBranch: asString(rawRepo.default_branch).trim(),
    language: asString(rawRepo.language).trim(),
    starCount: Number.isInteger(rawRepo.stargazers_count) ? rawRepo.stargazers_count : null,
    forkCount: Number.isInteger(rawRepo.forks_count) ? rawRepo.forks_count : null,
    openIssuesCount: Number.isInteger(rawRepo.open_issues_count) ? rawRepo.open_issues_count : null,
    httpUrl,
    sshUrl,
    webUrl: safeGitHubUrl(rawRepo.html_url),
    gmtCreate: time(rawRepo.created_at),
    gmtModified: time(rawRepo.pushed_at ?? rawRepo.updated_at ?? rawRepo.created_at),
  }
}

function httpError(statusCode, response) {
  if (statusCode === 401) {
    return new GitHubError('permission-denied', 'GitHub 认证失败，请检查访问令牌是否有效。', { status: statusCode })
  }
  if (statusCode === 403) {
    const remaining = header(response, 'x-ratelimit-remaining')
    if (remaining === '0') {
      return new GitHubError('rate-limited', 'GitHub API 请求次数已达上限，请稍后重试。', { status: statusCode })
    }
    return new GitHubError('permission-denied', 'GitHub 权限不足，请检查访问令牌的仓库与 Issue 读取权限。', { status: statusCode })
  }
  if (statusCode === 404) {
    return new GitHubError('not-found', '未找到请求的 GitHub 资源。', { status: statusCode })
  }
  if (statusCode === 429) {
    return new GitHubError('rate-limited', 'GitHub 请求过于频繁，请稍后重试。', { status: statusCode })
  }
  return new GitHubError('http-error', `GitHub 请求失败（HTTP ${statusCode || '未知'}）。`, { status: statusCode || 0 })
}

function arrayBody(result) {
  if (!Array.isArray(result.data)) {
    throw new GitHubError('invalid-response', 'GitHub 返回的数据结构无效。')
  }
  return result.data
}

function objectBody(result) {
  if (!result.data || typeof result.data !== 'object' || Array.isArray(result.data)) {
    throw new GitHubError('invalid-response', 'GitHub 返回的数据结构无效。')
  }
  return result.data
}

function isPullRequest(raw) {
  return Boolean(raw && typeof raw === 'object' && raw.pull_request)
}

function matchesScope(issue, selectedScope) {
  if (selectedScope === 'all') return true
  if (selectedScope === 'assigned') return issue.relations.includes('assigned')
  if (selectedScope === 'participant') return issue.relations.includes('participant')
  return true
}

function deriveOrganizations(repos, user) {
  const byLower = new Map()
  const userLogin = asString(user?.username).trim()
  for (const repo of repos) {
    const owner = asString(repo?.owner?.login).trim()
    if (!owner) continue
    const key = owner.toLowerCase()
    if (!byLower.has(key)) {
      byLower.set(key, { id: owner, name: owner, description: '' })
    }
  }
  const list = [...byLower.values()]
  if (userLogin) {
    const userKey = userLogin.toLowerCase()
    list.sort((a, b) => {
      const aIsSelf = a.id.toLowerCase() === userKey ? 0 : 1
      const bIsSelf = b.id.toLowerCase() === userKey ? 0 : 1
      if (aIsSelf !== bIsSelf) return aIsSelf - bIsSelf
      return a.name.localeCompare(b.name)
    })
  } else {
    list.sort((a, b) => a.name.localeCompare(b.name))
  }
  return list
}

export function createGitHubApi({ fetch = globalThis.fetch, baseUrl = BASE_URL } = {}) {
  const root = String(baseUrl || BASE_URL).replace(/\/+$/, '')

  async function request(token, path, { signal } = {}) {
    if (typeof fetch !== 'function') {
      throw new GitHubError('network-error', '当前运行环境不支持网络请求。')
    }
    let response
    try {
      response = await fetch(`${root}${path}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
          accept: 'application/vnd.github+json',
          'x-github-api-version': '2022-11-28',
          'user-agent': 'dsh-dev-dashboard',
        },
        signal,
      })
    } catch (error) {
      if (error?.name === 'AbortError' || error?.name === 'TimeoutError' || signal?.aborted) throw error
      throw new GitHubError('network-error', '无法连接 GitHub，请检查网络后重试。')
    }
    if (!response.ok) throw httpError(response.status, response)
    const text = await response.text()
    if (!text) return { data: null, response }
    try {
      return { data: JSON.parse(text), response }
    } catch {
      throw new GitHubError('invalid-response', 'GitHub 返回了无法解析的数据。')
    }
  }

  async function fetchAccessibleRepos(accessToken, signal) {
    const repos = []
    let page = 1
    let limited = false
    while (page <= MAX_REPO_PAGES) {
      const result = await request(
        accessToken,
        `/user/repos?per_page=${PAGE_SIZE}&sort=updated&direction=desc&affiliation=owner,collaborator,organization_member&page=${page}`,
        { signal },
      )
      const rows = arrayBody(result)
      repos.push(...rows)
      if (!hasNextPage(result.response, rows, PAGE_SIZE)) break
      page += 1
    }
    if (page > MAX_REPO_PAGES) limited = true
    return { repos, limited }
  }

  async function fetchRepoIssuesPage(accessToken, owner, repo, page, signal) {
    const path = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues?state=all&sort=updated&direction=desc&per_page=${PAGE_SIZE}&page=${page}`
    return request(accessToken, path, { signal })
  }

  async function fetchGlobalIssuesPage(accessToken, page, signal) {
    const path = `/issues?filter=all&state=all&sort=updated&direction=desc&per_page=${PAGE_SIZE}&page=${page}`
    return request(accessToken, path, { signal })
  }

  async function load({
    token,
    organizationId = '',
    projectId = 'all',
    scope = 'all',
    pageSize = DEFAULT_ISSUE_PAGE_SIZE,
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
    const singleProject = requestedProject !== 'all'
    const selectedProjectId = singleProject ? requestedProject : 'all'

    let user
    let rawRepos = []
    let repoPagesLimited = false
    if (isInitialLoad || !singleProject) {
      const [userResult, reposResult] = await Promise.all([
        request(accessToken, '/user', { signal }),
        fetchAccessibleRepos(accessToken, signal),
      ])
      user = normalizeUser(objectBody(userResult))
      rawRepos = reposResult.repos
      repoPagesLimited = reposResult.limited
    } else {
      const userResult = await request(accessToken, '/user', { signal })
      user = normalizeUser(objectBody(userResult))
    }

    const organizations = deriveOrganizations(rawRepos, user)
    let selectedOrganizationId = requestedOrganization || 'all'
    if (selectedOrganizationId !== 'all' && organizations.length > 0) {
      const matchedOrg = organizations.find(item => item.id.toLowerCase() === selectedOrganizationId.toLowerCase())
      if (matchedOrg) {
        selectedOrganizationId = matchedOrg.id
      }
    }

    const filteredRawRepos = selectedOrganizationId === 'all'
      ? rawRepos
      : rawRepos.filter(repo => asString(repo?.owner?.login).toLowerCase() === selectedOrganizationId.toLowerCase())
    const projects = filteredRawRepos
      .filter(repo => Boolean(parseRepoFullName(repo?.full_name)))
      .map(repo => normalizeRepoProject(repo, selectedOrganizationId === 'all'))

    const itemsById = new Map()
    let issuePagesLimited = false
    let hasMore = false
    let nextCursor = null
    const stats = {
      projectsTotal: singleProject ? 1 : projects.length,
      projectsSearched: 0,
      pagesFetched: 0,
      itemsScanned: 0,
      itemsMatched: 0,
      itemsReturned: 0,
      assigned: 0,
      participant: 0,
      truncatedReason: '',
    }

    async function scanRepositories(repoList, mode) {
      const startProjectIndex = parsedCursor ? parsedCursor.projectIndex : 0
      for (let projectIndex = startProjectIndex; projectIndex < repoList.length; projectIndex += 1) {
        const project = repoList[projectIndex]
        const parsedRepo = parseRepoFullName(project.id)
        if (!parsedRepo) continue
        if (repoList.length > 1 && project.hasIssues === false) continue

        stats.projectsSearched += 1
        let page = projectIndex === startProjectIndex && parsedCursor ? parsedCursor.page : 1
        let offset = projectIndex === startProjectIndex && parsedCursor ? parsedCursor.offset : 0
        let anchorId = projectIndex === startProjectIndex && parsedCursor ? parsedCursor.anchorId : ''

        while (true) {
          if (page > MAX_ISSUE_PAGES) {
            issuePagesLimited = true
            break
          }
          let result
          try {
            result = await fetchRepoIssuesPage(accessToken, parsedRepo.owner, parsedRepo.repo, page, signal)
          } catch (error) {
            if (error instanceof GitHubError && error.details?.status === 410) {
              break
            }
            if (
              repoList.length > 1
              && error instanceof GitHubError
              && (error.code === 'not-found' || error.code === 'permission-denied')
            ) {
              break
            }
            throw error
          }

          const rows = arrayBody(result)
          stats.pagesFetched += 1
          let startIndex = 0
          if (offset > 0 || anchorId) {
            if (anchorId) {
              const anchorIndex = rows.findIndex(row => normalizeIssue(row, project, user).id === anchorId)
              startIndex = anchorIndex >= 0 ? anchorIndex + 1 : Math.min(offset, rows.length)
            } else {
              startIndex = Math.min(offset, rows.length)
            }
            offset = 0
            anchorId = ''
          }
          const pageHasNext = hasNextPage(result.response, rows, PAGE_SIZE)

          for (let i = startIndex; i < rows.length; i += 1) {
            const raw = rows[i]
            stats.itemsScanned += 1
            if (isPullRequest(raw)) continue
            const normalized = normalizeIssue(raw, project, user)
            if (!normalized.id || !matchesScope(normalized, selectedScope)) continue
            if (!itemsById.has(normalized.id)) {
              itemsById.set(normalized.id, normalized)
            }
            if (itemsById.size >= effectivePageSize) {
              const nextIndex = i + 1
              const currentId = normalized.id
              if (nextIndex < rows.length) {
                hasMore = true
                nextCursor = mode
                  ? { projectIndex, page, offset: nextIndex, anchorId: currentId, mode }
                  : { projectIndex, page, offset: nextIndex, anchorId: currentId }
              } else if (pageHasNext && page + 1 <= MAX_ISSUE_PAGES) {
                hasMore = true
                nextCursor = mode
                  ? { projectIndex, page: page + 1, offset: 0, anchorId: currentId, mode }
                  : { projectIndex, page: page + 1, offset: 0, anchorId: currentId }
              } else {
                if (pageHasNext && page + 1 > MAX_ISSUE_PAGES) {
                  issuePagesLimited = true
                }
                if (projectIndex + 1 < repoList.length) {
                  hasMore = true
                  nextCursor = mode
                    ? { projectIndex: projectIndex + 1, page: 1, offset: 0, anchorId: '', mode }
                    : { projectIndex: projectIndex + 1, page: 1, offset: 0, anchorId: '' }
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

    async function scanGlobalIssues() {
      let page = parsedCursor ? parsedCursor.page : 1
      let offset = parsedCursor ? parsedCursor.offset : 0
      let anchorId = parsedCursor ? parsedCursor.anchorId : ''
      stats.projectsSearched = projects.length

      while (true) {
        if (page > MAX_ISSUE_PAGES) {
          issuePagesLimited = true
          break
        }
        const result = await fetchGlobalIssuesPage(accessToken, page, signal)
        const rows = arrayBody(result)
        stats.pagesFetched += 1

        if (isInitialLoad && page === 1 && rows.length === 0 && projects.some(repo => repo.openIssuesCount > 0)) {
          return false
        }

        let startIndex = 0
        if (offset > 0 || anchorId) {
          if (anchorId) {
            const anchorIndex = rows.findIndex(row => normalizeIssue(row, null, user).id === anchorId)
            startIndex = anchorIndex >= 0 ? anchorIndex + 1 : Math.min(offset, rows.length)
          } else {
            startIndex = Math.min(offset, rows.length)
          }
          offset = 0
          anchorId = ''
        }
        const pageHasNext = hasNextPage(result.response, rows, PAGE_SIZE)

        for (let i = startIndex; i < rows.length; i += 1) {
          const raw = rows[i]
          stats.itemsScanned += 1
          if (isPullRequest(raw)) continue
          const normalized = normalizeIssue(raw, null, user)
          if (!normalized.id) continue
          if (
            selectedOrganizationId !== 'all'
            && normalized.organizationId.toLowerCase() !== selectedOrganizationId.toLowerCase()
          ) {
            continue
          }
          if (!matchesScope(normalized, selectedScope)) continue
          if (!itemsById.has(normalized.id)) {
            itemsById.set(normalized.id, normalized)
          }
          if (itemsById.size >= effectivePageSize) {
            const nextIndex = i + 1
            const currentId = normalized.id
            if (nextIndex < rows.length) {
              hasMore = true
              nextCursor = { projectIndex: 0, page, offset: nextIndex, anchorId: currentId, mode: 'global' }
            } else if (pageHasNext && page + 1 <= MAX_ISSUE_PAGES) {
              hasMore = true
              nextCursor = { projectIndex: 0, page: page + 1, offset: 0, anchorId: currentId, mode: 'global' }
            } else {
              if (pageHasNext && page + 1 > MAX_ISSUE_PAGES) {
                issuePagesLimited = true
              }
              hasMore = false
              nextCursor = null
            }
            return true
          }
        }

        if (!pageHasNext) break
        page += 1
      }
      return true
    }

    if (singleProject) {
      const parsedRepo = parseRepoFullName(requestedProject)
      if (!parsedRepo) {
        throw new GitHubError('bad-request', 'GitHub 仓库名称格式无效。')
      }
      const targetProject = projects.find(item => item.id.toLowerCase() === parsedRepo.fullName.toLowerCase())
        ?? { id: parsedRepo.fullName, name: parsedRepo.fullName, hasIssues: true }
      await scanRepositories([targetProject], '')
    } else if (parsedCursor?.mode === 'repos') {
      await scanRepositories(projects, 'repos')
    } else {
      let usedGlobal = false
      try {
        usedGlobal = await scanGlobalIssues()
      } catch (error) {
        if (error instanceof GitHubError && (error.code === 'permission-denied' || error.code === 'not-found') && projects.length > 0) {
          usedGlobal = false
        } else {
          throw error
        }
      }
      if (!usedGlobal && projects.length > 0) {
        stats.projectsSearched = 0
        await scanRepositories(projects, 'repos')
      }
    }

    const items = [...itemsById.values()].slice(0, effectivePageSize)
    const truncated = repoPagesLimited || issuePagesLimited
    stats.truncatedReason = [
      repoPagesLimited ? 'projects' : '',
      issuePagesLimited ? 'workitems' : '',
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
    const requestedOrganization = asString(organizationId).trim() || 'all'
    const requestedProject = asString(projectId).trim() || 'all'
    const selectedScope = cleanScope(scope)
    const singleProject = requestedProject !== 'all'
    const selectedProjectId = singleProject ? requestedProject : 'all'

    const userResult = await request(accessToken, '/user', { signal })
    const user = normalizeUser(objectBody(userResult))

    let projects = []
    let repoPagesLimited = false
    if (!singleProject) {
      const reposResult = await fetchAccessibleRepos(accessToken, signal)
      repoPagesLimited = reposResult.limited
      const filteredRaw = requestedOrganization === 'all'
        ? reposResult.repos
        : reposResult.repos.filter(repo => asString(repo?.owner?.login).toLowerCase() === requestedOrganization.toLowerCase())
      projects = filteredRaw
        .filter(repo => Boolean(parseRepoFullName(repo?.full_name)))
        .map(repo => normalizeRepoProject(repo, requestedOrganization === 'all'))
    }

    const matchedIds = new Set()
    const assignedIds = new Set()
    const participantIds = new Set()
    let issuePagesLimited = false
    const stats = {
      projectsTotal: singleProject ? 1 : projects.length,
      projectsSearched: 0,
      pagesFetched: 0,
      itemsScanned: 0,
      truncatedReason: '',
    }

    const recordIssue = (normalized) => {
      if (!normalized.id || !matchesScope(normalized, selectedScope)) return
      matchedIds.add(normalized.id)
      if (normalized.relations.includes('assigned')) assignedIds.add(normalized.id)
      if (normalized.relations.includes('participant')) participantIds.add(normalized.id)
    }

    async function countRepositories(repoList) {
      for (const project of repoList) {
        const parsedRepo = parseRepoFullName(project.id)
        if (!parsedRepo) continue
        if (repoList.length > 1 && project.hasIssues === false) continue
        stats.projectsSearched += 1
        let page = 1
        while (true) {
          if (page > MAX_ISSUE_PAGES) {
            issuePagesLimited = true
            break
          }
          let result
          try {
            result = await fetchRepoIssuesPage(accessToken, parsedRepo.owner, parsedRepo.repo, page, signal)
          } catch (error) {
            if (error instanceof GitHubError && error.details?.status === 410) break
            if (
              repoList.length > 1
              && error instanceof GitHubError
              && (error.code === 'not-found' || error.code === 'permission-denied')
            ) {
              break
            }
            throw error
          }
          const rows = arrayBody(result)
          stats.pagesFetched += 1
          for (const raw of rows) {
            stats.itemsScanned += 1
            if (isPullRequest(raw)) continue
            recordIssue(normalizeIssue(raw, project, user))
          }
          if (!hasNextPage(result.response, rows, PAGE_SIZE)) break
          page += 1
        }
      }
    }

    async function countGlobalIssues() {
      let page = 1
      stats.projectsSearched = projects.length
      while (true) {
        if (page > MAX_ISSUE_PAGES) {
          issuePagesLimited = true
          break
        }
        const result = await fetchGlobalIssuesPage(accessToken, page, signal)
        const rows = arrayBody(result)
        stats.pagesFetched += 1
        if (page === 1 && rows.length === 0 && projects.some(repo => repo.openIssuesCount > 0)) {
          return false
        }
        for (const raw of rows) {
          stats.itemsScanned += 1
          if (isPullRequest(raw)) continue
          const normalized = normalizeIssue(raw, null, user)
          if (
            requestedOrganization !== 'all'
            && normalized.organizationId.toLowerCase() !== requestedOrganization.toLowerCase()
          ) {
            continue
          }
          recordIssue(normalized)
        }
        if (!hasNextPage(result.response, rows, PAGE_SIZE)) break
        page += 1
      }
      return true
    }

    if (singleProject) {
      const parsedRepo = parseRepoFullName(requestedProject)
      if (!parsedRepo) {
        throw new GitHubError('bad-request', 'GitHub 仓库名称格式无效。')
      }
      await countRepositories([{ id: parsedRepo.fullName, name: parsedRepo.fullName, hasIssues: true }])
    } else {
      let usedGlobal = false
      try {
        usedGlobal = await countGlobalIssues()
      } catch (error) {
        if (error instanceof GitHubError && (error.code === 'permission-denied' || error.code === 'not-found') && projects.length > 0) {
          usedGlobal = false
        } else {
          throw error
        }
      }
      if (!usedGlobal && projects.length > 0) {
        stats.projectsSearched = 0
        await countRepositories(projects)
      }
    }

    const truncated = repoPagesLimited || issuePagesLimited
    stats.truncatedReason = [
      repoPagesLimited ? 'projects' : '',
      issuePagesLimited ? 'workitems' : '',
    ].filter(Boolean).join('+')

    return {
      selectedOrganizationId: requestedOrganization,
      selectedProjectId,
      scope: selectedScope,
      total: matchedIds.size,
      assigned: assignedIds.size,
      participant: participantIds.size,
      truncated,
      stats,
    }
  }

  async function detail({ token, issueId, signal } = {}) {
    const accessToken = cleanToken(token)
    const parsed = parseIssueId(issueId)
    const [userResult, issueResult] = await Promise.all([
      request(accessToken, '/user', { signal }).catch(() => null),
      request(
        accessToken,
        `/repos/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repo)}/issues/${parsed.number}`,
        { signal },
      ),
    ])
    const user = userResult?.data ? normalizeUser(userResult.data) : null
    return normalizeIssue(objectBody(issueResult), { id: parsed.fullName, name: parsed.fullName }, user)
  }

  async function repositories({ token, issueId, signal } = {}) {
    const accessToken = cleanToken(token)
    const parsed = parseIssueId(issueId)
    const [userResult, repoResult] = await Promise.all([
      request(accessToken, '/user', { signal }),
      request(
        accessToken,
        `/repos/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repo)}`,
        { signal },
      ),
    ])
    const user = normalizeUser(objectBody(userResult))
    const rawRepo = objectBody(repoResult)
    const dirName = sanitizeRepoDirName(rawRepo.name) || sanitizeRepoDirName(parsed.repo)
    const httpUrl = asString(rawRepo.clone_url).trim()
    const sshUrl = asString(rawRepo.ssh_url).trim()
    if (!dirName || (!httpUrl && !sshUrl)) {
      return { user, repositories: [] }
    }
    return {
      user,
      repositories: [{
        id: asString(rawRepo.id),
        name: asString(rawRepo.name) || dirName,
        path: dirName,
        pathWithNamespace: asString(rawRepo.full_name) || parsed.fullName,
        httpUrl,
        sshUrl,
        webUrl: safeGitHubUrl(rawRepo.html_url),
      }],
    }
  }

  async function listRepositories({
    token,
    organizationId = '',
    search = '',
    page = 1,
    pageSize = DEFAULT_ISSUE_PAGE_SIZE,
    signal,
  } = {}) {
    const accessToken = cleanToken(token)
    const requestedOrganization = asString(organizationId).trim()
    const cleanSearch = asString(search).trim().toLowerCase()
    const effectivePage = Number(page)
    if (!Number.isInteger(effectivePage) || effectivePage < 1) {
      throw new GitHubError('bad-request', '页码无效。')
    }
    const effectivePageSize = Number(pageSize)
    if (!Number.isInteger(effectivePageSize) || effectivePageSize < 1 || effectivePageSize > 100) {
      throw new GitHubError('bad-request', '分页大小无效。')
    }

    const [userResult, reposResult] = await Promise.all([
      request(accessToken, '/user', { signal }),
      fetchAccessibleRepos(accessToken, signal),
    ])
    const user = normalizeUser(objectBody(userResult))
    const rawRepos = reposResult.repos
    const organizations = deriveOrganizations(rawRepos, user)

    let selectedOrganizationId = requestedOrganization || 'all'
    if (selectedOrganizationId !== 'all' && organizations.length > 0) {
      const matchedOrg = organizations.find(item => item.id.toLowerCase() === selectedOrganizationId.toLowerCase())
      if (matchedOrg) selectedOrganizationId = matchedOrg.id
    }

    const normalized = rawRepos
      .map(repo => normalizeRepository(repo))
      .filter(Boolean)
      .filter((repo) => {
        if (selectedOrganizationId !== 'all' && repo.owner.toLowerCase() !== selectedOrganizationId.toLowerCase()) {
          return false
        }
        if (cleanSearch) {
          const haystack = `${repo.fullName}\n${repo.name}\n${repo.description}\n${repo.language}`.toLowerCase()
          if (!haystack.includes(cleanSearch)) return false
        }
        return true
      })

    const totalCount = normalized.length
    const start = (effectivePage - 1) * effectivePageSize
    const items = normalized.slice(start, start + effectivePageSize)
    const hasMore = start + items.length < totalCount

    return {
      user,
      organizations,
      selectedOrganizationId,
      items,
      totalCount,
      page: effectivePage,
      hasMore,
      nextPage: hasMore ? effectivePage + 1 : null,
      truncated: reposResult.limited,
    }
  }

  async function repository({ token, repositoryId, signal } = {}) {
    const accessToken = cleanToken(token)
    const parsed = parseRepoFullName(required(repositoryId, 'repositoryId'))
    if (!parsed) {
      throw new GitHubError('bad-request', 'GitHub 仓库名称格式无效。')
    }
    const [userResult, repoResult] = await Promise.all([
      request(accessToken, '/user', { signal }),
      request(
        accessToken,
        `/repos/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repo)}`,
        { signal },
      ),
    ])
    const user = normalizeUser(objectBody(userResult))
    return {
      user,
      repository: normalizeRepository(objectBody(repoResult), parsed.fullName),
    }
  }

  return { load, count, detail, repositories, listRepositories, repository }
}
