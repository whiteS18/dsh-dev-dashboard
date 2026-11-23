import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'

const zhDict = {
  title: 'Git 工作台', subtitle: '管理 Git 账户与 Codeup 工作项', back: '返回对话',
  accountSelect: '选择 Git 账户', addAccount: '新增 Git 账户',
  manageAccounts: '管理账户', accountListTitle: '管理 Git 账户',
  accountListEmpty: '当前没有已配置的 Git 账户。', currentAccount: '当前',
  backToList: '返回列表', close: '关闭',
  edit: '编辑', delete: '删除', editFormTitle: '编辑 Git 账户',
  editTokenHint: '留空表示保留当前访问令牌', saveChanges: '保存修改',
  confirmDeleteTitle: '删除账户', confirmDeleteDescription: '此操作无法撤销',
  confirmDeleteAction: '确认删除',
  emptyTitle: '还没有 Git 账户', emptyDescription: '选择 Git 托管平台并配置账户。',
  formTitle: '新增 Git 账户', platform: '托管平台', username: '用户名',
  token: '访问令牌', tokenPlaceholder: '输入访问令牌',
  tokenHint: '令牌仅写入本机凭据存储', save: '保存账户', cancel: '取消',
  issues: 'Codeup 工作项', githubIssues: 'GitHub Issues', scopeAll: '我负责或参与',
  organization: '组织', owner: '所有者', allOwners: '全部所有者',
  project: '项目', repository: '仓库', allProjects: '全部项目', allRepositories: '全部仓库',
  refresh: '刷新', refreshing: '正在刷新…',
  issuesLoading: '正在读取 Codeup 工作项…', githubIssuesLoading: '正在读取 GitHub Issues…',
  issueCount: '个工作项', githubIssueCount: '个 Issue',
  totalPrefix: '共', loadedCount: '已加载', countingTotal: '正在统计总数…',
  noIssues: '没有匹配的工作项', noIssuesDescription: '可以尝试切换范围、组织或项目。',
  noGithubIssues: '没有匹配的 Issue', noGithubIssuesDescription: '可以尝试切换所有者或仓库，或在 GitHub 中创建 Issue 后刷新。',
  selectIssuePrompt: '点击左侧任务查看详细描述',
  truncated: '结果可能不完整：本次查询已达到扫描上限。',
  detailLoading: '正在读取详情…', detailError: '详情读取失败。',
  description: '任务描述', noDescription: '暂无描述。',
  serialNumber: '编号', type: '类型', typeBug: '缺陷', typeTask: '任务', typeReq: '需求', typeIssue: 'Issue', status: '状态', assignedTo: '负责人',
  participants: '参与人', creator: '创建人', updatedAt: '更新时间', createdAt: '创建时间',
  labels: '标签', otherFields: '其他字段', openInCodeup: '在云效中打开', openInGitHub: '在 GitHub 中打开',
  relationAssigned: '负责人', relationParticipant: '参与人',
  actionStart: '开始', actionContinue: '继续',
  cloneModalTitleStart: '开始任务', cloneModalTitleContinue: '继续任务',
  cloneLoading: '正在查询该任务关联的仓库并依次克隆到 ~/project…',
  cloneNoRepos: '该任务没有关联仓库，请先去关联。',
  cloneTargetDir: '目标目录',
  cloneStatusCloned: '克隆成功', cloneStatusExists: '已存在，已跳过', cloneStatusFailed: '克隆失败',
  cloneAllSuccess: '关联仓库已准备就绪。',
  clonePartialFailure: '部分仓库克隆失败，请检查权限或本地目录后重试。',
  cloneError: '克隆关联仓库失败。',
  cloneOpeningWorkspace: '正在以该仓库开启工作区…',
  cloneWorkspaceError: '仓库已就绪，但自动开启工作区失败。',
  copyCode: '复制代码', copied: '已复制', footnotes: '注释',
  noOrganizations: '这个账户没有可用的云效组织。', noProjects: '这个组织下没有可用项目。',
  noRepositories: '这个账户下没有可访问的 GitHub 仓库。',
  loadMore: '加载更多', loadingMore: '正在加载更多工作项…', loadingMoreGithub: '正在加载更多 Issue…',
  noMoreIssues: '已加载全部工作项', noMoreGithubIssues: '已加载全部 Issue',
  loadMoreError: '加载更多工作项失败。', loadMoreGithubError: '加载更多 Issue 失败。',
  unsupportedIssues: '该平台尚未接入 Issue 获取',
  unsupportedDescription: '目前支持 Codeup（云效项目协作）和 GitHub 的 Issue 获取。',
  issueUnavailable: '当前连接不可用，无法读取工作项。', retry: '重试',
}

const source = await readFile(new URL('../dist/client.js', import.meta.url), 'utf8')

/**
 * Minimal hook-driven renderer: function components are invoked with an
 * injected useState queue so the real JSX tree renders without a DOM.
 */
