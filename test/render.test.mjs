import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'

const zhDict = {
  title: 'Git 工作台', subtitle: '管理 Git 账户与 Codeup 工作项', back: '返回对话',
  accountSelect: '选择 Git 账户', add: '新增', addAccount: '新增 Git 账户',
  edit: '编辑', delete: '删除', editFormTitle: '编辑 Git 账户',
  editTokenHint: '留空表示保留当前访问令牌', saveChanges: '保存修改',
  confirmDeleteTitle: '删除账户', confirmDeleteDescription: '此操作无法撤销',
  confirmDeleteAction: '确认删除',
  emptyTitle: '还没有 Git 账户', emptyDescription: '选择 Git 托管平台并配置账户。',
  formTitle: '新增 Git 账户', platform: '托管平台', username: '用户名',
  configuredNote: '账户信息和当前选择保存在本机；访问令牌由凭据存储保管。',
  issues: 'Codeup 工作项', scopeAll: '我负责或参与',
  organization: '组织',
  project: '项目', allProjects: '全部项目', refresh: '刷新', refreshing: '正在刷新…',
  issuesLoading: '正在读取 Codeup 工作项…', issueCount: '个工作项',
  noIssues: '没有匹配的工作项', noIssuesDescription: '可以尝试切换范围、组织或项目。',
  truncated: '结果可能不完整：本次查询已达到扫描上限。',
  expand: '查看详情', collapse: '收起详情', detailLoading: '正在读取详情…',
  detailError: '详情读取失败。', description: '描述', noDescription: '没有描述。',
  serialNumber: '编号', type: '类型', status: '状态', assignedTo: '负责人',
  participants: '参与人', creator: '创建人', updatedAt: '更新时间', createdAt: '创建时间',
  labels: '标签', otherFields: '其他字段', openInCodeup: '在云效中打开',
  relationAssigned: '负责', relationParticipant: '参与',
  noOrganizations: '这个账户没有可用的云效组织。', noProjects: '这个组织下没有可用项目。',
  loadMore: '加载更多', loadingMore: '正在加载更多工作项…',
  noMoreIssues: '已加载全部工作项', loadMoreError: '加载更多工作项失败。',
  unsupportedIssues: '该平台尚未接入 Issue 获取',
  unsupportedDescription: '目前仅支持 Codeup（云效项目协作）的需求、任务和缺陷。',
  issueUnavailable: '当前连接不可用，无法读取工作项。', retry: '重试',
}

const source = await readFile(new URL('../dist/client.js', import.meta.url), 'utf8')

/**
 * Minimal hook-driven renderer: function components are invoked with an
 * injected useState queue so the real JSX tree renders without a DOM.
 */
function harness() {
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
    assert.equal(name, 'react')
    return React
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
  // The real Slot layer injects `t` from the registration's `locale: NS`.
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
      children.forEach(visit)
    }
    visit(React.createElement(main.component, props))
    return { text: texts.join(' '), texts, nodes }
  }

  return { render, form }
}

function issueData(overrides = {}) {
  const item = {
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
    description: '## 任务内容\n把登录超时从 30s 改成 60s。',
    formatType: 'MARKDOWN',
    customFieldValues: [{
      fieldId: 'priority', fieldName: '优先级', fieldFormat: 'list',
      values: [{ identifier: 'high', displayValue: '高' }],
      displayValues: ['高'], displayValue: '高',
    }],
  }
  return {
    user: { id: 'u1', name: '宋传伟' },
    organizations: [{ id: 'org-1', name: '我的组织' }],
    projects: [{ id: 'proj-1', name: '项目一' }],
    selectedOrganizationId: 'org-1',
    selectedProjectId: 'all',
    scope: 'all',
    items: [item],
    truncated: true,
    stats: { projectsSearched: 1, itemsReturned: 1 },
    ...overrides,
  }
}

function pageStates(data, expandedId = 'issue-1') {
  return {
    GitWorkbenchPage: [
      [false, () => {}], [false, () => {}], [false, () => {}],
      ['github', () => {}], ['', () => {}], ['', () => {}],
      [false, () => {}], [false, () => {}], ['', () => {}],
    ],
    IssueWorkbench: [
      ['', () => {}], ['all', () => {}],
      [0, () => {}], [expandedId, () => {}],
      [{ status: 'ready', data, error: '' }, () => {}],
    ],
    IssueDetail: [
      [{ status: 'ready', detail: data.items[0], error: '' }, () => {}],
    ],
  }
}

function accountSnapshot() {
  return {
    status: 'ready', writable: true,
    value: {
      accounts: [{ id: 'acc-1', platform: 'codeup', username: 'tester' }],
      selectedAccountId: 'acc-1',
    },
  }
}

