import test from 'node:test'
import assert from 'node:assert/strict'
import { GitHubError, createGitHubApi } from '../src/github.js'

const TOKEN = 'ghp_unit_test_secret_token'

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

function pathname(call) {
  return new URL(call.url).pathname
}

function makeRepo(fullName, overrides = {}) {
  const [owner, name] = fullName.split('/')
  return {
    id: Math.abs(fullName.split('').reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 7)),
    name,
    full_name: fullName,
    owner: { id: 100, login: owner },
    description: `Repo ${fullName}`,
    has_issues: true,
    open_issues_count: 1,
    clone_url: `https://github.com/${fullName}.git`,
    ssh_url: `git@github.com:${fullName}.git`,
    html_url: `https://github.com/${fullName}`,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-11-20T00:00:00Z',
    ...overrides,
  }
}

function makeIssue(repoFullName, number, overrides = {}) {
  return {
    id: number * 1000,
    number,
    title: `Issue #${number}`,
    body: `## Details\nFix item #${number}`,
    state: 'open',
    state_reason: null,
    user: { id: 1, login: 'octocat' },
    assignees: [],
    labels: [],
    milestone: null,
    comments: 0,
    html_url: `https://github.com/${repoFullName}/issues/${number}`,
    repository_url: `https://api.github.com/repos/${repoFullName}`,
    repository: makeRepo(repoFullName),
    created_at: '2026-11-18T10:00:00Z',
    updated_at: '2026-11-20T12:00:00Z',
    closed_at: null,
    ...overrides,
  }
}

test('load fetches accessible repos and global issues, filters out PRs, and normalizes GitHub issue fields', async () => {
  const { calls, fetchImpl } = mockFetch((call) => {
    assert.equal(call.init.headers.authorization, `Bearer ${TOKEN}`)
    const path = pathname(call)
    if (path === '/user') {
      return response({ id: 1, login: 'octocat', name: 'The Octocat', email: 'octo@example.invalid' })
    }
    if (path === '/user/repos') {
      return response([
        makeRepo('acme-org/service-a'),
        makeRepo('octocat/my-new-repo'),
      ])
    }
    if (path === '/issues') {
      const url = new URL(call.url)
      assert.equal(url.searchParams.get('filter'), 'all')
      assert.equal(url.searchParams.get('state'), 'all')
      return response([
        makeIssue('octocat/my-new-repo', 1, {
          title: 'Crash on login',
          labels: [{ id: 10, name: 'bug', color: 'd73a4a' }],
          assignees: [],
          milestone: { number: 3, title: 'v1.0' },
          comments: 2,
        }),
        makeIssue('acme-org/service-a', 9, {
          title: 'Support OAuth',
          labels: [{ id: 11, name: 'enhancement', color: 'a2eeef' }],
          assignees: [{ id: 1, login: 'octocat' }],
          user: { id: 2, login: 'teammate' },
        }),
        makeIssue('octocat/my-new-repo', 2, {
          title: 'PR should be excluded',
          pull_request: { url: 'https://api.github.com/repos/octocat/my-new-repo/pulls/2' },
        }),
        makeIssue('acme-org/service-a', 5, {
          title: 'Old completed issue',
          state: 'closed',
          state_reason: 'completed',
        }),
        makeIssue('acme-org/service-a', 4, {
          title: 'Skipped issue',
          state: 'closed',
          state_reason: 'not_planned',
        }),
      ])
    }
    throw new Error(`Unexpected path: ${path}`)
  })

  const api = createGitHubApi({ fetch: fetchImpl })
  const result = await api.load({ token: TOKEN })

  assert.equal(result.user.username, 'octocat')
  assert.deepEqual(result.organizations.map(item => item.id), ['octocat', 'acme-org'])
  assert.equal(result.selectedOrganizationId, 'all')
  assert.equal(result.selectedProjectId, 'all')
  assert.deepEqual(result.projects.map(item => item.id), ['acme-org/service-a', 'octocat/my-new-repo'])

  // 4 real issues (PR excluded)
  assert.equal(result.items.length, 4)
  assert.equal(result.totalCount, 4)
  assert.equal(result.hasMore, false)

  const [bugIssue, featureIssue, closedIssue, notPlannedIssue] = result.items
  assert.equal(bugIssue.id, 'octocat/my-new-repo#1')
  assert.equal(bugIssue.serialNumber, '#1')
  assert.equal(bugIssue.organizationId, 'octocat')
  assert.equal(bugIssue.categoryId, 'Bug')
  assert.equal(bugIssue.statusStageId, '1')
  assert.equal(bugIssue.webUrl, 'https://github.com/octocat/my-new-repo/issues/1')
  assert.deepEqual(bugIssue.relations, ['participant'])
  assert.equal(bugIssue.customFieldValues.length, 2)
  assert.equal(bugIssue.customFieldValues[0].displayValue, 'v1.0')

  assert.equal(featureIssue.id, 'acme-org/service-a#9')
  assert.equal(featureIssue.categoryId, 'Req')
  assert.equal(featureIssue.statusStageId, '2')
  assert.deepEqual(featureIssue.relations, ['assigned'])
  assert.equal(featureIssue.assignedTo.name, 'octocat')

  assert.equal(closedIssue.statusStageId, '4')
  assert.equal(notPlannedIssue.statusStageId, '5')
  assert.equal(calls.length, 3)
})