function harness({ primitivesMock = {} } = {}) {
  let definition
  const context = {
    window: { __ModuleLoader__: { load(value) { definition = value } } },
    console, AbortController, Intl, Date, URL,
  }
  vm.runInNewContext(source, context)

  let queue = []
  let index = 0
  const React = {
    createElement(type, props, ...children) { return { type, props: props || {}, children } },
    useState(initial) {
      const slot = queue[index++]
      if (Array.isArray(slot)) return slot
      return [typeof initial === 'function' ? initial() : initial, () => {}]
    },
    useEffect() {},
    useCallback(fn) { return fn },
    useSyncExternalStore(subscribe, getSnapshot) { return getSnapshot() },
    useId() { return 'test-id' },
    useRef() { return { current: null } },
    __setQueue(next) { queue = next || []; index = 0 },
  }
  const plugin = definition.factory((name) => {
    if (name === 'react') return React
    if (name === '@deepseek-ai/dsh-client-ui-primitives') return primitivesMock
    throw new Error(`Unexpected require: ${name}`)
  })

  const registrations = []
  const form = {
    getSnapshot: () => ({ ...form.snapshot }),
    subscribe: () => () => {},
    set: async () => true,
    mutate: async () => true,
    snapshot: { status: 'ready', writable: true, value: undefined },
  }
  const ctx = {
    effect(setup) { return setup() },
    locale: {
      register() { return () => {} },
      bind() { return key => zhDict[key] ?? key },
    },
    configForms: { get: () => form },
    remote: { credentials: {} },
    connection: { rpc: { call: async () => ({ ok: true, value: {} }) } },
    layout: {
      panelInfo: { getSnapshot: () => ({ activePanelId: null }) },
      selectPanel() {},
    },
    slots: {
      inject(owner, setup) { return setup() },
      register(options, component) {
        registrations.push({ options, component })
        return () => {}
      },
    },
  }
  plugin.apply(ctx)
  const main = registrations.find(item => item.options.name === 'main')
  assert.ok(main)
  const props = { ...main.options.inject(), t: key => zhDict[key] ?? key }

  function render(stateMap) {
    const texts = []
    const nodes = []
    const visit = (node) => {
      if (node === null || node === undefined || node === false || node === true) return
      if (Array.isArray(node)) { node.forEach(visit); return }
      if (typeof node === 'string' || typeof node === 'number') { texts.push(String(node)); return }
      if (typeof node !== 'object') return
      const { type, props: nodeProps, children } = node
      if (typeof type === 'function') {
        React.__setQueue(stateMap[type.name] || [])
        visit(type({ ...nodeProps, children }))
        return
      }
      nodes.push({ tag: type, props: nodeProps || {} })
      if (nodeProps?.anchor) visit(nodeProps.anchor)
      if (nodeProps?.footer) visit(nodeProps.footer)
      children.forEach(visit)
    }
    visit(React.createElement(main.component, props))
    return { text: texts.join(' '), texts, nodes }
  }

  return { render, form }
}

function makeIssue(overrides = {}) {
  return {
    id: 'issue-1',
    title: '修复登录超时',
    subject: '修复登录超时',
    serialNumber: 'EWUX-3759',
    status: { id: '100010', name: '处理中', displayName: '处理中', nameEn: 'In Progress' },
    statusStageId: '2',
    workitemType: { id: 'type-task', name: '任务' },
    categoryId: 'Task',
    space: { id: 'proj-1', name: '项目一' },
    assignedTo: { id: 'u1', name: '宋传伟' },
    participants: [{ id: 'u2', name: '周冬伟' }],
    creator: { id: 'u1', name: '宋传伟' },
    gmtCreate: '2026-11-18T09:00:00.000Z',
    gmtModified: '2026-11-19T10:00:00.000Z',
    relations: ['assigned', 'participant'],
    description: '## 任务内容\n把登录超时从 **30s** 改成 `60s`。\n- 检查网关超时',
    formatType: 'MARKDOWN',
    customFieldValues: [{
      fieldId: 'priority', fieldName: '优先级', fieldFormat: 'list',
      values: [{ identifier: 'high', displayValue: '高' }],
      displayValues: ['高'], displayValue: '高',
    }],
    ...overrides,
  }
}

function issueData(overrides = {}) {
  const item = makeIssue()
  return {
    user: { id: 'u1', name: '宋传伟' },
    organizations: [{ id: 'org-1', name: '我的组织' }],
    projects: [{ id: 'proj-1', name: '项目一' }],
    selectedOrganizationId: 'org-1',
    selectedProjectId: 'all',
    scope: 'all',
    items: [item],
    totalCount: 1,
    truncated: true,
    stats: { projectsSearched: 1, itemsReturned: 1 },
    ...overrides,
  }
}

function pageStates(data, {
  modal = { kind: 'closed', accountId: '', returnToList: false },
  setModal = () => {},
  deletingId = '',
  platform = 'github',
  username = '',
  selectedIssueId = 'issue-1',
  countState = { status: 'ready', total: null, truncated: false },
  cloneState = { status: 'idle', issue: null, actionKind: 'start', baseDir: '', results: [], error: '' },
  issueStateOverrides = {},
  detailItem = null,
} = {}) {
  return {
    GitWorkbenchPage: [
      [modal, setModal],
      [deletingId, () => {}],
      [platform, () => {}],
      [username, () => {}],
      ['', () => {}],
      [false, () => {}],
      [false, () => {}],
      ['', () => {}],
    ],
    IssueWorkbench: [
      ['', () => {}],
      ['all', () => {}],
      [0, () => {}],
      [selectedIssueId, () => {}],
      [{ status: 'ready', data, error: '', loadingMore: false, loadMoreError: '', ...issueStateOverrides }, () => {}],
      [countState, () => {}],
      [cloneState, () => {}],
    ],
    IssueDetailPane: [
      [{ status: 'ready', detail: detailItem || data.items[0], error: '' }, () => {}],
    ],
  }
}

function accountSnapshot(extra = []) {
  return {
    status: 'ready', writable: true,
    value: {
      accounts: [
        { id: 'acc-1', platform: 'codeup', username: 'tester' },
        ...extra,
      ],
      selectedAccountId: 'acc-1',
    },
  }
}