test('renders the Codeup issue list, detail fields, truncation notice, and a safe Yunxiao link', () => {
  const { render, form } = harness()
  form.snapshot = {
    status: 'ready', writable: true,
    value: {
      accounts: [{ id: 'acc-1', platform: 'codeup', username: 'tester' }],
      selectedAccountId: 'acc-1',
    },
  }
  const data = issueData()
  const { text, nodes } = render(pageStates(data))

  for (const expected of [
    '修复登录超时', 'EWUX-3759', '处理中', '任务', '项目一', '宋传伟', '周冬伟',
    '## 任务内容', '把登录超时从 30s 改成 60s。', '优先级', '高',
    '我负责或参与', '负责', '参与',
    '结果可能不完整', '在云效中打开', '描述', '其他字段', '更新时间',
  ]) {
    assert.ok(text.includes(expected), `missing rendered text: ${expected}`)
  }

  const links = nodes.filter(node => node.tag === 'a')
  assert.equal(links.length, 1)
  assert.equal(
    links[0].props.href,
    'https://devops.aliyun.com/projExcellence/org-1/proj-1?workItemFilter=all&workItemId=issue-1',
  )
  assert.equal(links[0].props.target, '_blank')
  assert.equal(links[0].props.rel, 'noopener noreferrer')

  const expanded = nodes.filter(node => node.tag === 'button' && node.props['aria-expanded'] === true)
  assert.equal(expanded.length, 1)
  assert.ok(String(expanded[0].props['aria-controls']).includes('issue-1'))

  // Descriptions are rendered as text nodes, never as raw HTML.
  assert.equal(nodes.some(node => Object.hasOwn(node.props, 'dangerouslySetInnerHTML')), false)
})

test('encodes every Yunxiao URL segment and shows the unsupported notice for other platforms', () => {
  const { render, form } = harness()
  const data = issueData({
    selectedOrganizationId: 'org/../evil?x=1',
    projects: [{ id: 'proj/../bad', name: '项目一' }],
  })
  data.items[0].space = { id: 'proj/../bad', name: '项目一' }

  form.snapshot = {
    status: 'ready', writable: true,
    value: {
      accounts: [{ id: 'acc-1', platform: 'codeup', username: 'tester' }],
      selectedAccountId: 'acc-1',
    },
  }
  const encoded = render(pageStates(data))
  const link = encoded.nodes.find(node => node.tag === 'a')
  assert.ok(link)
  assert.ok(link.props.href.startsWith('https://devops.aliyun.com/projExcellence/'))
  assert.equal(link.props.href.includes('../'), false)
  assert.equal(link.props.href.includes('?x=1'), false)
  assert.ok(link.props.href.includes('org%2F..%2Fevil%3Fx%3D1'))
  assert.ok(link.props.href.includes('proj%2F..%2Fbad'))

  form.snapshot = {
    status: 'ready', writable: true,
    value: {
      accounts: [{ id: 'acc-2', platform: 'github', username: 'tester' }],
      selectedAccountId: 'acc-2',
    },
  }
  const unsupported = render(pageStates(data))
  assert.ok(unsupported.text.includes('该平台尚未接入 Issue 获取'))
  assert.equal(unsupported.nodes.some(node => node.tag === 'a'), false)
})

test('offers edit and delete controls for the selected account', () => {
  const { render, form } = harness()
  form.snapshot = accountSnapshot()
  const { nodes } = render(pageStates(issueData()))
  const labels = nodes.filter(node => node.tag === 'button').map(node => node.props['aria-label'])
  assert.ok(labels.includes('编辑'))
  assert.ok(labels.includes('删除'))
  const actions = nodes.filter(node => node.tag === 'button'
    && String(node.props.className).includes('__accountAction'))
  assert.equal(actions.length, 2)
})

test('asks for confirmation, with the account name, before deleting', () => {
  const { render, form } = harness()
  form.snapshot = accountSnapshot()
  const states = pageStates(issueData())
  states.GitWorkbenchPage[2] = [true, () => {}]
  const { text, nodes } = render(states)
  assert.ok(text.includes('删除账户：Codeup · tester'))
  assert.ok(text.includes('此操作无法撤销'))
  assert.ok(text.includes('确认删除'))
  const confirm = nodes.find(node => node.tag === 'div'
    && String(node.props.className).includes('__confirm'))
  assert.ok(confirm)
  assert.equal(confirm.props.role, 'alertdialog')
})

test('edit form pre-fills the account and treats the token as optional', () => {
  const { render, form } = harness()
  form.snapshot = accountSnapshot()
  const states = pageStates(issueData())
  states.GitWorkbenchPage[1] = [true, () => {}]
  states.GitWorkbenchPage[3] = ['codeup', () => {}]
  states.GitWorkbenchPage[4] = ['tester', () => {}]
  const { text, nodes } = render(states)
  assert.ok(text.includes('编辑 Git 账户'))
  assert.ok(text.includes('留空表示保留当前访问令牌'))
  assert.ok(text.includes('保存修改'))
  const tokenInputs = nodes.filter(node => node.tag === 'input' && node.props.type === 'password')
  assert.equal(tokenInputs.length, 1)
  assert.equal(tokenInputs[0].props.required, false)
  const username = nodes.find(node => node.tag === 'input' && node.props.type === 'text')
  assert.equal(username.props.value, 'tester')
})