test('load supports filtering by single repository and falls back to per-repo scanning when /issues is forbidden', async () => {
  const { calls, fetchImpl } = mockFetch((call) => {
    const path = pathname(call)
    if (path === '/user') {
      return response({ id: 1, login: 'octocat' })
    }
    if (path === '/user/repos') {
      return response([
        makeRepo('octocat/disabled-issues', { has_issues: false, open_issues_count: 0 }),
        makeRepo('octocat/repo-a', { open_issues_count: 2 }),
        makeRepo('octocat/repo-b', { open_issues_count: 1 }),
      ])
    }
    if (path === '/issues') {
      return response({ message: 'Resource not accessible by personal access token' }, { status: 403 })
    }
    if (path === '/repos/octocat/repo-a/issues') {
      return response([
        makeIssue('octocat/repo-a', 10),
        makeIssue('octocat/repo-a', 9),
      ])
    }
    if (path === '/repos/octocat/repo-b/issues') {
      return response([
        makeIssue('octocat/repo-b', 3),
      ])
    }
    throw new Error(`Unexpected path: ${path}`)
  })

  const api = createGitHubApi({ fetch: fetchImpl })

  // Fallback on 403 when projectId === 'all'
  const page1 = await api.load({ token: TOKEN, pageSize: 2 })
  assert.deepEqual(page1.items.map(i => i.id), ['octocat/repo-a#10', 'octocat/repo-a#9'])
  assert.equal(page1.hasMore, true)
  assert.deepEqual(page1.nextCursor, { projectIndex: 2, page: 1, offset: 0, anchorId: '', mode: 'repos' })

  const page2 = await api.load({ token: TOKEN, pageSize: 2, cursor: page1.nextCursor })
  assert.deepEqual(page2.items.map(i => i.id), ['octocat/repo-b#3'])
  assert.equal(page2.hasMore, false)
  assert.equal(page2.nextCursor, null)

  // Single repository load hits /repos/:owner/:repo/issues directly
  const single = await api.load({ token: TOKEN, organizationId: 'octocat', projectId: 'octocat/repo-b' })
  assert.deepEqual(single.items.map(i => i.id), ['octocat/repo-b#3'])
  assert.ok(calls.some(call => pathname(call) === '/repos/octocat/repo-b/issues'))
})