test('renders left-right split workbench, Markdown description, total count, and safe Yunxiao link', () => {
  const { render, form } = harness()
  form.snapshot = accountSnapshot()
  const data = issueData()
  const { text, texts, nodes } = render(pageStates(data))

  for (const expected of [
    '修复登录超时', 'EWUX-3759', '处理中', '任务', '项目一', '宋传伟', '周冬伟',
    '任务内容', '把登录超时从', '30s', '60s', '检查网关超时',
    '优先级', '高', '负责人', '参与人',
    '共 1+ 个工作项', '结果可能不完整', '在云效中打开', '任务描述', '其他字段', '更新时间',
  ]) {
    assert.ok(text.includes(expected), `missing rendered text: ${expected}`)
  }
  assert.equal(text.includes('我负责或参与'), false)
  assert.equal(texts.includes('Codeup 工作项'), false)

  // Account tools sit in the bottom-left toolbar rather than the top-right header
  const headerIdx = nodes.findIndex(node => node.tag === 'header')
  const toolbarIdx = nodes.findIndex(node => String(node.props.className).includes('__issueToolbar'))
  const toolbarLeftIdx = nodes.findIndex(node => String(node.props.className).includes('__issueToolbarLeft'))
  const accountToolsIdx = nodes.findIndex(node => String(node.props.className).includes('__accountTools'))
  assert.ok(headerIdx >= 0 && toolbarIdx > headerIdx && toolbarLeftIdx > toolbarIdx && accountToolsIdx > toolbarLeftIdx)

  // Split layout containers
  assert.ok(nodes.some(node => String(node.props.className).includes('__split')))
  assert.ok(nodes.some(node => String(node.props.className).includes('__listPane')))
  assert.ok(nodes.some(node => String(node.props.className).includes('__detailPane')))

  // Markdown rendered as semantic elements (fallback renderer) with zero raw HTML injection
  assert.ok(nodes.some(node => node.tag === 'h2'))
  assert.ok(nodes.some(node => node.tag === 'strong'))
  assert.ok(nodes.some(node => node.tag === 'code'))
  assert.ok(nodes.some(node => node.tag === 'ul'))
  assert.equal(nodes.some(node => Object.hasOwn(node.props, 'dangerouslySetInnerHTML')), false)

  // Header does NOT apply --dsh-frame-top-clearance pushing layout down
  const styleNode = nodes.find(node => node.tag === 'style')
  assert.ok(styleNode)
  assert.equal(text.includes('dsh-frame-top-clearance'), false)

  const links = nodes.filter(node => node.tag === 'a')
  assert.equal(links.length, 1)
  assert.equal(
    links[0].props.href,
    'https://devops.aliyun.com/projex/project/proj-1/task/issue-1',
  )
  assert.equal(links[0].props.target, '_blank')
  assert.equal(links[0].props.rel, 'noopener noreferrer')
})

test('uses DSH native Menu, Modal, and MarkdownText primitives when available', () => {
  const menuCalls = []
  const modalCalls = []
  const markdownCalls = []
  const primitivesMock = {
    Menu: function MockMenu(props) {
      menuCalls.push(props)
      return { type: 'dsh-menu', props, children: [] }
    },
    Modal: function MockModal(props) {
      modalCalls.push(props)
      return { type: 'dsh-modal', props, children: [props.children] }
    },
    MarkdownText: function MockMarkdownText(props) {
      markdownCalls.push(props)
      return { type: 'dsh-markdown', props, children: [props.text] }
    },
  }
  const { render, form } = harness({ primitivesMock })
  form.snapshot = accountSnapshot()
  const data = issueData()
  const { nodes } = render(pageStates(data, { modal: { kind: 'add', accountId: '', returnToList: false } }))

  // Account selector, org selector, project selector, and form platform selector all use DSH native Menu
  assert.equal(menuCalls.length, 4)
  assert.equal(nodes.some(node => node.tag === 'select'), false)
  // Modal uses DSH native Modal
  assert.equal(modalCalls.length, 1)
  assert.equal(modalCalls[0].title, '新增 Git 账户')
  // Markdown description uses DSH native MarkdownText
  assert.equal(markdownCalls.length, 1)
  assert.ok(markdownCalls[0].text.includes('## 任务内容'))
})

test('derives Start/Continue buttons and status badge styles from statusStageId while displaying raw status names', () => {
  const { render, form } = harness()
  form.snapshot = accountSnapshot()
  const items = [
    makeIssue({ id: 'i-todo', title: '待处理任务', statusStageId: '1', status: { name: '待处理', displayName: '待处理', nameEn: 'To Do' } }),
    makeIssue({ id: 'i-custom-open', title: '自定义初始任务', statusStageId: '1', status: { name: '自定义初始态', displayName: '自定义初始态', nameEn: null } }),
    makeIssue({ id: 'i-doing', title: '处理中任务', statusStageId: '2', status: { name: '处理中', displayName: '处理中', nameEn: 'In Progress' } }),
    makeIssue({ id: 'i-selftested', title: '已自测任务', statusStageId: '2', status: { name: '已自测', displayName: '已自测', nameEn: null } }),
    makeIssue({ id: 'i-fixed', title: '已修复缺陷', statusStageId: '3', status: { name: '已修复', displayName: '已修复', nameEn: 'Fixed' } }),
    makeIssue({ id: 'i-done', title: '已完成任务', statusStageId: '4', status: { name: '已完成', displayName: '已完成', nameEn: 'Done' } }),
    makeIssue({ id: 'i-canceled', title: '已取消任务', statusStageId: '5', status: { name: '已取消', displayName: '已取消', nameEn: 'Canceled' } }),
  ]
  const data = issueData({ items, totalCount: items.length, truncated: false })
  const { nodes, text } = render(pageStates(data, {
    selectedIssueId: 'i-fixed',
    detailItem: items[4],
  }))

  for (const label of ['待处理', '自定义初始态', '处理中', '已自测', '已修复', '已完成', '已取消']) {
    assert.ok(text.includes(label), `missing raw status label: ${label}`)
  }

  const actionButtons = nodes.filter(node => node.tag === 'button' && String(node.props.className).includes('__taskActionBtn'))
  assert.deepEqual(
    actionButtons.map(btn => btn.props['data-action']),
    ['start', 'start', 'continue', 'continue'],
  )

  const detailIdx = nodes.findIndex(node => String(node.props.className).includes('__detailHeaderMeta'))
  assert.ok(detailIdx >= 0)
  const listStatusBadges = nodes.slice(0, detailIdx).filter(node =>
    node.tag === 'span'
    && String(node.props.className).includes('__issueBadge')
    && !node.props['data-workitem-kind']
    && !String(node.props.className).includes('__issueBadgeRelation'),
  )
  assert.deepEqual(
    listStatusBadges.map(node => node.props.className),
    [
      'dsh-dev-dashboard__issueBadge',
      'dsh-dev-dashboard__issueBadge',
      'dsh-dev-dashboard__issueBadge dsh-dev-dashboard__issueBadgeActive',
      'dsh-dev-dashboard__issueBadge dsh-dev-dashboard__issueBadgeActive',
      'dsh-dev-dashboard__issueBadge dsh-dev-dashboard__issueBadgeVerify',
      'dsh-dev-dashboard__issueBadge dsh-dev-dashboard__issueBadgeDone',
      'dsh-dev-dashboard__issueBadge',
    ],
  )

  const detailTitleIdx = nodes.findIndex((node, idx) => idx > detailIdx && String(node.props.className).includes('__detailTitle'))
  const detailBadges = nodes.slice(detailIdx, detailTitleIdx).filter(node =>
    node.tag === 'span' && String(node.props.className).includes('__issueBadge'),
  )
  assert.ok(detailBadges.some(node => node.props.className === 'dsh-dev-dashboard__issueBadge dsh-dev-dashboard__issueBadgeVerify'))
})