test('shows only the single scope note, with no scope filter buttons', () => {
  const { render, form } = harness()
  form.snapshot = accountSnapshot()
  const { text, nodes } = render(pageStates(issueData()))
  assert.ok(text.includes('我负责或参与'))
  assert.equal(text.includes('我负责的'), false)
  assert.equal(text.includes('我参与的'), false)
  assert.equal(nodes.some(node => String(node.props.className).includes('__scopeButton')), false)
  const notes = nodes.filter(node => String(node.props.className).includes('__scopeNote'))
  assert.equal(notes.length, 1)
})

test('renders pagination footer states (sentinel/loadMore, loadingMore, loadMoreError, and end)', () => {
  const { render, form } = harness()
  form.snapshot = accountSnapshot()

  const moreData = issueData({
    hasMore: true,
    nextCursor: { projectIndex: 0, page: 1, offset: 20, anchorId: 'issue-1' },
  })
  const moreRender = render(pageStates(moreData, null))
  assert.ok(moreRender.text.includes('加载更多'))
  assert.equal(moreRender.text.includes('已加载全部工作项'), false)
  assert.ok(moreRender.nodes.some(node => String(node.props.className).includes('__loadMoreSentinel')))

  const loadingMoreStates = pageStates(moreData, null)
  loadingMoreStates.IssueWorkbench[4] = [{ status: 'ready', data: moreData, error: '', loadingMore: true, loadMoreError: '' }, () => {}]
  const loadingMoreRender = render(loadingMoreStates)
  assert.ok(loadingMoreRender.text.includes('正在加载更多工作项…'))

  const errorMoreStates = pageStates(moreData, null)
  errorMoreStates.IssueWorkbench[4] = [{ status: 'ready', data: moreData, error: '', loadingMore: false, loadMoreError: '分页加载失败' }, () => {}]
  const errorMoreRender = render(errorMoreStates)
  assert.ok(errorMoreRender.text.includes('分页加载失败'))
  assert.ok(errorMoreRender.text.includes('重试'))

  const endData = issueData({ hasMore: false, nextCursor: null })
  const endRender = render(pageStates(endData, null))
  assert.ok(endRender.text.includes('已加载全部工作项'))
  assert.equal(endRender.text.includes('加载更多'), false)
})

test('IssueWorkbench queries 20 items initially and loads next 20 items on scroll intersection', async () => {
  const rpcCalls = []
  const page1Items = Array.from({ length: 20 }, (_, i) => ({
    ...issueData().items[0],
    id: `issue-${i + 1}`,
    title: `工作项 ${i + 1}`,
  }))
  const page2Items = [
    // Include one overlapping id to verify client deduplication
    { ...issueData().items[0], id: 'issue-20', title: '工作项 20', relations: ['participant'] },
    ...Array.from({ length: 5 }, (_, i) => ({
      ...issueData().items[0],
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
  let currentTree = null

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

  const plugin = definition.factory(() => React)
  const registrations = []
  const rpc = {
    async call(_channel, endpoint, payload) {
      rpcCalls.push({ endpoint, payload })
      if (endpoint === 'load' && !payload.cursor) {
        return {
          ok: true,
          value: issueData({
            items: page1Items,
            hasMore: true,
            nextCursor: { projectIndex: 0, page: 1, offset: 20, anchorId: 'issue-20' },
          }),
        }
      }
      if (endpoint === 'load' && payload.cursor) {
        return {
          ok: true,
          value: issueData({
            items: page2Items,
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

  // Isolate IssueWorkbench component directly from rendered main tree.
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
    currentTree = IssueWorkbench(workbenchProps)
    attachRefs(currentTree)
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
  await new Promise(resolve => setTimeout(resolve, 20))

  assert.equal(rpcCalls.length, 1)
  assert.equal(rpcCalls[0].endpoint, 'load')
  assert.equal(rpcCalls[0].payload.pageSize, 20)
  assert.equal(rpcCalls[0].payload.cursor, undefined)
  assert.equal(stateSlots[4].data.items.length, 20)
  assert.equal(observers.length, 1)

  // Trigger scroll intersection at the bottom sentinel.
  observers[0].callback([{ isIntersecting: true }])
  await new Promise(resolve => setTimeout(resolve, 20))

  assert.equal(rpcCalls.length, 2)
  assert.equal(rpcCalls[1].endpoint, 'load')
  assert.equal(rpcCalls[1].payload.pageSize, 20)
  assert.deepEqual(rpcCalls[1].payload.cursor, { projectIndex: 0, page: 1, offset: 20, anchorId: 'issue-20' })
  assert.equal(stateSlots[4].data.items.length, 25)
  assert.deepEqual(
    Array.from(stateSlots[4].data.items.find(item => item.id === 'issue-20').relations),
    ['assigned', 'participant'],
  )
  assert.equal(stateSlots[4].data.hasMore, false)
})