test('load paginates across global /issues pages via Link header and count returns exact total', async () => {
  const { fetchImpl } = mockFetch((call) => {
    const path = pathname(call)
    const url = new URL(call.url)
    if (path === '/user') return response({ id: 1, login: 'octocat' })
    if (path === '/user/repos') return response([makeRepo('octocat/demo')])
    if (path === '/issues') {
      const pageNum = Number(url.searchParams.get('page') || 1)
      if (pageNum === 1) {
        return response(
          [
            makeIssue('octocat/demo', 3),
            makeIssue('octocat/demo', 2, { pull_request: {} }),
            makeIssue('octocat/demo', 1),
          ],
          { headers: { link: '<https://api.github.com/issues?page=2>; rel="next"' } },
        )
      }
      return response(
        [makeIssue('octocat/demo', 4)],
        { headers: { link: '<https://api.github.com/issues?page=1>; rel="prev"' } },
      )
    }
    throw new Error(`Unexpected path: ${path}`)
  })

  const api = createGitHubApi({ fetch: fetchImpl })
  const first = await api.load({ token: TOKEN, pageSize: 2 })
  assert.deepEqual(first.items.map(i => i.id), ['octocat/demo#3', 'octocat/demo#1'])
  assert.equal(first.hasMore, true)
  assert.deepEqual(first.nextCursor, { projectIndex: 0, page: 2, offset: 0, anchorId: 'octocat/demo#1', mode: 'global' })

  const second = await api.load({ token: TOKEN, pageSize: 2, cursor: first.nextCursor })
  assert.deepEqual(second.items.map(i => i.id), ['octocat/demo#4'])
  assert.equal(second.hasMore, false)

  const counted = await api.count({ token: TOKEN })
  assert.equal(counted.total, 3)
  assert.equal(counted.truncated, false)
})

test('detail and repositories validate issueId, fetch single issue/repo, and never leak tokens in errors', async () => {
  const { fetchImpl } = mockFetch((call) => {
    const path = pathname(call)
    if (path === '/user') return response({ id: 1, login: 'octocat' })
    if (path === '/repos/octocat/demo/issues/42') {
      return response(makeIssue('octocat/demo', 42, {
        title: 'Detail title',
        body: 'Full markdown body',
        labels: [{ id: 1, name: 'task', color: '0052cc' }],
      }))
    }
    if (path === '/repos/octocat/demo') {
      return response(makeRepo('octocat/demo'))
    }
    if (path === '/repos/octocat/forbidden/issues/1') {
      return response(`Secret leak ${TOKEN}`, { status: 403, headers: { 'x-ratelimit-remaining': '0' } })
    }
    throw new Error(`Unexpected path: ${path}`)
  })

  const api = createGitHubApi({ fetch: fetchImpl })

  const detail = await api.detail({ token: TOKEN, issueId: 'octocat/demo#42' })
  assert.equal(detail.id, 'octocat/demo#42')
  assert.equal(detail.title, 'Detail title')
  assert.equal(detail.description, 'Full markdown body')
  assert.equal(detail.categoryId, 'Task')
  assert.equal(detail.labels[0].name, 'task')

  const repoResult = await api.repositories({ token: TOKEN, issueId: 'octocat/demo#42' })
  assert.equal(repoResult.user.username, 'octocat')
  assert.equal(repoResult.repositories.length, 1)
  assert.equal(repoResult.repositories[0].httpUrl, 'https://github.com/octocat/demo.git')
  assert.equal(repoResult.repositories[0].sshUrl, 'git@github.com:octocat/demo.git')
  assert.equal(repoResult.repositories[0].path, 'demo')

  await assert.rejects(
    () => api.detail({ token: TOKEN, issueId: '../evil/repo#1' }),
    error => error instanceof GitHubError && error.code === 'bad-request',
  )

  await assert.rejects(
    () => api.detail({ token: TOKEN, issueId: 'octocat/forbidden#1' }),
    error => error instanceof GitHubError
      && error.code === 'rate-limited'
      && !error.message.includes(TOKEN),
  )
})