test('renders distinct workitem type badges for bugs, tasks, and requirements', () => {
  const { render, form } = harness()
  form.snapshot = accountSnapshot()
  const items = [
    makeIssue({ id: 'i-bug', title: '登录报错', categoryId: 'Bug', workitemType: { id: 'type-bug', name: '缺陷' } }),
    makeIssue({ id: 'i-task', title: '接口联调', categoryId: 'Task', workitemType: { id: 'type-task', name: '任务' } }),
    makeIssue({ id: 'i-req', title: '支持扫码', categoryId: 'Req', workitemType: null }),
    makeIssue({ id: 'i-en-bug', title: '空指针异常', categoryId: 'Bug', workitemType: { id: 'type-bug-en', name: 'Bug' } }),
  ]
  const data = issueData({ items, totalCount: items.length, truncated: false })
  const { text, nodes } = render(pageStates(data, { selectedIssueId: 'i-bug' }))

  assert.ok(text.includes('缺陷'))
  assert.ok(text.includes('任务'))
  assert.ok(text.includes('需求'))

  const typeBadges = nodes.filter(node => node.tag === 'span' && node.props['data-workitem-kind'])
  assert.equal(typeBadges.length, 4)
  assert.deepEqual(
    typeBadges.map(node => ({ kind: node.props['data-workitem-kind'], className: node.props.className })),
    [
      { kind: 'bug', className: 'dsh-dev-dashboard__issueBadge dsh-dev-dashboard__issueBadgeTypeBug' },
      { kind: 'task', className: 'dsh-dev-dashboard__issueBadge dsh-dev-dashboard__issueBadgeTypeTask' },
      { kind: 'req', className: 'dsh-dev-dashboard__issueBadge dsh-dev-dashboard__issueBadgeTypeReq' },
      { kind: 'bug', className: 'dsh-dev-dashboard__issueBadge dsh-dev-dashboard__issueBadgeTypeBug' },
    ],
  )
})

test('account management modal lists all Git platform accounts for individual edit and delete', () => {
  const { render, form } = harness()
  form.snapshot = accountSnapshot([{ id: 'acc-2', platform: 'github', username: 'octocat' }])
  const data = issueData()

  // Toolbar shows manage accounts button without a redundant standalone add button
  const toolbarModalCalls = []
  const closedRender = render(pageStates(data, { setModal: next => toolbarModalCalls.push(next) }))
  assert.ok(closedRender.text.includes('管理账户'))
  assert.equal(closedRender.texts.includes('新增'), false)
  const toolbarManageBtn = closedRender.nodes.find(
    node => node.tag === 'button' && node.props['aria-label'] === '管理账户',
  )
  assert.ok(toolbarManageBtn)
  toolbarManageBtn.props.onClick()
  assert.deepEqual(
    JSON.parse(JSON.stringify(toolbarModalCalls)),
    [{ kind: 'list', accountId: '', returnToList: false }],
  )

  // Account list modal displays all configured accounts
  const listRender = render(pageStates(data, {
    modal: { kind: 'list', accountId: '', returnToList: false },
  }))
  assert.ok(listRender.text.includes('Codeup'))
  assert.ok(listRender.text.includes('tester'))
  assert.ok(listRender.text.includes('GitHub'))
  assert.ok(listRender.text.includes('octocat'))
  const rows = listRender.nodes.filter(node => node.tag === 'li' && String(node.props.className).includes('__accountRow'))
  assert.equal(rows.length, 2)

  // Deleting a specific account shows confirmation inside the modal
  const deleteRender = render(pageStates(data, {
    modal: { kind: 'list', accountId: '', returnToList: false },
    deletingId: 'acc-2',
  }))
  assert.ok(deleteRender.text.includes('删除账户：GitHub · octocat'))
  assert.ok(deleteRender.text.includes('此操作无法撤销'))
  assert.ok(deleteRender.text.includes('确认删除'))

  // Editing an individual account pre-fills that account and treats token as optional
  const editRender = render(pageStates(data, {
    modal: { kind: 'edit', accountId: 'acc-2', returnToList: true },
    platform: 'github',
    username: 'octocat',
  }))
  assert.ok(editRender.text.includes('编辑 Git 账户'))
  assert.ok(editRender.text.includes('返回列表'))
  assert.ok(editRender.text.includes('保存修改'))
  const tokenInputs = editRender.nodes.filter(node => node.tag === 'input' && node.props.type === 'password')
  assert.equal(tokenInputs.length, 1)
  assert.equal(tokenInputs[0].props.required, false)
  const usernameInput = editRender.nodes.find(node => node.tag === 'input' && node.props.type === 'text')
  assert.equal(usernameInput.props.value, 'octocat')
})

test('empty state without accounts unifies on manage accounts modal', () => {
  const { render, form } = harness()
  form.snapshot = {
    status: 'ready', writable: true,
    value: { accounts: [], selectedAccountId: '' },
  }
  const emptyModalCalls = []
  const emptyRender = render(pageStates(issueData(), { setModal: next => emptyModalCalls.push(next) }))
  assert.ok(emptyRender.text.includes('还没有 Git 账户'))
  assert.ok(emptyRender.text.includes('管理账户'))
  assert.equal(emptyRender.texts.includes('新增 Git 账户'), false)
  assert.equal(emptyRender.texts.includes('新增'), false)
  const emptyManageBtn = emptyRender.nodes.find(
    node => node.tag === 'button' && node.props['aria-label'] === '管理账户',
  )
  assert.ok(emptyManageBtn)
  emptyManageBtn.props.onClick()
  assert.deepEqual(
    JSON.parse(JSON.stringify(emptyModalCalls)),
    [{ kind: 'list', accountId: '', returnToList: false }],
  )

  // Opening the manage accounts modal when empty shows the empty list state and add action inside
  const listModalCalls = []
  const emptyListRender = render(pageStates(issueData(), {
    modal: { kind: 'list', accountId: '', returnToList: false },
    setModal: next => listModalCalls.push(next),
  }))
  assert.ok(emptyListRender.text.includes('管理 Git 账户'))
  assert.ok(emptyListRender.text.includes('当前没有已配置的 Git 账户。'))
  assert.ok(emptyListRender.text.includes('新增 Git 账户'))
  const addInModalBtn = emptyListRender.nodes.find(
    node => node.tag === 'button'
      && node.props.className === 'dsh-dev-dashboard__button'
      && typeof node.props.onClick === 'function',
  )
  assert.ok(addInModalBtn)
  addInModalBtn.props.onClick()
  assert.deepEqual(
    JSON.parse(JSON.stringify(listModalCalls)),
    [{ kind: 'add', accountId: '', returnToList: true }],
  )
})

test('encodes every Yunxiao URL segment, maps categories, and shows unsupported notice for other platforms', () => {
  const { render, form } = harness()
  const data = issueData({
    projects: [{ id: 'proj/../bad', name: '项目一' }],
  })
  data.items[0].id = 'issue/../evil?x=1'
  data.items[0].space = { id: 'proj/../bad', name: '项目一' }

  form.snapshot = accountSnapshot()
  const encoded = render(pageStates(data, { selectedIssueId: 'issue/../evil?x=1' }))
  const link = encoded.nodes.find(node => node.tag === 'a')
  assert.ok(link)
  assert.equal(
    link.props.href,
    'https://devops.aliyun.com/projex/project/proj%2F..%2Fbad/task/issue%2F..%2Fevil%3Fx%3D1',
  )
  assert.equal(link.props.href.includes('../'), false)
  assert.equal(link.props.href.includes('?x=1'), false)

  for (const [categoryId, expectedPath] of [['Req', 'req'], ['Bug', 'bug'], ['Task', 'task']]) {
    const typedData = issueData({ items: [makeIssue({ categoryId })] })
    const typedLink = render(pageStates(typedData)).nodes.find(node => node.tag === 'a')
    assert.equal(
      typedLink?.props.href,
      `https://devops.aliyun.com/projex/project/proj-1/${expectedPath}/issue-1`,
    )
  }

  const unknownCategoryData = issueData({
    items: [makeIssue({ categoryId: '../../evil', workitemType: { id: 'custom', name: '自定义' } })],
  })
  assert.equal(render(pageStates(unknownCategoryData)).nodes.some(node => node.tag === 'a'), false)

  form.snapshot = {
    status: 'ready', writable: true,
    value: {
      accounts: [{ id: 'acc-2', platform: 'gitlab', username: 'tester' }],
      selectedAccountId: 'acc-2',
    },
  }
  const unsupported = render(pageStates(data))
  assert.ok(unsupported.text.includes('该平台尚未接入 Issue 获取'))
  assert.ok(unsupported.text.includes('管理账户'))
  assert.ok(unsupported.nodes.some(node => String(node.props.className).includes('__accountTools')))
  assert.equal(unsupported.nodes.some(node => node.tag === 'a'), false)
})

test('renders GitHub issue workbench with owner/repository filters, labels, and safe GitHub links', () => {
  const { render, form } = harness()
  form.snapshot = {
    status: 'ready',
    writable: true,
    value: {
      accounts: [{ id: 'acc-gh', platform: 'github', username: 'octocat' }],
      selectedAccountId: 'acc-gh',
    },
  }
  const ghIssue = makeIssue({
    id: 'octocat/my-repo#12',
    organizationId: 'octocat',
    title: 'Add dark mode',
    subject: 'Add dark mode',
    serialNumber: '#12',
    status: { id: 'open', name: 'Open', displayName: 'Open', nameEn: 'Open' },
    statusStageId: '1',
    categoryId: 'Req',
    workitemType: { id: 'req', name: 'Feature' },
    space: { id: 'octocat/my-repo', name: 'octocat/my-repo' },
    labels: [{ id: '1', name: 'enhancement' }, { id: '2', name: 'ui' }],
    webUrl: 'https://github.com/octocat/my-repo/issues/12',
    relations: ['participant'],
  })
  const ghData = issueData({
    organizations: [{ id: 'octocat', name: 'octocat' }],
    projects: [{ id: 'octocat/my-repo', name: 'octocat/my-repo' }],
    selectedOrganizationId: 'all',
    selectedProjectId: 'all',
    items: [ghIssue],
    totalCount: 1,
    truncated: false,
  })
  const rendered = render(pageStates(ghData, {
    selectedIssueId: 'octocat/my-repo#12',
    detailItem: ghIssue,
  }))

  for (const expected of [
    '全部所有者', '全部仓库', 'Add dark mode', '#12', 'Open', 'octocat/my-repo',
    '共 1 个 Issue', '在 GitHub 中打开', '仓库', '标签', 'enhancement、ui', '开始',
  ]) {
    assert.ok(rendered.text.includes(expected), `missing rendered GitHub text: ${expected}`)
  }
  assert.equal(rendered.text.includes('该平台尚未接入 Issue 获取'), false)

  const links = rendered.nodes.filter(node => node.tag === 'a')
  assert.equal(links.length, 1)
  assert.equal(links[0].props.href, 'https://github.com/octocat/my-repo/issues/12')

  // Reject non-GitHub URLs on GitHub accounts
  const evilIssue = { ...ghIssue, webUrl: 'https://evil.example/phish' }
  const evilRender = render(pageStates(issueData({ ...ghData, items: [evilIssue] }), {
    selectedIssueId: evilIssue.id,
    detailItem: evilIssue,
  }))
  assert.equal(evilRender.nodes.some(node => node.tag === 'a'), false)
})

test('renders total statistical count and pagination footer states', () => {
  const { render, form } = harness()
  form.snapshot = accountSnapshot()

  const moreData = issueData({
    items: Array.from({ length: 20 }, (_, i) => makeIssue({ id: `issue-${i + 1}`, title: `任务 ${i + 1}` })),
    totalCount: null,
    hasMore: true,
    nextCursor: { projectIndex: 0, page: 1, offset: 20, anchorId: 'issue-20' },
    truncated: false,
  })

  // Total count ready while partially loaded
  const countedRender = render(pageStates(moreData, {
    selectedIssueId: 'issue-1',
    countState: { status: 'ready', total: 86, truncated: false },
  }))
  assert.ok(countedRender.text.includes('共 86 个工作项（已加载 20）'))
  assert.ok(countedRender.text.includes('加载更多'))
  assert.ok(countedRender.nodes.some(node => String(node.props.className).includes('__loadMoreSentinel')))

  // While background count is still loading
  const countingRender = render(pageStates(moreData, {
    selectedIssueId: 'issue-1',
    countState: { status: 'loading', total: null, truncated: false },
  }))
  assert.ok(countingRender.text.includes('正在统计总数…'))

  // Loading more & error states
  const loadingMoreRender = render(pageStates(moreData, {
    selectedIssueId: 'issue-1',
    issueStateOverrides: { loadingMore: true },
  }))
  assert.ok(loadingMoreRender.text.includes('正在加载更多工作项…'))

  const errorMoreRender = render(pageStates(moreData, {
    selectedIssueId: 'issue-1',
    issueStateOverrides: { loadMoreError: '分页加载失败' },
  }))
  assert.ok(errorMoreRender.text.includes('分页加载失败'))
  assert.ok(errorMoreRender.text.includes('重试'))

  // All loaded
  const endData = issueData({ hasMore: false, nextCursor: null, totalCount: 1, truncated: false })
  const endRender = render(pageStates(endData, { selectedIssueId: 'issue-1' }))
  assert.ok(endRender.text.includes('共 1 个工作项'))
  assert.ok(endRender.text.includes('已加载全部工作项'))
  assert.equal(endRender.text.includes('加载更多'), false)
})

test('IssueWorkbench queries 20 items, fetches background total count, and loads next page on scroll', async () => {
  const rpcCalls = []
  const page1Items = Array.from({ length: 20 }, (_, i) => makeIssue({
    id: `issue-${i + 1}`,
    title: `工作项 ${i + 1}`,
  }))
  const page2Items = [
    makeIssue({ id: 'issue-20', title: '工作项 20', relations: ['participant'] }),
    ...Array.from({ length: 5 }, (_, i) => makeIssue({
      id: `issue-${21 + i}`,
      title: `工作项 ${21 + i}`,
    })),
  ]

  let definition
  const observers = []
  class FakeIntersectionObserver {
    constructor(callback) {
      this.callback = callback
      this.observed = []
      observers.push(this)
    }
    observe(target) { this.observed.push(target) }
    disconnect() {}
  }
  const fakeWindow = {
    __ModuleLoader__: { load(value) { definition = value } },
    innerHeight: 800,
    addEventListener() {},
    removeEventListener() {},
  }
  const context = {
    window: fakeWindow,
    IntersectionObserver: FakeIntersectionObserver,
    console, AbortController, Intl, Date, URL,
  }
  vm.runInNewContext(source, context)

  const stateSlots = []
  const refSlots = []
  const effectSlots = []
  let stateIdx = 0
  let refIdx = 0
  let effectIdx = 0
  let pendingEffects = []

  let scheduled = false
  function scheduleRerender() {
    if (scheduled) return
    scheduled = true
    queueMicrotask(() => {
      scheduled = false
      rerender()
    })
  }

  const React = {
    createElement(type, props, ...children) { return { type, props: props || {}, children } },
    useState(initial) {
      const idx = stateIdx++
      if (!(idx in stateSlots)) {
        stateSlots[idx] = typeof initial === 'function' ? initial() : initial
      }
      const setState = (updater) => {
        stateSlots[idx] = typeof updater === 'function' ? updater(stateSlots[idx]) : updater
        scheduleRerender()
      }
      return [stateSlots[idx], setState]
    },
    useRef(initial) {
      const idx = refIdx++
      if (!(idx in refSlots)) refSlots[idx] = { current: initial }
      return refSlots[idx]
    },
    useCallback(fn) { return fn },
    useEffect(effect, deps) {
      const idx = effectIdx++
      const prev = effectSlots[idx]
      const changed = !prev || !deps || deps.some((d, i) => !Object.is(d, prev.deps[i]))
      if (changed) {
        pendingEffects.push({ idx, effect, deps })
      }
    },
    useSyncExternalStore(subscribe, getSnapshot) { return getSnapshot() },
    useId() { return 'test-id' },
  }

  const plugin = definition.factory((name) => {
    if (name === 'react') return React
    if (name === '@deepseek-ai/dsh-client-ui-primitives') return {}
    throw new Error(`Unexpected require: ${name}`)
  })
  const registrations = []
  const rpc = {
    async call(_channel, endpoint, payload) {
      rpcCalls.push({ endpoint, payload })
      if (endpoint === 'load' && !payload.cursor) {
        return {
          ok: true,
          value: issueData({
            items: page1Items,
            totalCount: null,
            hasMore: true,
            nextCursor: { projectIndex: 0, page: 1, offset: 20, anchorId: 'issue-20' },
          }),
        }
      }
      if (endpoint === 'count') {
        return {
          ok: true,
          value: { total: 25, assigned: 20, participant: 5, truncated: false },
        }
      }
      if (endpoint === 'load' && payload.cursor) {
        return {
          ok: true,
          value: issueData({
            items: page2Items,
            totalCount: null,
            hasMore: false,
            nextCursor: null,
          }),
        }
      }
      throw new Error(`Unexpected RPC: ${endpoint}`)
    },
  }
  const ctx = {
    effect(setup) { return setup() },
    locale: { register() { return () => {} }, bind() { return key => zhDict[key] ?? key } },
    configForms: { get: () => ({ getSnapshot: () => accountSnapshot(), subscribe: () => () => {} }) },
    remote: { credentials: {} },
    connection: { rpc },
    layout: { panelInfo: { getSnapshot: () => ({ activePanelId: null }) }, selectPanel() {} },
    slots: {
      inject(_owner, setup) { return setup() },
      register(options, component) { registrations.push({ options, component }); return () => {} },
    },
  }
  plugin.apply(ctx)
  const main = registrations.find(item => item.options.name === 'main')

  function findIssueWorkbench(node) {
    if (!node || typeof node !== 'object') return null
    if (Array.isArray(node)) {
      for (const child of node) {
        const found = findIssueWorkbench(child)
        if (found) return found
      }
      return null
    }
    if (typeof node.type === 'function' && node.type.name === 'IssueWorkbench') return node
    if (typeof node.type === 'function') return findIssueWorkbench(node.type({ ...node.props, children: node.children }))
    return findIssueWorkbench(node.children)
  }

  const mainTree = React.createElement(main.component, { ...main.options.inject(), t: key => zhDict[key] ?? key })
  const workbenchNode = findIssueWorkbench(mainTree)
  const IssueWorkbench = workbenchNode.type
  const workbenchProps = workbenchNode.props

  function attachRefs(node) {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) { node.forEach(attachRefs); return }
    if (node.props?.ref && typeof node.props.ref === 'object') {
      node.props.ref.current = {
        closest: () => null,
        getBoundingClientRect: () => ({ top: 1200, bottom: 1201 }),
      }
    }
    if (Array.isArray(node.children)) node.children.forEach(attachRefs)
  }

  function rerender() {
    stateIdx = 0
    refIdx = 0
    effectIdx = 0
    pendingEffects = []
    const tree = IssueWorkbench(workbenchProps)
    attachRefs(tree)
    const effectsToRun = pendingEffects
    pendingEffects = []
    for (const item of effectsToRun) {
      effectSlots[item.idx]?.cleanup?.()
      effectSlots[item.idx] = { deps: item.deps, cleanup: undefined }
      const cleanup = item.effect()
      effectSlots[item.idx].cleanup = typeof cleanup === 'function' ? cleanup : undefined
    }
  }

  rerender()
  await new Promise(resolve => setTimeout(resolve, 25))

  assert.equal(rpcCalls.length, 2)
  assert.equal(rpcCalls[0].endpoint, 'load')
  assert.equal(rpcCalls[0].payload.pageSize, 20)
  assert.equal(rpcCalls[1].endpoint, 'count')
  assert.equal(stateSlots[3], 'issue-1') // auto-selected first item
  assert.equal(stateSlots[4].data.items.length, 20)
  assert.equal(stateSlots[5].total, 25) // background total count resolved
  assert.ok(observers.length >= 1)

  // Trigger scroll intersection at the bottom sentinel on the latest active observer.
  observers.at(-1).callback([{ isIntersecting: true }])
  await new Promise(resolve => setTimeout(resolve, 25))

  assert.equal(rpcCalls.length, 3)
  assert.equal(rpcCalls[2].endpoint, 'load')
  assert.deepEqual(rpcCalls[2].payload.cursor, { projectIndex: 0, page: 1, offset: 20, anchorId: 'issue-20' })
  assert.equal(stateSlots[4].data.items.length, 25)
  assert.deepEqual(
    Array.from(stateSlots[4].data.items.find(item => item.id === 'issue-20').relations),
    ['assigned', 'participant'],
  )
  assert.equal(stateSlots[4].data.hasMore, false)
})

test('renders TaskCloneModal for empty repositories and multi-repo clone results', () => {
  const { render, form } = harness()
  form.snapshot = accountSnapshot()
  const issue = makeIssue({ id: 'issue-start', statusStageId: '1', serialNumber: 'PROJ-10' })
  const data = issueData({ items: [issue], totalCount: 1, truncated: false })

  const emptyModal = render(pageStates(data, {
    selectedIssueId: 'issue-start',
    cloneState: {
      status: 'empty',
      issue,
      actionKind: 'start',
      baseDir: '/Users/tester/project',
      results: [],
      error: '',
    },
  }))
  assert.ok(emptyModal.text.includes('开始任务 · PROJ-10'))
  assert.ok(emptyModal.text.includes('该任务没有关联仓库，请先去关联。'))

  const doneModal = render(pageStates(data, {
    selectedIssueId: 'issue-start',
    cloneState: {
      status: 'done',
      issue,
      actionKind: 'continue',
      baseDir: '/Users/tester/project',
      results: [
        { name: 'repo-one', path: 'repo-one', targetDir: '/Users/tester/project/repo-one', status: 'cloned', error: '' },
        { name: 'repo-two', path: 'repo-two', targetDir: '/Users/tester/project/repo-two', status: 'exists', error: '' },
      ],
      error: '',
    },
  }))
  assert.ok(doneModal.text.includes('继续任务 · PROJ-10'))
  assert.ok(doneModal.text.includes('目标目录：/Users/tester/project'))
  assert.ok(doneModal.text.includes('repo-one'))
  assert.ok(doneModal.text.includes('克隆成功'))
  assert.ok(doneModal.text.includes('repo-two'))
  assert.ok(doneModal.text.includes('已存在，已跳过'))
})

test('clicking Start or Continue selects the issue and triggers cloneRepos RPC', async () => {
  const rpcCalls = []
  const startIssue = makeIssue({ id: 'issue-start', title: '待开始任务', statusStageId: '1' })
  const continueIssue = makeIssue({ id: 'issue-continue', title: '进行中任务', statusStageId: '2' })

  let definition
  const context = {
    window: {
      __ModuleLoader__: { load(value) { definition = value } },
      innerHeight: 800,
      addEventListener() {},
      removeEventListener() {},
    },
    console, AbortController, Intl, Date, URL,
  }
  vm.runInNewContext(source, context)

  const stateSlots = []
  const refSlots = []
  const effectSlots = []
  let stateIdx = 0
  let refIdx = 0
  let effectIdx = 0
  let pendingEffects = []
  let latestTree = null

  let scheduled = false
  function scheduleRerender() {
    if (scheduled) return
    scheduled = true
    queueMicrotask(() => {
      scheduled = false
      rerender()
    })
  }

  const React = {
    createElement(type, props, ...children) { return { type, props: props || {}, children } },
    useState(initial) {
      const idx = stateIdx++
      if (!(idx in stateSlots)) stateSlots[idx] = typeof initial === 'function' ? initial() : initial
      const setState = (updater) => {
        stateSlots[idx] = typeof updater === 'function' ? updater(stateSlots[idx]) : updater
        scheduleRerender()
      }
      return [stateSlots[idx], setState]
    },
    useRef(initial) {
      const idx = refIdx++
      if (!(idx in refSlots)) refSlots[idx] = { current: initial }
      return refSlots[idx]
    },
    useCallback(fn) { return fn },
    useEffect(effect, deps) {
      const idx = effectIdx++
      const prev = effectSlots[idx]
      const changed = !prev || !deps || deps.some((d, i) => !Object.is(d, prev.deps[i]))
      if (changed) pendingEffects.push({ idx, effect, deps })
    },
    useSyncExternalStore(_sub, getSnapshot) { return getSnapshot() },
    useId() { return 'test-id' },
  }

  const plugin = definition.factory((name) => {
    if (name === 'react') return React
    if (name === '@deepseek-ai/dsh-client-ui-primitives') return {}
    throw new Error(`Unexpected require: ${name}`)
  })
  const registrations = []
  const rpc = {
    async call(_channel, endpoint, payload) {
      rpcCalls.push({ endpoint, payload })
      if (endpoint === 'load') {
        return {
          ok: true,
          value: issueData({ items: [startIssue, continueIssue], totalCount: 2, hasMore: false, truncated: false }),
        }
      }
      if (endpoint === 'cloneRepos') {
        if (payload.issueId === 'issue-start') {
          return { ok: true, value: { empty: true, baseDir: '/Users/tester/project', results: [] } }
        }
        return {
          ok: true,
          value: {
            empty: false,
            baseDir: '/Users/tester/project',
            results: [{ name: 'app-repo', path: 'app-repo', targetDir: '/Users/tester/project/app-repo', status: 'cloned', error: '' }],
          },
        }
      }
      throw new Error(`Unexpected RPC: ${endpoint}`)
    },
  }
  const createdWorkspaces = []
  const openedWorkspaces = []
  let workspaceOpenError = null
  const workspaces = {
    async create(input) {
      createdWorkspaces.push(input)
      return { workspaceId: `ws-${createdWorkspaces.length}`, path: input.path, title: input.path }
    },
  }
  const uiWorkspace = {
    async openWorkspace(workspaceId) {
      openedWorkspaces.push(workspaceId)
      if (workspaceOpenError) throw workspaceOpenError
    },
  }
  plugin.apply({
    effect(setup) { return setup() },
    locale: { register() { return () => {} }, bind() { return key => zhDict[key] ?? key } },
    configForms: { get: () => ({ getSnapshot: () => accountSnapshot(), subscribe: () => () => {} }) },
    remote: { credentials: {} },
    connection: { rpc },
    workspaces,
    uiWorkspace,
    layout: { panelInfo: { getSnapshot: () => ({ activePanelId: null }) }, selectPanel() {} },
    slots: {
      inject(_owner, setup) { return setup() },
      register(options, component) { registrations.push({ options, component }); return () => {} },
    },
  })

  const main = registrations.find(item => item.options.name === 'main')
  function findIssueWorkbench(node) {
    if (!node || typeof node !== 'object') return null
    if (Array.isArray(node)) {
      for (const child of node) {
        const found = findIssueWorkbench(child)
        if (found) return found
      }
      return null
    }
    if (typeof node.type === 'function' && node.type.name === 'IssueWorkbench') return node
    if (typeof node.type === 'function') return findIssueWorkbench(node.type({ ...node.props, children: node.children }))
    return findIssueWorkbench(node.children)
  }
  const mainTree = React.createElement(main.component, { ...main.options.inject(), t: key => zhDict[key] ?? key })
  const workbenchNode = findIssueWorkbench(mainTree)
  const IssueWorkbench = workbenchNode.type
  const workbenchProps = workbenchNode.props

  function collectButtons(node, list = []) {
    if (!node || typeof node !== 'object') return list
    if (Array.isArray(node)) { node.forEach(child => collectButtons(child, list)); return list }
    if (typeof node.type === 'function') {
      if (node.type.name === 'IssueListItem') {
        collectButtons(node.type({ ...node.props, children: node.children }), list)
      }
      return list
    }
    if (node.type === 'button' && String(node.props?.className).includes('__taskActionBtn')) {
      list.push(node)
    }
    if (Array.isArray(node.children)) node.children.forEach(child => collectButtons(child, list))
    return list
  }

  function rerender() {
    stateIdx = 0
    refIdx = 0
    effectIdx = 0
    pendingEffects = []
    latestTree = IssueWorkbench(workbenchProps)
    const effectsToRun = pendingEffects
    pendingEffects = []
    for (const item of effectsToRun) {
      effectSlots[item.idx]?.cleanup?.()
      effectSlots[item.idx] = { deps: item.deps, cleanup: undefined }
      const cleanup = item.effect()
      effectSlots[item.idx].cleanup = typeof cleanup === 'function' ? cleanup : undefined
    }
  }

  rerender()
  await new Promise(resolve => setTimeout(resolve, 25))

  const buttons = collectButtons(latestTree)
  assert.equal(buttons.length, 2)

  buttons[0].props.onClick({ stopPropagation() {} })
  await new Promise(resolve => setTimeout(resolve, 25))
  assert.equal(stateSlots[3], 'issue-start')
  assert.equal(stateSlots[6].status, 'empty')
  assert.equal(createdWorkspaces.length, 0)
  assert.equal(openedWorkspaces.length, 0)

  buttons[1].props.onClick({ stopPropagation() {} })
  await new Promise(resolve => setTimeout(resolve, 25))
  assert.equal(stateSlots[3], 'issue-continue')
  assert.equal(stateSlots[6].status, 'idle')
  assert.deepEqual(JSON.parse(JSON.stringify(createdWorkspaces)), [
    { path: '/Users/tester/project/app-repo' },
  ])
  assert.deepEqual(openedWorkspaces, ['ws-1'])

  workspaceOpenError = new Error('workspace busy')
  buttons[1].props.onClick({ stopPropagation() {} })
  await new Promise(resolve => setTimeout(resolve, 25))
  assert.equal(stateSlots[6].status, 'done')
  assert.equal(stateSlots[6].results[0].path, 'app-repo')
  assert.ok(stateSlots[6].error.includes('workspace busy'))

  const cloneCalls = rpcCalls.filter(call => call.endpoint === 'cloneRepos')
  assert.deepEqual(JSON.parse(JSON.stringify(cloneCalls.map(call => call.payload))), [
    { accountId: 'acc-1', organizationId: 'org-1', issueId: 'issue-start' },
    { accountId: 'acc-1', organizationId: 'org-1', issueId: 'issue-continue' },
    { accountId: 'acc-1', organizationId: 'org-1', issueId: 'issue-continue' },
  ])
})
