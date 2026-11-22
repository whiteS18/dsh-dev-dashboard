window.__ModuleLoader__.load({
  id: 'dsh-dev-dashboard',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    let primitives = {}
    try {
      primitives = require('@deepseek-ai/dsh-client-ui-primitives') || {}
    } catch (_error) {
      primitives = {}
    }
    const DshMenu = typeof primitives.Menu === 'function' ? primitives.Menu : null
    const DshModal = typeof primitives.Modal === 'function' ? primitives.Modal : null
    const DshMarkdownText = typeof primitives.MarkdownText === 'function' ? primitives.MarkdownText : null

    const PACKAGE = 'dsh-dev-dashboard'
    const ENTRY_ID = `${PACKAGE}:host`
    const PANEL_ID = `${PACKAGE}:panel`
    const RPC_CHANNEL = '/dsh-dev-dashboard'
    const NS = 'dsh-dev-dashboard'
    const CN = 'dsh-dev-dashboard'

    const zh = {
      title: 'Git 工作台',
      subtitle: '管理 Git 账户与 Codeup 工作项',
      back: '返回对话',
      accountSelect: '选择 Git 账户',
      addAccount: '新增 Git 账户',
      manageAccounts: '管理账户',
      accountListTitle: '管理 Git 账户',
      accountListEmpty: '当前没有已配置的 Git 账户。',
      currentAccount: '当前',
      backToList: '返回列表',
      close: '关闭',
      emptyTitle: '还没有 Git 账户',
      emptyDescription: '选择 Git 托管平台并配置账户。账户信息和当前选择仅保存在本机。',
      formTitle: '新增 Git 账户',
      platform: '托管平台',
      username: '用户名',
      usernamePlaceholder: '输入账户用户名',
      token: '访问令牌',
      tokenPlaceholder: '输入访问令牌',
      tokenHint: '令牌仅写入本机凭据存储，不会保存在普通配置中。',
      save: '保存账户',
      cancel: '取消',
      edit: '编辑',
      delete: '删除',
      editFormTitle: '编辑 Git 账户',
      editTokenHint: '留空表示保留当前访问令牌；填写则会替换本机保存的令牌。',
      saveChanges: '保存修改',
      confirmDeleteTitle: '删除账户',
      confirmDeleteDescription: '账户信息和访问令牌将从本机移除，此操作无法撤销。',
      confirmDeleteAction: '确认删除',
      editError: '保存账户修改失败，请重试。',
      deleteError: '删除账户失败，请重试。',
      loading: '正在读取本机账户…',
      unavailable: '无法读取本机账户配置。',
      readonly: '当前配置不可写，无法保存账户或切换选择。',
      configuredNote: '账户信息和当前选择保存在本机；访问令牌由凭据存储保管。',
      required: '请填写用户名和访问令牌。',
      duplicate: '该平台上的这个用户名已添加。',
      tokenSaveError: '访问令牌保存失败，请检查凭据存储是否可用。',
      accountSaveError: '账户信息保存失败，请重试。',
      selectionSaveError: '当前账户选择保存失败，请重试。',
      issues: 'Codeup 工作项',
      organization: '组织',
      project: '项目',
      allProjects: '全部项目',
      refresh: '刷新',
      refreshing: '正在刷新…',
      issuesLoading: '正在读取 Codeup 工作项…',
      issueCount: '个工作项',
      totalPrefix: '共',
      loadedCount: '已加载',
      countingTotal: '正在统计总数…',
      noIssues: '没有匹配的工作项',
      noIssuesDescription: '可以尝试切换范围、组织或项目。',
      selectIssuePrompt: '点击左侧任务查看详细描述',
      unsupportedIssues: '该平台尚未接入 Issue 获取',
      unsupportedDescription: '目前仅支持 Codeup（云效项目协作）的需求、任务和缺陷。',
      issueUnavailable: '当前连接不可用，无法读取工作项。',
      hostNotLoaded: '工作台的后台服务尚未加载。请重启 DSH 桌面版，然后刷新页面重试。',
      retry: '重试',
      truncated: '结果可能不完整：已达到单次查询的安全上限（分页或工作项数量过多）。请选择单个项目以缩小范围。',
      expand: '查看详情',
      collapse: '收起详情',
      detailLoading: '正在读取详情…',
      detailError: '详情读取失败。',
      description: '任务描述',
      noDescription: '暂无描述。',
      serialNumber: '编号',
      type: '类型',
      typeBug: '缺陷',
      typeTask: '任务',
      typeReq: '需求',
      status: '状态',
      assignedTo: '负责人',
      participants: '参与人',
      creator: '创建人',
      updatedAt: '更新时间',
      createdAt: '创建时间',
      labels: '标签',
      otherFields: '其他字段',
      openInCodeup: '在云效中打开',
      relationAssigned: '负责人',
      relationParticipant: '参与人',
      actionStart: '开始',
      actionContinue: '继续',
      copyCode: '复制代码',
      copied: '已复制',
      footnotes: '注释',
      noOrganizations: '这个账户没有可用的云效组织。',
      noProjects: '这个组织下没有可用项目。',
      loadMore: '加载更多',
      loadingMore: '正在加载更多工作项…',
      noMoreIssues: '已加载全部工作项',
      loadMoreError: '加载更多工作项失败。',
    }

    const en = {
      title: 'Git workbench',
      subtitle: 'Manage Git accounts and Codeup work items',
      back: 'Back to conversation',
      accountSelect: 'Select Git account',
      addAccount: 'Add Git account',
      manageAccounts: 'Manage accounts',
      accountListTitle: 'Manage Git accounts',
      accountListEmpty: 'No Git accounts configured yet.',
      currentAccount: 'Active',
      backToList: 'Back to list',
      close: 'Close',
      emptyTitle: 'No Git accounts yet',
      emptyDescription: 'Choose a Git hosting platform and configure an account. Account details and the current selection are stored only on this machine.',
      formTitle: 'Add Git account',
      platform: 'Hosting platform',
      username: 'Username',
      usernamePlaceholder: 'Enter the account username',
      token: 'Access token',
      tokenPlaceholder: 'Enter an access token',
      tokenHint: 'The token is written only to local credential storage, never to ordinary account configuration.',
      save: 'Save account',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      editFormTitle: 'Edit Git account',
      editTokenHint: 'Leave blank to keep the current access token; enter a new one to replace it.',
      saveChanges: 'Save changes',
      confirmDeleteTitle: 'Delete account',
      confirmDeleteDescription: 'The account and its locally stored access token will be removed. This cannot be undone.',
      confirmDeleteAction: 'Delete account',
      editError: 'The account changes could not be saved. Try again.',
      deleteError: 'The account could not be deleted. Try again.',
      loading: 'Reading local accounts…',
      unavailable: 'Local account configuration is unavailable.',
      readonly: 'The current configuration is read-only, so accounts and selection cannot be saved.',
      configuredNote: 'Account details and the current selection are stored locally; access tokens stay in credential storage.',
      required: 'Enter both a username and an access token.',
      duplicate: 'This username is already added for the selected platform.',
      tokenSaveError: 'The access token could not be saved. Check that credential storage is available.',
      accountSaveError: 'The account details could not be saved. Try again.',
      selectionSaveError: 'The current account selection could not be saved. Try again.',
      issues: 'Codeup work items',
      organization: 'Organization',
      project: 'Project',
      allProjects: 'All projects',
      refresh: 'Refresh',
      refreshing: 'Refreshing…',
      issuesLoading: 'Loading Codeup work items…',
      issueCount: 'work items',
      totalPrefix: 'Total',
      loadedCount: 'Loaded',
      countingTotal: 'Counting total…',
      noIssues: 'No matching work items',
      noIssuesDescription: 'Try another scope, organization, or project.',
      selectIssuePrompt: 'Select a work item on the left to view its description',
      unsupportedIssues: 'Issue loading is not connected for this platform',
      unsupportedDescription: 'Only Codeup (Yunxiao Projex) requirements, tasks, and bugs are supported now.',
      issueUnavailable: 'The current connection cannot load work items.',
      hostNotLoaded: 'The workbench background service is not loaded. Restart DSH Desktop, then refresh the page and retry.',
      retry: 'Retry',
      truncated: 'Results may be incomplete because a single query hit its safety cap (too many pages or work items). Select one project to narrow the scan.',
      expand: 'View details',
      collapse: 'Hide details',
      detailLoading: 'Loading details…',
      detailError: 'Could not load details.',
      description: 'Description',
      noDescription: 'No description.',
      serialNumber: 'Number',
      type: 'Type',
      typeBug: 'Bug',
      typeTask: 'Task',
      typeReq: 'Requirement',
      status: 'Status',
      assignedTo: 'Assignee',
      participants: 'Participants',
      creator: 'Creator',
      updatedAt: 'Updated',
      createdAt: 'Created',
      labels: 'Labels',
      otherFields: 'Other fields',
      openInCodeup: 'Open in Yunxiao',
      relationAssigned: 'Assigned',
      relationParticipant: 'Participating',
      actionStart: 'Start',
      actionContinue: 'Continue',
      copyCode: 'Copy code',
      copied: 'Copied',
      footnotes: 'Footnotes',
      noOrganizations: 'No Yunxiao organizations are available to this account.',
      noProjects: 'No projects are available in this organization.',
      loadMore: 'Load more',
      loadingMore: 'Loading more work items…',
      noMoreIssues: 'All work items loaded',
      loadMoreError: 'Could not load more work items.',
    }

    const PLATFORMS = [
      { id: 'github', name: 'GitHub' },
      { id: 'gitlab', name: 'GitLab' },
      { id: 'gitee', name: 'Gitee' },
      { id: 'codeup', name: 'Codeup' },
    ]

    function platformName(id) {
      return PLATFORMS.find(platform => platform.id === id)?.name ?? id
    }

    function tokenRef(id) {
      return `DSH_GIT_WORKBENCH_${id.replaceAll('-', '_').toUpperCase()}`
    }

    function BranchIcon({ size = 20 }) {
      return h('svg', {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round',
        strokeLinejoin: 'round', 'aria-hidden': true,
      },
      h('circle', { cx: 7, cy: 5, r: 2.2 }),
      h('circle', { cx: 7, cy: 19, r: 2.2 }),
      h('circle', { cx: 17, cy: 12, r: 2.2 }),
      h('path', { d: 'M7 7.2v9.6M17 9.8V8.5A2.5 2.5 0 0 0 14.5 6H12' }))
    }

    function PlusIcon() {
      return h('svg', {
        width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round',
        'aria-hidden': true,
      }, h('path', { d: 'M12 5v14M5 12h14' }))
    }

    function EditIcon({ size = 14 } = {}) {
      return h('svg', {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round',
        strokeLinejoin: 'round', 'aria-hidden': true,
      },
      h('path', { d: 'M12 20h9' }),
      h('path', { d: 'M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z' }))
    }

    function TrashIcon({ size = 14 } = {}) {
      return h('svg', {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round',
        strokeLinejoin: 'round', 'aria-hidden': true,
      },
      h('path', { d: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6' }),
      h('path', { d: 'M10 11v5M14 11v5' }))
    }

    function CloseIcon() {
      return h('svg', {
        width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round',
        'aria-hidden': true,
      }, h('path', { d: 'M3.5 3.5l9 9M12.5 3.5l-9 9' }))
    }

    function ChevronDownIcon({ open = false }) {
      return h('svg', {
        width: 12, height: 12, viewBox: '0 0 16 16', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round',
        strokeLinejoin: 'round', 'aria-hidden': true,
        className: `${CN}__selectChevron ${open ? 'is-open' : ''}`.trim(),
      }, h('path', { d: 'm4 6 4 4 4-4' }))
    }

    function ExternalIcon() {
      return h('svg', {
        width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round',
        strokeLinejoin: 'round', 'aria-hidden': true,
      },
      h('path', { d: 'M14 4h6v6M20 4l-9 9' }),
      h('path', { d: 'M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5' }))
    }

    function RefreshIcon() {
      return h('svg', {
        width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round',
        strokeLinejoin: 'round', 'aria-hidden': true,
      }, h('path', { d: 'M20 6v5h-5M4 18v-5h5M18.5 9A7 7 0 0 0 6 6.5L4 11M5.5 15A7 7 0 0 0 18 17.5l2-4.5' }))
    }

    function optionId(value) {
      if (value && typeof value === 'object') return String(value.id ?? value.value ?? '')
      return value === undefined || value === null ? '' : String(value)
    }

    /**
     * Native DSH dropdown backed by `@deepseek-ai/dsh-client-ui-primitives` Menu,
     * with a styled `<select>` fallback when primitives are unavailable.
     */
    function NativeSelect({
      id,
      value,
      options,
      onChange,
      disabled = false,
      ariaLabel,
      placeholder = '',
      className = '',
      align = 'start',
      anchorRef,
    }) {
      const [open, setOpen] = React.useState(false)
      const list = Array.isArray(options) ? options : []
      const selected = optionId(value)
      const current = list.find(item => optionId(item.value ?? item.id) === selected) || list[0]
      const displayLabel = current?.label ?? placeholder
      const isDisabled = disabled || list.length === 0

      if (DshMenu) {
        const menuItems = list.map(item => ({
          id: optionId(item.value ?? item.id),
          label: item.label,
        }))
        return h(DshMenu, {
          open: open && !isDisabled,
          onClose: () => setOpen(false),
          items: menuItems,
          selectedId: selected,
          onSelect: (picked) => {
            setOpen(false)
            if (isDisabled) return
            const next = optionId(picked)
            if (next !== selected) onChange(next)
          },
          align,
          portal: true,
          dense: true,
          listClassName: `${CN}__selectMenu`,
          anchor: h('button', {
            type: 'button',
            id,
            ref: anchorRef,
            role: 'combobox',
            className: `${CN}__selectTrigger ${open && !isDisabled ? 'is-open' : ''} ${className}`.trim(),
            disabled: isDisabled,
            'aria-haspopup': 'menu',
            'aria-expanded': open && !isDisabled,
            'aria-label': ariaLabel,
            title: displayLabel || ariaLabel || '',
            onClick: () => { if (!isDisabled) setOpen(prev => !prev) },
          },
          h('span', { className: `${CN}__selectLabel` }, displayLabel),
          h(ChevronDownIcon, { open: open && !isDisabled })),
        })
      }

      return h('select', {
        id,
        ref: anchorRef,
        className: `${CN}__selectFallback ${className}`.trim(),
        value: selected,
        disabled: isDisabled,
        'aria-label': ariaLabel,
        onChange: event => onChange(event.target.value),
      }, list.map(item => {
        const itemValue = optionId(item.value ?? item.id)
        return h('option', { key: itemValue, value: itemValue }, item.label)
      }))
    }

    /**
     * Pure Modal backed by DSH native `primitives.Modal`, with an accessible
     * dialog overlay fallback when primitives are unavailable.
     */
    function DialogModal({ open, title, closeLabel, onClose, footer, className = '', children }) {
      React.useEffect(() => {
        if (!open || DshModal || typeof window === 'undefined') return
        const onKeyDown = (event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            onClose()
          }
        }
        window.addEventListener('keydown', onKeyDown, true)
        return () => window.removeEventListener('keydown', onKeyDown, true)
      }, [open, onClose])

      if (!open) return null
      if (DshModal) {
        return h(DshModal, {
          open: true,
          className: `${CN}__modal ${className}`.trim(),
          title,
          closeLabel,
          onClose,
          footer,
        }, children)
      }
      return h('div', { className: `${CN}__modalBackdrop`, role: 'presentation', onClick: onClose },
        h('div', {
          className: `${CN}__modalDialog ${className}`.trim(),
          role: 'dialog',
          'aria-modal': true,
          'aria-label': typeof title === 'string' ? title : undefined,
          onClick: event => event.stopPropagation(),
        },
        h('div', { className: `${CN}__modalHeader` },
          h('h2', { className: `${CN}__modalTitle` }, title),
          h('button', {
            type: 'button',
            className: `${CN}__iconButton`,
            onClick: onClose,
            'aria-label': closeLabel,
            title: closeLabel,
          }, h(CloseIcon)),
        ),
        h('div', { className: `${CN}__modalBody` }, children),
        footer && h('div', { className: `${CN}__modalFooter` }, footer)),
      )
    }

    async function callRpc(rpc, endpoint, payload, signal) {
      let result
      try {
        result = await rpc.call(RPC_CHANNEL, endpoint, payload, signal)
      } catch (error) {
        // An unregistered Host channel falls through to the SPA fallback, which
        // rejects POST with 405. This means the Host still runs an older module
        // generation; surface an actionable hint instead of the raw transport text.
        const message = error instanceof Error ? error.message : String(error)
        if (/transport failure/i.test(message) && /HTTP\s+(404|405)\b/.test(message)) {
          const hint = new Error('host-not-loaded')
          hint.code = 'host-not-loaded'
          throw hint
        }
        throw error
      }
      if (!result?.ok) {
        const error = new Error(result?.error?.message || '')
        error.code = result?.error?.code || 'internal'
        throw error
      }
      return result.value
    }

    function formatDate(value) {
      if (!value) return '—'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return '—'
      return new Intl.DateTimeFormat(undefined, {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
      }).format(date)
    }

    function displayNames(value) {
      if (!Array.isArray(value) || value.length === 0) return '—'
      const names = value.map(item => typeof item === 'string' ? item : item?.name).filter(Boolean)
      return names.length > 0 ? names.join('、') : '—'
    }

    function displayFieldValue(field) {
      const values = Array.isArray(field?.values) ? field.values : []
      const result = values.map(item => typeof item === 'string'
        ? item
        : item?.displayValue ?? item?.identifier ?? '').filter(Boolean)
      return result.length > 0 ? result.join('、') : '—'
    }

    /**
     * Classify work item action and badge style strictly from Yunxiao's `statusStageId`:
     * - '1': not started / open -> 'start' button, neutral badge
     * - '2': in progress        -> 'continue' button, active (blue) badge
     * - '3': verifying / fixed  -> no button, verify (amber) badge
     * - '4': done / closed      -> no button, done (green) badge
     * - '5': canceled           -> no button, neutral badge
     */
    const WORKITEM_STAGE_META = {
      1: { action: 'start', badgeClass: '' },
      2: { action: 'continue', badgeClass: `${CN}__issueBadgeActive` },
      3: { action: null, badgeClass: `${CN}__issueBadgeVerify` },
      4: { action: null, badgeClass: `${CN}__issueBadgeDone` },
      5: { action: null, badgeClass: '' },
    }

    function workitemStageMeta(issue) {
      const stageId = String(issue?.statusStageId || '').trim()
      return Object.hasOwn(WORKITEM_STAGE_META, stageId)
        ? WORKITEM_STAGE_META[stageId]
        : { action: null, badgeClass: '' }
    }

    const YUNXIAO_CATEGORY_PATHS = {
      req: 'req',
      bug: 'bug',
      task: 'task',
      risk: 'risk',
      request: 'request',
      topic: 'topic',
    }

    function workitemCategoryKind(issue) {
      const category = String(issue?.categoryId || '').trim().toLowerCase()
      if (Object.hasOwn(YUNXIAO_CATEGORY_PATHS, category)) {
        return YUNXIAO_CATEGORY_PATHS[category]
      }
      const rawName = String(issue?.workitemType?.name || '').trim()
      const lowerName = rawName.toLowerCase()
      if (lowerName === 'bug' || lowerName === 'defect' || rawName.includes('缺陷')) return 'bug'
      if (lowerName === 'task' || rawName.includes('任务')) return 'task'
      if (lowerName === 'req' || lowerName === 'requirement' || rawName.includes('需求')) return 'req'
      return ''
    }

    function workitemTypeBadge(t, issue) {
      const kind = workitemCategoryKind(issue)
      const rawName = String(issue?.workitemType?.name || '').trim()
      const lowerName = rawName.toLowerCase()

      let label = rawName
      if ((!label || lowerName === 'bug' || lowerName === 'defect') && kind === 'bug') {
        label = t('typeBug')
      } else if ((!label || lowerName === 'task') && kind === 'task') {
        label = t('typeTask')
      } else if ((!label || lowerName === 'req' || lowerName === 'requirement') && kind === 'req') {
        label = t('typeReq')
      } else if (!label) {
        label = String(issue?.categoryId || '').trim()
      }
      if (!label) return null

      const className = kind === 'bug'
        ? `${CN}__issueBadgeTypeBug`
        : kind === 'task'
          ? `${CN}__issueBadgeTypeTask`
          : kind === 'req'
            ? `${CN}__issueBadgeTypeReq`
            : ''
      return { kind, label, className }
    }

    function looksLikeMarkdown(text) {
      if (typeof text !== 'string' || !text.trim()) return false
      return /(^|\n)\s*(#{1,6}\s+|[-*+]\s+|\d+\.\s+|>\s+|```|---+\s*$)/m.test(text)
        || /(\*\*[^*\n]+\*\*|`[^`\n]+`|\[[^\]]+\]\(https?:\/\/[^)]+\))/.test(text)
    }

    function isMarkdownDescription(detail) {
      const text = typeof detail?.description === 'string' ? detail.description : ''
      if (!text.trim()) return false
      const fmt = String(detail?.formatType || '').trim().toUpperCase()
      if (fmt === 'MARKDOWN') return true
      if (fmt === 'RICHTEXT' || fmt === 'HTML') return false
      return looksLikeMarkdown(text)
    }

    function safeHref(url) {
      try {
        const parsed = new URL(url)
        return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : ''
      } catch (_error) {
        return ''
      }
    }

    function renderInlineMarkdown(text, keyPrefix) {
      const nodes = []
      const tokenRe = /`([^`\n]+)`|\*\*([^*\n]+)\*\*|~~([^~\n]+)~~|\*([^*\n]+)\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
      let lastIndex = 0
      let match
      let idx = 0
      while ((match = tokenRe.exec(text)) !== null) {
        if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))
        const key = `${keyPrefix}-${idx++}`
        if (match[1] !== undefined) {
          nodes.push(h('code', { key }, match[1]))
        } else if (match[2] !== undefined) {
          nodes.push(h('strong', { key }, match[2]))
        } else if (match[3] !== undefined) {
          nodes.push(h('del', { key }, match[3]))
        } else if (match[4] !== undefined) {
          nodes.push(h('em', { key }, match[4]))
        } else if (match[5] !== undefined && match[6] !== undefined) {
          const href = safeHref(match[6])
          nodes.push(href
            ? h('a', { key, href, target: '_blank', rel: 'noopener noreferrer' }, match[5])
            : match[0])
        }
        lastIndex = tokenRe.lastIndex
      }
      if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
      return nodes.length > 0 ? nodes : text
    }

    /** Safe pure-React fallback Markdown renderer (zero dangerouslySetInnerHTML). */
    function SimpleMarkdown({ text }) {
      const lines = String(text || '').replace(/\r\n?/g, '\n').split('\n')
      const blocks = []
      let i = 0
      while (i < lines.length) {
        const line = lines[i]
        if (!line.trim()) { i += 1; continue }

        const fence = /^\s*```([^\s`]*)/.exec(line)
        if (fence) {
          const codeLines = []
          i += 1
          while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
            codeLines.push(lines[i])
            i += 1
          }
          if (i < lines.length) i += 1
          blocks.push(h('pre', { key: `pre-${blocks.length}` },
            h('code', null, codeLines.join('\n'))))
          continue
        }

        const heading = /^\s*(#{1,6})\s+(.+)$/.exec(line)
        if (heading) {
          const level = Math.min(6, Math.max(1, heading[1].length))
          blocks.push(h(`h${level}`, { key: `h-${blocks.length}` },
            renderInlineMarkdown(heading[2].trim(), `h-${blocks.length}`)))
          i += 1
          continue
        }

        if (/^\s*(?:---+|\*\*\*+|___+)\s*$/.test(line)) {
          blocks.push(h('hr', { key: `hr-${blocks.length}` }))
          i += 1
          continue
        }

        if (/^\s*>\s?/.test(line)) {
          const quoteLines = []
          while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
            quoteLines.push(lines[i].replace(/^\s*>\s?/, ''))
            i += 1
          }
          blocks.push(h('blockquote', { key: `q-${blocks.length}` },
            quoteLines.map((qLine, qIdx) =>
              h('p', { key: `qp-${qIdx}` }, renderInlineMarkdown(qLine, `q-${blocks.length}-${qIdx}`)))))
          continue
        }

        if (/^\s*[-*+]\s+/.test(line)) {
          const items = []
          while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
            items.push(lines[i].replace(/^\s*[-*+]\s+/, ''))
            i += 1
          }
          blocks.push(h('ul', { key: `ul-${blocks.length}` },
            items.map((itemText, itemIdx) =>
              h('li', { key: `uli-${itemIdx}` }, renderInlineMarkdown(itemText, `ul-${blocks.length}-${itemIdx}`)))))
          continue
        }

        if (/^\s*\d+\.\s+/.test(line)) {
          const items = []
          while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
            items.push(lines[i].replace(/^\s*\d+\.\s+/, ''))
            i += 1
          }
          blocks.push(h('ol', { key: `ol-${blocks.length}` },
            items.map((itemText, itemIdx) =>
              h('li', { key: `oli-${itemIdx}` }, renderInlineMarkdown(itemText, `ol-${blocks.length}-${itemIdx}`)))))
          continue
        }

        const paraLines = []
        while (
          i < lines.length
          && lines[i].trim()
          && !/^\s*(```|#{1,6}\s+|[-*+]\s+|\d+\.\s+|>\s?|(?:---+|\*\*\*+|___+)\s*$)/.test(lines[i])
        ) {
          paraLines.push(lines[i])
          i += 1
        }
        blocks.push(h('p', { key: `p-${blocks.length}` },
          renderInlineMarkdown(paraLines.join('\n'), `p-${blocks.length}`)))
      }
      return h('div', { className: `${CN}__markdown` }, blocks)
    }

    function MarkdownDescription({ t, detail }) {
      const text = typeof detail?.description === 'string' ? detail.description : ''
      if (!text.trim()) {
        return h('div', { className: `${CN}__description ${CN}__descriptionEmpty` }, t('noDescription'))
      }
      if (isMarkdownDescription(detail)) {
        if (DshMarkdownText) {
          return h('div', { className: `${CN}__description ${CN}__descriptionMarkdown` },
            h(DshMarkdownText, {
              text,
              streaming: false,
              labels: {
                code: { copyLabel: t('copyCode'), copiedLabel: t('copied') },
                footnotes: t('footnotes'),
              },
            }))
        }
        return h('div', { className: `${CN}__description ${CN}__descriptionMarkdown` },
          h(SimpleMarkdown, { text }))
      }
      return h('div', { className: `${CN}__description` }, text)
    }

    /**
     * Yunxiao's workitem API does not return a Web URL. Projex workitems resolve
     * at `/projex/project/<projectId>/<category>/<workitemId>`, where `<category>`
     * is an allowlisted lowercase workitem category (`req`, `bug`, `task`, ...).
     * Every dynamic segment is encoded and only the fixed official host is used.
     */
    function codeupWebUrl(spaceId, category, issueId) {
      const space = String(spaceId || '').trim()
      const type = String(category || '').trim().toLowerCase()
      const id = String(issueId || '').trim()
      if (!space || !id || !Object.hasOwn(YUNXIAO_CATEGORY_PATHS, type)) return ''
      return `https://devops.aliyun.com/projex/project/${encodeURIComponent(space)}/${YUNXIAO_CATEGORY_PATHS[type]}/${encodeURIComponent(id)}`
    }

    function DetailRow({ label, value }) {
      return h('div', { className: `${CN}__detailRow` },
        h('dt', null, label),
        h('dd', null, value || '—'),
      )
    }

    function IssueDetailPane({ t, rpc, accountId, organizationId, issue }) {
      const [state, setState] = React.useState({ status: 'loading', detail: null, error: '' })
      const issueId = issue?.id || ''

      React.useEffect(() => {
        if (!issueId) {
          setState({ status: 'idle', detail: null, error: '' })
          return
        }
        const controller = new AbortController()
        setState({ status: 'loading', detail: null, error: '' })
        void callRpc(rpc, 'detail', {
          accountId, organizationId, issueId,
        }, controller.signal).then(detail => {
          setState({ status: 'ready', detail, error: '' })
        }).catch(error => {
          if (controller.signal.aborted) return
          const message = error?.code === 'host-not-loaded'
            ? t('hostNotLoaded')
            : `${t('detailError')} ${error.message || ''}`.trim()
          setState({ status: 'error', detail: null, error: message })
        })
        return () => { controller.abort() }
      }, [rpc, accountId, organizationId, issueId, t])

      if (!issue) {
        return h('div', { className: `${CN}__detailEmpty` }, t('selectIssuePrompt'))
      }

      const detail = state.detail || issue
      const statusName = detail.status?.name || detail.status?.displayName || detail.statusName || '—'
      const statusClass = workitemStageMeta({ statusStageId: detail.statusStageId || issue.statusStageId }).badgeClass
      const relations = Array.isArray(issue.relations) ? issue.relations : []
      const typeBadge = workitemTypeBadge(t, detail) || workitemTypeBadge(t, issue)
      const fields = state.detail?.customFieldValues ?? []
      const categoryPath = workitemCategoryKind(detail) || workitemCategoryKind(issue)
      const webUrl = codeupWebUrl(detail.space?.id || issue.space?.id, categoryPath, detail.id || issue.id)

      return h('div', { className: `${CN}__detailScroll` },
        h('div', { className: `${CN}__detailHeader` },
          h('div', { className: `${CN}__detailHeaderMeta` },
            h('span', { className: `${CN}__issueSerial` }, detail.serialNumber || issue.serialNumber || issue.id),
            typeBadge && h('span', { className: `${CN}__issueBadge ${typeBadge.className}`.trim() }, typeBadge.label),
            h('span', { className: `${CN}__issueBadge ${statusClass}`.trim() }, statusName),
            relations.includes('assigned') && h('span', { className: `${CN}__issueBadge ${CN}__issueBadgeRelation` }, t('relationAssigned')),
            relations.includes('participant') && h('span', { className: `${CN}__issueBadge ${CN}__issueBadgeRelation` }, t('relationParticipant')),
          ),
          webUrl && h('a', {
            className: `${CN}__openLink`, href: webUrl, target: '_blank',
            rel: 'noopener noreferrer',
          }, t('openInCodeup'), h(ExternalIcon)),
        ),
        h('h3', { className: `${CN}__detailTitle` }, detail.title || detail.subject || issue.title || issue.id),
        state.status === 'loading' && h('p', { className: `${CN}__status`, role: 'status' }, t('detailLoading')),
        state.status === 'error' && h('p', { className: `${CN}__error`, role: 'alert' }, state.error),
        state.status === 'ready' && h('div', { className: `${CN}__detailBody` },
          h('dl', { className: `${CN}__detailGrid` },
            h(DetailRow, { label: t('project'), value: detail.space?.name || issue.space?.name }),
            h(DetailRow, { label: t('type'), value: detail.workitemType?.name || detail.categoryId }),
            h(DetailRow, { label: t('status'), value: statusName }),
            h(DetailRow, { label: t('assignedTo'), value: detail.assignedTo?.name }),
            h(DetailRow, { label: t('participants'), value: displayNames(detail.participants) }),
            h(DetailRow, { label: t('creator'), value: detail.creator?.name }),
            h(DetailRow, { label: t('createdAt'), value: formatDate(detail.gmtCreate) }),
            h(DetailRow, { label: t('updatedAt'), value: formatDate(detail.gmtModified) }),
          ),
          h('section', { className: `${CN}__descriptionSection`, 'aria-label': t('description') },
            h('h4', null, t('description')),
            h(MarkdownDescription, { t, detail }),
          ),
          fields.length > 0 && h('section', { className: `${CN}__customFields`, 'aria-label': t('otherFields') },
            h('h4', null, t('otherFields')),
            h('dl', { className: `${CN}__detailGrid` }, fields.map((field, index) =>
              h(DetailRow, {
                key: field.id || field.fieldId || `${field.name || field.fieldName}-${index}`,
                label: field.name || field.fieldName || field.id || field.fieldId,
                value: displayFieldValue(field),
              }))),
          ),
        ),
      )
    }

    function IssueListItem({ t, issue, selected, onSelect }) {
      const statusName = issue.status?.name || issue.status?.displayName || issue.statusName || '—'
      const relations = Array.isArray(issue.relations) ? issue.relations : []
      const typeBadge = workitemTypeBadge(t, issue)
      const { action: actionKind, badgeClass: statusClass } = workitemStageMeta(issue)

      return h('div', {
        role: 'button',
        tabIndex: 0,
        className: `${CN}__issueItem ${selected ? 'is-selected' : ''}`.trim(),
        'aria-current': selected ? 'true' : undefined,
        onClick: onSelect,
        onKeyDown: (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onSelect()
          }
        },
      },
      h('div', { className: `${CN}__issueTopRow` },
        h('div', { className: `${CN}__issueTitle`, title: issue.title || issue.subject || issue.id },
          issue.title || issue.subject || issue.id),
        h('span', { className: `${CN}__issueSerial` }, issue.serialNumber || issue.id),
      ),
      h('div', { className: `${CN}__issueBottomRow` },
        h('div', { className: `${CN}__issueInfoCol` },
          h('div', { className: `${CN}__issueBadges` },
            typeBadge && h('span', {
              className: `${CN}__issueBadge ${typeBadge.className}`.trim(),
              'data-workitem-kind': typeBadge.kind || undefined,
            }, typeBadge.label),
            h('span', { className: `${CN}__issueBadge ${statusClass}`.trim() }, statusName),
            relations.includes('assigned') && h('span', { className: `${CN}__issueBadge ${CN}__issueBadgeRelation` }, t('relationAssigned')),
            relations.includes('participant') && h('span', { className: `${CN}__issueBadge ${CN}__issueBadgeRelation` }, t('relationParticipant')),
          ),
          h('div', { className: `${CN}__issueMeta` },
            h('span', null, issue.project?.name || issue.space?.name || '—'),
            h('span', null, formatDate(issue.gmtModified)),
          ),
        ),
        actionKind && h('button', {
          type: 'button',
          className: `${CN}__taskActionBtn ${actionKind === 'start' ? `${CN}__taskActionStart` : `${CN}__taskActionContinue`}`,
          'data-action': actionKind,
          onClick: (event) => {
            event.stopPropagation()
            onSelect()
          },
        }, actionKind === 'start' ? t('actionStart') : t('actionContinue')),
      ))
    }

    const WORKITEM_PAGE_SIZE = 20

    function mergeIssueItems(existingItems, incomingItems) {
      const byId = new Map()
      for (const item of existingItems) {
        if (item?.id) byId.set(item.id, item)
      }
      for (const item of incomingItems) {
        if (!item?.id) continue
        const previous = byId.get(item.id)
        if (!previous) {
          byId.set(item.id, item)
        } else {
          const relations = [...new Set([...(previous.relations ?? []), ...(item.relations ?? [])])]
            .sort((a, b) => (a === 'assigned' ? -1 : 1) - (b === 'assigned' ? -1 : 1))
          byId.set(item.id, { ...previous, ...item, relations })
        }
      }
      return [...byId.values()]
    }

    function formatTotalSummary(t, { loadedCount, hasMore, totalCount, countStatus, countTruncated }) {
      const plus = countTruncated ? '+' : ''
      if (typeof totalCount === 'number' && Number.isFinite(totalCount)) {
        const displayTotal = Math.max(totalCount, loadedCount)
        if (hasMore && loadedCount < displayTotal) {
          return `${t('totalPrefix')} ${displayTotal}${plus} ${t('issueCount')}（${t('loadedCount')} ${loadedCount}）`
        }
        return `${t('totalPrefix')} ${displayTotal}${plus} ${t('issueCount')}`
      }
      if (!hasMore) {
        return `${t('totalPrefix')} ${loadedCount} ${t('issueCount')}`
      }
      if (countStatus === 'loading') {
        return `${t('loadedCount')} ${loadedCount} ${t('issueCount')} · ${t('countingTotal')}`
      }
      return `${t('loadedCount')} ${loadedCount}+ ${t('issueCount')}`
    }

    function IssueWorkbench({ t, rpc, account, accountTools }) {
      const [organizationId, setOrganizationId] = React.useState('')
      const [projectId, setProjectId] = React.useState('all')
      const [reload, setReload] = React.useState(0)
      const [selectedIssueId, setSelectedIssueId] = React.useState(null)
      const [state, setState] = React.useState({
        status: 'loading',
        data: null,
        error: '',
        loadingMore: false,
        loadMoreError: '',
      })
      const [countState, setCountState] = React.useState({
        status: 'idle',
        total: null,
        truncated: false,
      })
      const sentinelRef = React.useRef(null)
      const loadMoreControllerRef = React.useRef(null)
      const countControllerRef = React.useRef(null)
      const loadingMoreRef = React.useRef(false)
      const queryKeyRef = React.useRef('')
      const canLoad = account.platform === 'codeup' && Boolean(rpc)

      React.useEffect(() => {
        if (!canLoad) return
        const queryKey = `${account.id}\0${organizationId}\0${projectId}\0${reload}`
        queryKeyRef.current = queryKey
        loadMoreControllerRef.current?.abort()
        loadMoreControllerRef.current = null
        countControllerRef.current?.abort()
        countControllerRef.current = null
        loadingMoreRef.current = false
        const controller = new AbortController()
        setSelectedIssueId(null)
        setCountState({ status: 'idle', total: null, truncated: false })
        setState(previous => ({
          status: 'loading',
          data: previous.data,
          error: '',
          loadingMore: false,
          loadMoreError: '',
        }))
        void callRpc(rpc, 'load', {
          accountId: account.id,
          organizationId,
          projectId,
          pageSize: WORKITEM_PAGE_SIZE,
        }, controller.signal).then(data => {
          if (controller.signal.aborted || queryKeyRef.current !== queryKey) return
          const loadedItems = data?.items ?? []
          const firstId = loadedItems[0]?.id ?? null
          setSelectedIssueId(firstId)
          setState({ status: 'ready', data, error: '', loadingMore: false, loadMoreError: '' })

          const hasMore = Boolean(data?.hasMore && data?.nextCursor)
          if (typeof data?.totalCount === 'number') {
            setCountState({ status: 'ready', total: data.totalCount, truncated: Boolean(data?.truncated) })
          } else if (!hasMore) {
            setCountState({ status: 'ready', total: loadedItems.length, truncated: Boolean(data?.truncated) })
          } else {
            const countController = new AbortController()
            countControllerRef.current = countController
            setCountState({ status: 'loading', total: null, truncated: false })
            void callRpc(rpc, 'count', {
              accountId: account.id,
              organizationId: organizationId || data?.selectedOrganizationId || '',
              projectId: projectId || data?.selectedProjectId || 'all',
              scope: 'all',
            }, countController.signal).then(countData => {
              if (countController.signal.aborted || queryKeyRef.current !== queryKey) return
              setCountState({
                status: 'ready',
                total: typeof countData?.total === 'number' ? countData.total : null,
                truncated: Boolean(countData?.truncated),
              })
            }).catch(() => {
              if (countController.signal.aborted || queryKeyRef.current !== queryKey) return
              setCountState({ status: 'error', total: null, truncated: false })
            })
          }
        }).catch(error => {
          if (controller.signal.aborted || queryKeyRef.current !== queryKey) return
          const message = error?.code === 'host-not-loaded'
            ? t('hostNotLoaded')
            : (error.message || t('issueUnavailable'))
          setState(previous => ({
            status: 'error',
            data: previous.data,
            error: message,
            loadingMore: false,
            loadMoreError: '',
          }))
        })
        return () => {
          controller.abort()
          loadMoreControllerRef.current?.abort()
          loadMoreControllerRef.current = null
          countControllerRef.current?.abort()
          countControllerRef.current = null
          loadingMoreRef.current = false
        }
      }, [rpc, account.id, account.platform, canLoad, organizationId, projectId, reload, t])

      const data = state.data
      const loading = state.status === 'loading'
      const loadingMore = Boolean(state.loadingMore)
      const loadMoreError = state.loadMoreError || ''
      const organizations = data?.organizations ?? []
      const projects = data?.projects ?? []
      const items = data?.items ?? []
      const hasMore = Boolean(data?.hasMore && data?.nextCursor)
      const selectedOrganizationId = organizationId || data?.selectedOrganizationId || ''
      const selectedProjectId = projectId || data?.selectedProjectId || 'all'
      const activeIssue = items.find(item => item.id === selectedIssueId) ?? items[0] ?? null
      const effectiveTotalCount = !hasMore
        ? items.length
        : (countState.total !== null
            ? countState.total
            : (typeof data?.totalCount === 'number' ? data.totalCount : null))

      const loadMore = React.useCallback(() => {
        if (!canLoad || state.status !== 'ready' || loadingMoreRef.current) return
        const cursor = state.data?.nextCursor
        if (!state.data?.hasMore || !cursor) return
        const queryKey = queryKeyRef.current
        loadingMoreRef.current = true
        loadMoreControllerRef.current?.abort()
        const controller = new AbortController()
        loadMoreControllerRef.current = controller
        setState(previous => ({ ...previous, loadingMore: true, loadMoreError: '' }))
        void callRpc(rpc, 'load', {
          accountId: account.id,
          organizationId: selectedOrganizationId,
          projectId: selectedProjectId,
          pageSize: WORKITEM_PAGE_SIZE,
          cursor,
        }, controller.signal).then(nextData => {
          if (controller.signal.aborted || queryKeyRef.current !== queryKey) return
          loadingMoreRef.current = false
          if (loadMoreControllerRef.current === controller) loadMoreControllerRef.current = null
          const nextHasMore = Boolean(nextData?.hasMore && nextData?.nextCursor)
          setState(previous => {
            const prevData = previous.data || {}
            const mergedItems = mergeIssueItems(prevData.items ?? [], nextData?.items ?? [])
            return {
              ...previous,
              loadingMore: false,
              loadMoreError: '',
              data: {
                ...prevData,
                ...nextData,
                organizations: nextData?.organizations?.length ? nextData.organizations : (prevData.organizations ?? []),
                projects: nextData?.projects?.length ? nextData.projects : (prevData.projects ?? []),
                items: mergedItems,
                totalCount: !nextHasMore ? mergedItems.length : (prevData.totalCount ?? null),
                hasMore: nextHasMore,
                nextCursor: nextData?.nextCursor ?? null,
                truncated: Boolean(prevData.truncated || nextData?.truncated),
                stats: {
                  ...(prevData.stats ?? {}),
                  ...(nextData?.stats ?? {}),
                  projectsTotal: Math.max(prevData.stats?.projectsTotal ?? 0, nextData?.stats?.projectsTotal ?? 0),
                  pagesFetched: (prevData.stats?.pagesFetched ?? 0) + (nextData?.stats?.pagesFetched ?? 0),
                  itemsScanned: (prevData.stats?.itemsScanned ?? 0) + (nextData?.stats?.itemsScanned ?? 0),
                  itemsReturned: mergedItems.length,
                },
              },
            }
          })
        }).catch(error => {
          if (controller.signal.aborted || queryKeyRef.current !== queryKey) return
          loadingMoreRef.current = false
          if (loadMoreControllerRef.current === controller) loadMoreControllerRef.current = null
          const message = error?.code === 'host-not-loaded'
            ? t('hostNotLoaded')
            : (error.message || t('loadMoreError'))
          setState(previous => ({ ...previous, loadingMore: false, loadMoreError: message }))
        })
      }, [canLoad, state.status, state.data, rpc, account.id, selectedOrganizationId, selectedProjectId, t])

      React.useEffect(() => {
        if (!hasMore || loading || loadingMore || loadMoreError) return
        const sentinel = sentinelRef.current
        if (!sentinel) return
        const scrollRoot = sentinel.closest?.(`.${CN}__listScroll`)
          ?? sentinel.closest?.(`.${CN}__page`)
          ?? null
        const useScrollRoot = Boolean(scrollRoot && scrollRoot.scrollHeight > scrollRoot.clientHeight)
        const checkPosition = () => {
          if (loadingMoreRef.current) return
          const rect = sentinel.getBoundingClientRect()
          const activeScrollRoot = scrollRoot && scrollRoot.scrollHeight > scrollRoot.clientHeight ? scrollRoot : null
          const viewportBottom = activeScrollRoot
            ? activeScrollRoot.getBoundingClientRect().bottom
            : (typeof window !== 'undefined' ? window.innerHeight : 0)
          if (rect.top <= viewportBottom + 160) {
            loadMore()
          }
        }

        let observer = null
        if (typeof IntersectionObserver === 'function') {
          observer = new IntersectionObserver((entries) => {
            if (entries.some(entry => entry.isIntersecting)) {
              loadMore()
            }
          }, {
            root: useScrollRoot ? scrollRoot : null,
            rootMargin: '160px 0px',
          })
          observer.observe(sentinel)
        }

        scrollRoot?.addEventListener('scroll', checkPosition, { passive: true })
        if (typeof window !== 'undefined') {
          window.addEventListener('scroll', checkPosition, { passive: true })
        }
        return () => {
          observer?.disconnect()
          scrollRoot?.removeEventListener('scroll', checkPosition)
          if (typeof window !== 'undefined') {
            window.removeEventListener('scroll', checkPosition)
          }
        }
      }, [hasMore, loading, loadingMore, loadMoreError, loadMore])

      if (account.platform !== 'codeup') {
        return h('section', { className: `${CN}__issues` },
          accountTools && h('div', { className: `${CN}__issueToolbar` },
            h('div', { className: `${CN}__issueToolbarLeft` }, accountTools),
          ),
          h('div', { className: `${CN}__issueUnsupported` },
            h('h2', null, t('unsupportedIssues')),
            h('p', null, t('unsupportedDescription')),
          ),
        )
      }
      if (!rpc) {
        return h('section', { className: `${CN}__issues` },
          accountTools && h('div', { className: `${CN}__issueToolbar` },
            h('div', { className: `${CN}__issueToolbarLeft` }, accountTools),
          ),
          h('p', { className: `${CN}__error`, role: 'alert' }, t('issueUnavailable')),
        )
      }

      const orgOptions = organizations.map(item => ({ value: item.id, label: item.name }))
      const projectOptions = [
        { value: 'all', label: t('allProjects') },
        ...projects.map(item => ({ value: item.id, label: item.name })),
      ]
      const summaryText = formatTotalSummary(t, {
        loadedCount: items.length,
        hasMore,
        totalCount: effectiveTotalCount,
        countStatus: countState.status,
        countTruncated: countState.truncated || Boolean(data?.truncated),
      })

      return h('section', { className: `${CN}__issues`, 'aria-label': t('issues'), 'aria-busy': loading || loadingMore },
        h('div', { className: `${CN}__issueToolbar` },
          h('div', { className: `${CN}__issueToolbarLeft` }, accountTools),
          h('div', { className: `${CN}__issueToolbarRight` },
            data && h(NativeSelect, {
              className: `${CN}__filterSelect`,
              value: selectedOrganizationId,
              options: orgOptions,
              disabled: loading || orgOptions.length === 0,
              ariaLabel: t('organization'),
              placeholder: t('organization'),
              onChange: nextOrg => { setOrganizationId(nextOrg); setProjectId('all') },
            }),
            data && h(NativeSelect, {
              className: `${CN}__filterSelect`,
              value: selectedProjectId,
              options: projectOptions,
              disabled: loading || projects.length === 0,
              ariaLabel: t('project'),
              placeholder: t('allProjects'),
              onChange: nextProject => setProjectId(nextProject),
            }),
            h('button', {
              type: 'button', className: `${CN}__button`, disabled: loading,
              onClick: () => setReload(value => value + 1),
            }, h(RefreshIcon), loading ? t('refreshing') : t('refresh')),
          ),
        ),
        loading && h('p', { className: `${CN}__status`, role: 'status' }, t('issuesLoading')),
        state.status === 'error' && h('div', { className: `${CN}__issueError`, role: 'alert' },
          h('p', { className: `${CN}__error` }, state.error),
          h('button', { type: 'button', className: `${CN}__button`, onClick: () => setReload(value => value + 1) }, t('retry')),
        ),
        data && !loading && organizations.length === 0 && h('p', { className: `${CN}__status` }, t('noOrganizations')),
        data && !loading && organizations.length > 0 && projects.length === 0 && h('p', { className: `${CN}__status` }, t('noProjects')),
        (data?.truncated || countState.truncated) && h('p', { className: `${CN}__warning`, role: 'status' }, t('truncated')),
        data && !loading && items.length === 0 && organizations.length > 0 && projects.length > 0 && h('div', { className: `${CN}__issueEmpty` },
          h('h3', null, t('noIssues')),
          h('p', null, t('noIssuesDescription')),
        ),
        items.length > 0 && h('div', { className: `${CN}__split` },
          h('div', { className: `${CN}__listPane` },
            h('div', { className: `${CN}__listHeader` },
              h('span', { className: `${CN}__issueSummary` }, summaryText),
            ),
            h('div', { className: `${CN}__listScroll` },
              items.map(issue =>
                h(IssueListItem, {
                  key: issue.id,
                  t,
                  issue,
                  selected: activeIssue?.id === issue.id,
                  onSelect: () => setSelectedIssueId(issue.id),
                })),
              !loading && hasMore && h('div', {
                ref: sentinelRef, className: `${CN}__loadMoreSentinel`, 'aria-hidden': true,
              }),
              !loading && loadingMore && h('p', {
                className: `${CN}__status ${CN}__loadMoreStatus`, role: 'status',
              }, t('loadingMore')),
              !loading && !loadingMore && loadMoreError && h('div', {
                className: `${CN}__issueError ${CN}__loadMoreError`, role: 'alert',
              },
              h('p', { className: `${CN}__error` }, loadMoreError),
              h('button', { type: 'button', className: `${CN}__button`, onClick: loadMore }, t('retry'))),
              !loading && !loadingMore && !loadMoreError && hasMore && h('div', {
                className: `${CN}__loadMoreRow`,
              }, h('button', { type: 'button', className: `${CN}__button`, onClick: loadMore }, t('loadMore'))),
              !loading && !loadingMore && !loadMoreError && !hasMore && h('p', {
                className: `${CN}__loadMoreEnd`,
              }, t('noMoreIssues')),
            ),
          ),
          h('div', { className: `${CN}__detailPane` },
            h(IssueDetailPane, {
              t,
              rpc,
              accountId: account.id,
              organizationId: activeIssue?.organizationId || data?.selectedOrganizationId || selectedOrganizationId,
              issue: activeIssue,
            }),
          ),
        ),
      )
    }

    function AccountFormFields({
      t, formId, busy, error, mode, platform, setPlatform,
      username, setUsername, token, setToken, onSubmit,
    }) {
      const editing = mode === 'edit'
      const platformOptions = PLATFORMS.map(item => ({ value: item.id, label: item.name }))
      return h('form', {
        id: formId,
        className: `${CN}__modalForm`,
        onSubmit,
        'aria-label': editing ? t('editFormTitle') : t('formTitle'),
      },
      error && h('p', { className: `${CN}__error`, role: 'alert' }, t(error)),
      h('fieldset', { className: `${CN}__fields`, disabled: busy },
        h('div', { className: `${CN}__field` },
          h('label', { htmlFor: `${formId}-platform` }, t('platform')),
          h(NativeSelect, {
            id: `${formId}-platform`,
            className: `${CN}__formSelect`,
            value: platform,
            options: platformOptions,
            disabled: busy,
            ariaLabel: t('platform'),
            onChange: setPlatform,
          }),
        ),
        h('div', { className: `${CN}__field` },
          h('label', { htmlFor: `${formId}-username` }, t('username')),
          h('input', {
            id: `${formId}-username`, type: 'text', value: username, required: true,
            maxLength: 100, autoComplete: 'off', placeholder: t('usernamePlaceholder'),
            onChange: event => setUsername(event.target.value),
          }),
        ),
        h('div', { className: `${CN}__field` },
          h('label', { htmlFor: `${formId}-token` }, t('token')),
          h('input', {
            id: `${formId}-token`, type: 'password', value: token, required: !editing,
            maxLength: 4096, autoComplete: 'off', spellCheck: false,
            placeholder: t('tokenPlaceholder'), onChange: event => setToken(event.target.value),
          }),
          h('p', { className: `${CN}__hint` }, editing ? t('editTokenHint') : t('tokenHint')),
        ),
      ))
    }

    function AccountListContent({
      t, accounts, selectedId, deletingId, busy, canWrite, error,
      onEdit, onRequestDelete, onCancelDelete, onConfirmDelete,
    }) {
      return h('div', { className: `${CN}__accountListWrap` },
        error && h('p', { className: `${CN}__error`, role: 'alert' }, t(error)),
        accounts.length === 0
          ? h('p', { className: `${CN}__status` }, t('accountListEmpty'))
          : h('ul', { className: `${CN}__accountList` }, accounts.map(account => {
              const isCurrent = account.id === selectedId
              const isConfirming = deletingId === account.id
              return h('li', { key: account.id, className: `${CN}__accountRow` },
                h('div', { className: `${CN}__accountRowMain` },
                  h('div', { className: `${CN}__accountRowInfo` },
                    h('span', { className: `${CN}__platformTag` }, platformName(account.platform)),
                    h('span', { className: `${CN}__accountRowName` }, account.username),
                    isCurrent && h('span', { className: `${CN}__currentTag` }, t('currentAccount')),
                  ),
                  !isConfirming && h('div', { className: `${CN}__accountRowActions` },
                    h('button', {
                      type: 'button',
                      className: `${CN}__button ${CN}__buttonSm`,
                      disabled: busy || !canWrite,
                      onClick: () => onEdit(account),
                    }, h(EditIcon), t('edit')),
                    h('button', {
                      type: 'button',
                      className: `${CN}__button ${CN}__buttonSm ${CN}__buttonDangerGhost`,
                      disabled: busy || !canWrite,
                      onClick: () => onRequestDelete(account.id),
                    }, h(TrashIcon), t('delete')),
                  ),
                ),
                isConfirming && h('div', {
                  className: `${CN}__rowConfirm`,
                  role: 'alertdialog',
                  'aria-label': t('confirmDeleteTitle'),
                },
                h('div', { className: `${CN}__confirmText` },
                  h('strong', null, `${t('confirmDeleteTitle')}：${platformName(account.platform)} · ${account.username}`),
                  h('p', null, t('confirmDeleteDescription'))),
                h('div', { className: `${CN}__formActions` },
                  h('button', {
                    type: 'button', className: `${CN}__button ${CN}__buttonSm`, disabled: busy,
                    onClick: onCancelDelete,
                  }, t('cancel')),
                  h('button', {
                    type: 'button', className: `${CN}__button ${CN}__buttonSm ${CN}__buttonDanger`, disabled: busy,
                    onClick: () => onConfirmDelete(account),
                  }, t('confirmDeleteAction')))),
              )
            })),
      )
    }

    function GitWorkbenchPage({ t, form, credentials, rpc }) {
      const subscribe = React.useCallback(listener => form.subscribe(listener), [form])
      const getSnapshot = React.useCallback(() => form.getSnapshot(), [form])
      const snapshot = React.useSyncExternalStore(subscribe, getSnapshot)
      const accounts = snapshot.value?.accounts ?? []
      const selected = accounts.find(account => account.id === snapshot.value?.selectedAccountId) ?? accounts[0]
      // modal: { kind: 'closed' | 'add' | 'list' | 'edit', accountId?: string, returnToList?: boolean }
      const [modal, setModal] = React.useState({ kind: 'closed', accountId: '', returnToList: false })
      const [deletingId, setDeletingId] = React.useState('')
      const [platform, setPlatform] = React.useState('github')
      const [username, setUsername] = React.useState('')
      const [token, setToken] = React.useState('')
      const [busy, setBusy] = React.useState(false)
      const [selectionBusy, setSelectionBusy] = React.useState(false)
      const [error, setError] = React.useState('')
      const formId = React.useId()
      const canWrite = snapshot.status === 'ready' && snapshot.writable
      const editingAccount = modal.kind === 'edit'
        ? accounts.find(item => item.id === modal.accountId) ?? null
        : null

      const resetFields = () => {
        setToken('')
        setUsername('')
        setPlatform('github')
      }
      const closeModal = () => {
        if (busy) return
        setModal({ kind: 'closed', accountId: '', returnToList: false })
        setDeletingId('')
        setError('')
        resetFields()
      }
      const openAddModal = (returnToList = false) => {
        setError('')
        setDeletingId('')
        resetFields()
        setModal({ kind: 'add', accountId: '', returnToList })
      }
      const openListModal = () => {
        setError('')
        setDeletingId('')
        resetFields()
        setModal({ kind: 'list', accountId: '', returnToList: false })
      }
      const openEditAccount = (account) => {
        if (!account) return
        setError('')
        setDeletingId('')
        setPlatform(account.platform)
        setUsername(account.username)
        setToken('')
        setModal({ kind: 'edit', accountId: account.id, returnToList: true })
      }
      const backToAccountList = () => {
        if (busy) return
        setError('')
        setDeletingId('')
        resetFields()
        setModal({ kind: 'list', accountId: '', returnToList: false })
      }

      const submitAccountForm = (event) => {
        event.preventDefault()
        if (busy) return
        const isEditing = modal.kind === 'edit' && Boolean(editingAccount)
        const cleanUsername = username.trim()
        const cleanToken = token.trim()
        if (!cleanUsername || (!isEditing && !cleanToken)) {
          setError('required')
          return
        }
        const existing = form.getSnapshot().value?.accounts ?? []
        if (existing.some(item => item.id !== editingAccount?.id
          && item.platform === platform
          && item.username.toLowerCase() === cleanUsername.toLowerCase())) {
          setError('duplicate')
          return
        }
        setBusy(true)
        setError('')

        if (isEditing) {
          const target = editingAccount
          void (async () => {
            try {
              const latest = form.getSnapshot()
              const current = latest.value?.accounts ?? []
              const accepted = await form.mutate([
                { op: 'set', path: ['accounts'], value: current.map(item => item.id === target.id
                  ? { ...item, platform, username: cleanUsername }
                  : item) },
              ], latest.revision)
              if (!accepted) {
                setError('editError')
                return
              }
              if (cleanToken) {
                try {
                  const stored = await credentials.set(tokenRef(target.id), cleanToken)
                  if (!stored.ok) {
                    setError('tokenSaveError')
                    return
                  }
                } catch (_error) {
                  setError('tokenSaveError')
                  return
                }
              }
              resetFields()
              setModal({ kind: 'list', accountId: '', returnToList: false })
            } catch (_error) {
              setError('editError')
            } finally {
              setBusy(false)
            }
          })()
          return
        }

        const accountId = globalThis.crypto.randomUUID()
        const ref = tokenRef(accountId)
        const returnToList = Boolean(modal.returnToList)
        let credentialAttempted = false
        let tokenStored = false
        let completed = false
        void (async () => {
          try {
            credentialAttempted = true
            const stored = await credentials.set(ref, cleanToken)
            if (!stored.ok) {
              setError('tokenSaveError')
              return
            }
            tokenStored = true
            const latest = form.getSnapshot()
            const current = latest.value?.accounts ?? []
            const newAccount = { id: accountId, platform, username: cleanUsername }
            const accepted = await form.mutate([
              { op: 'set', path: ['accounts'], value: [...current, newAccount] },
              { op: 'set', path: ['selectedAccountId'], value: accountId },
            ], latest.revision)
            if (!accepted) {
              setError('accountSaveError')
              return
            }
            completed = true
            resetFields()
            setModal(returnToList
              ? { kind: 'list', accountId: '', returnToList: false }
              : { kind: 'closed', accountId: '', returnToList: false })
          } catch (_error) {
            setError(tokenStored ? 'accountSaveError' : 'tokenSaveError')
          } finally {
            if (!completed && credentialAttempted) {
              try { await credentials.unset(ref) } catch (_error) { /* Best-effort rollback. */ }
            }
            setBusy(false)
          }
        })()
      }

      const confirmDeleteAccount = (target) => {
        if (!target || busy) return
        setBusy(true)
        setError('')
        void (async () => {
          try {
            const latest = form.getSnapshot()
            const current = latest.value?.accounts ?? []
            const remaining = current.filter(item => item.id !== target.id)
            const nextSelected = latest.value?.selectedAccountId === target.id
              ? (remaining[0]?.id ?? '')
              : (latest.value?.selectedAccountId ?? '')
            const accepted = await form.mutate([
              { op: 'set', path: ['accounts'], value: remaining },
              { op: 'set', path: ['selectedAccountId'], value: nextSelected },
            ], latest.revision)
            if (!accepted) {
              setError('deleteError')
              return
            }
            try { await credentials.unset(tokenRef(target.id)) } catch (_error) { /* Best effort. */ }
            setDeletingId('')
          } catch (_error) {
            setError('deleteError')
          } finally {
            setBusy(false)
          }
        })()
      }

      const selectAccount = (accountId) => {
        if (selectionBusy || accountId === selected?.id) return
        setSelectionBusy(true)
        setError('')
        void (async () => {
          try {
            if (!await form.set('selectedAccountId', accountId)) setError('selectionSaveError')
          } catch (_error) {
            setError('selectionSaveError')
          } finally {
            setSelectionBusy(false)
          }
        })()
      }

      const accountOptions = accounts.map(account => ({
        value: account.id,
        label: `${platformName(account.platform)} · ${account.username}`,
      }))

      const accountTools = accounts.length > 0 && h('div', { className: `${CN}__accountTools` },
        h(NativeSelect, {
          className: `${CN}__accountSelect`,
          value: selected?.id ?? '',
          options: accountOptions,
          disabled: busy || selectionBusy || !canWrite,
          ariaLabel: t('accountSelect'),
          onChange: selectAccount,
        }),
        h('button', {
          type: 'button', className: `${CN}__button`,
          disabled: busy || selectionBusy || !canWrite,
          onClick: openListModal,
          'aria-label': t('manageAccounts'),
        }, h(EditIcon), t('manageAccounts')),
      )

      const header = h('header', { className: `${CN}__header` },
        h('div', { className: `${CN}__heading` },
          h('h1', null, t('title')),
          h('p', null, t('subtitle')),
        ),
      )

      const isModalOpen = modal.kind !== 'closed'
      const modalTitle = modal.kind === 'add'
        ? t('formTitle')
        : modal.kind === 'edit'
          ? t('editFormTitle')
          : t('accountListTitle')

      const modalFooter = modal.kind === 'list'
        ? [
            h('button', {
              key: 'add', type: 'button', className: `${CN}__button`,
              disabled: busy || !canWrite, onClick: () => openAddModal(true),
            }, h(PlusIcon), t('addAccount')),
            h('button', {
              key: 'close', type: 'button', className: `${CN}__button ${CN}__buttonPrimary`,
              disabled: busy, onClick: closeModal,
            }, t('close')),
          ]
        : [
            h('button', {
              key: 'cancel', type: 'button', className: `${CN}__button`, disabled: busy,
              onClick: modal.returnToList ? backToAccountList : closeModal,
            }, modal.returnToList ? t('backToList') : t('cancel')),
            h('button', {
              key: 'submit', type: 'submit', form: formId,
              className: `${CN}__button ${CN}__buttonPrimary`, disabled: busy,
            }, modal.kind === 'edit' ? t('saveChanges') : t('save')),
          ]

      return h('section', { className: `${CN}__page`, 'aria-label': t('title') },
        h('style', null, CSS),
        h('div', { className: `${CN}__content` },
          header,
          snapshot.status === 'loading' && h('p', { className: `${CN}__status`, role: 'status' }, t('loading')),
          snapshot.status === 'unavailable' && h('p', { className: `${CN}__status`, role: 'alert' }, t('unavailable')),
          snapshot.status === 'ready' && !snapshot.writable
            && h('p', { className: `${CN}__status`, role: 'note' }, t('readonly')),
          error && !isModalOpen && h('p', { className: `${CN}__error`, role: 'alert' }, t(error)),
          snapshot.status === 'ready' && accounts.length === 0 && h('div', { className: `${CN}__empty` },
            h('div', { className: `${CN}__emptyIcon` }, h(BranchIcon, { size: 30 })),
            h('h2', null, t('emptyTitle')),
            h('p', null, t('emptyDescription')),
            h('button', {
              type: 'button', className: `${CN}__button ${CN}__buttonPrimary`,
              disabled: busy || !canWrite,
              onClick: openListModal,
              'aria-label': t('manageAccounts'),
            }, h(EditIcon), t('manageAccounts')),
          ),
          snapshot.status === 'ready' && selected
            && h(IssueWorkbench, { key: selected.id, t, rpc, account: selected, accountTools }),
        ),
        h(DialogModal, {
          open: isModalOpen,
          title: modalTitle,
          closeLabel: t('close'),
          onClose: closeModal,
          footer: modalFooter,
        },
        modal.kind === 'list'
          ? h(AccountListContent, {
              t,
              accounts,
              selectedId: selected?.id ?? '',
              deletingId,
              busy,
              canWrite,
              error,
              onEdit: openEditAccount,
              onRequestDelete: (id) => { setError(''); setDeletingId(id) },
              onCancelDelete: () => { setError(''); setDeletingId('') },
              onConfirmDelete: confirmDeleteAccount,
            })
          : h(AccountFormFields, {
              t,
              formId,
              busy,
              error,
              mode: modal.kind === 'edit' ? 'edit' : 'add',
              platform,
              setPlatform,
              username,
              setUsername,
              token,
              setToken,
              onSubmit: submitAccountForm,
            })),
      )
    }

    const CSS = `
.${CN}__page{box-sizing:border-box;width:100%;height:100%;display:flex;flex-direction:column;overflow:hidden;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:14px;line-height:1.5}
.${CN}__content{box-sizing:border-box;width:100%;max-width:1320px;flex:1;min-height:0;margin:0 auto;padding:24px clamp(24px,3.5vw,40px) 20px;display:flex;flex-direction:column}
.${CN}__header{flex:none;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 16px;margin-bottom:16px}
.${CN}__heading{min-width:0}
.${CN}__heading h1{margin:0;font-size:24px;line-height:32px;font-weight:600;letter-spacing:-.4px}
.${CN}__heading p{margin:4px 0 0;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px}
.${CN}__accountTools{display:flex;align-items:center;gap:8px;min-width:0;flex-wrap:wrap}
.${CN}__selectTrigger{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:space-between;gap:8px;height:32px;max-width:100%;padding:0 10px 0 12px;border:0.5px solid var(--dsw-alias-border-l2,var(--dsw-alias-border-l3));border-radius:8px;background:var(--dsw-alias-bg-layer-1,var(--dsw-alias-bg-base));color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;cursor:pointer;transition:background-color .15s ease,border-color .15s ease}
.${CN}__selectTrigger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);border-color:var(--dsw-alias-border-l3)}
.${CN}__selectTrigger.is-open{border-color:var(--dsw-alias-state-business-primary)}
.${CN}__selectTrigger:disabled{opacity:.5;cursor:not-allowed}
.${CN}__selectLabel{min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}
.${CN}__selectChevron{flex:none;color:var(--dsw-alias-label-tertiary);transition:transform .15s ease}
.${CN}__selectChevron.is-open{transform:rotate(180deg)}
.${CN}__selectMenu{max-height:320px;overflow-y:auto}
.${CN}__selectFallback{box-sizing:border-box;height:32px;padding:0 26px 0 10px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:8px;background:var(--dsw-alias-bg-layer-1,var(--dsw-alias-bg-base));color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;cursor:pointer}
.${CN}__selectFallback:disabled{opacity:.5;cursor:not-allowed}
.${CN}__accountSelect{min-width:140px;max-width:240px}
.${CN}__filterSelect{min-width:140px;max-width:220px}
.${CN}__formSelect{width:100%;height:36px}
.${CN}__iconButton{display:inline-flex;align-items:center;justify-content:center;flex:none;width:28px;height:28px;padding:0;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}
.${CN}__iconButton:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.${CN}__button{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:6px;height:32px;padding:0 12px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:8px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;white-space:nowrap;cursor:pointer;transition:background-color .15s ease,border-color .15s ease}
.${CN}__button:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.${CN}__buttonSm{height:28px;padding:0 10px;font-size:12px}
.${CN}__buttonPrimary{border-color:var(--dsw-alias-state-business-primary);background:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-label-primary-foreground)}
.${CN}__buttonPrimary:hover:not(:disabled){opacity:.92;background:var(--dsw-alias-state-business-primary)}
.${CN}__buttonDanger{border-color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-label-primary-foreground)}
.${CN}__buttonDanger:hover:not(:disabled){opacity:.92;background:var(--dsw-alias-state-error-primary)}
.${CN}__buttonDangerGhost{color:var(--dsw-alias-state-error-primary)}
.${CN}__buttonDangerGhost:hover:not(:disabled){border-color:var(--dsw-alias-state-error-primary)}
.${CN}__button:disabled{opacity:.5;cursor:not-allowed}
.${CN}__status{margin:0 0 12px;color:var(--dsw-alias-label-secondary);font-size:13px}
.${CN}__error{box-sizing:border-box;margin:0 0 12px;padding:8px 12px;border-left:2px solid var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary);font-size:13px}
.${CN}__warning{box-sizing:border-box;margin:0 0 12px;padding:8px 12px;border-left:2px solid var(--dsw-alias-state-warn-primary);color:var(--dsw-alias-state-warn-primary);font-size:12px}
.${CN}__empty{display:flex;flex-direction:column;align-items:center;box-sizing:border-box;margin-top:32px;padding:48px 24px;border:1px dashed var(--dsw-alias-border-l3);border-radius:16px;text-align:center}
.${CN}__emptyIcon{display:flex;align-items:center;justify-content:center;width:52px;height:52px;margin-bottom:14px;color:var(--dsw-alias-state-business-primary)}
.${CN}__empty h2{margin:0;font-size:16px;line-height:24px;font-weight:500}
.${CN}__empty p{max-width:480px;margin:8px 0 20px;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px}
.${CN}__issues{box-sizing:border-box;flex:1;min-height:0;display:flex;flex-direction:column}
.${CN}__issueToolbar{flex:none;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 12px;margin-bottom:12px}
.${CN}__issueToolbarLeft{display:flex;flex-wrap:wrap;align-items:center;gap:8px;min-width:0}
.${CN}__issueToolbarRight{display:flex;flex-wrap:wrap;align-items:center;gap:8px;min-width:0}
.${CN}__split{flex:1;min-height:0;display:grid;grid-template-columns:minmax(310px,375px) minmax(0,1fr);gap:14px}
.${CN}__listPane,.${CN}__detailPane{min-height:0;display:flex;flex-direction:column;border:0.5px solid var(--dsw-alias-border-l3);border-radius:12px;background:var(--dsw-alias-bg-layer-1);overflow:hidden}
.${CN}__listHeader{flex:none;display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:0.5px solid var(--dsw-alias-border-l2,var(--dsw-alias-border-l3));background:var(--dsw-alias-bg-layer-1)}
.${CN}__issueSummary{color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:500}
.${CN}__listScroll{flex:1;min-height:0;overflow-y:auto;padding:8px;display:flex;flex-direction:column;gap:6px}
.${CN}__issueItem{box-sizing:border-box;padding:10px 12px;border:0.5px solid var(--dsw-alias-border-l2,var(--dsw-alias-border-l3));border-radius:10px;background:var(--dsw-alias-bg-base);cursor:pointer;transition:background-color .15s ease,border-color .15s ease}
.${CN}__issueItem:hover{background:var(--dsw-alias-interactive-bg-hover)}
.${CN}__issueItem.is-selected{border-color:var(--dsw-alias-state-business-primary);background:var(--dsw-alias-interactive-bg-hover)}
.${CN}__issueTopRow{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}
.${CN}__issueTitle{flex:1;min-width:0;color:var(--dsw-alias-label-primary);font-size:13px;line-height:19px;font-weight:500;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}
.${CN}__issueSerial{flex:none;color:var(--dsw-alias-label-tertiary,var(--dsw-alias-label-secondary));font-size:11px;line-height:19px;font-variant-numeric:tabular-nums}
.${CN}__issueBottomRow{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;margin-top:8px}
.${CN}__issueInfoCol{min-width:0;flex:1;display:flex;flex-direction:column;gap:5px}
.${CN}__issueBadges{display:flex;flex-wrap:wrap;gap:5px}
.${CN}__issueBadge{display:inline-flex;align-items:center;min-height:18px;padding:0 6px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:999px;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px}
.${CN}__issueBadgeDone{border-color:var(--dsw-alias-state-success-primary);color:var(--dsw-alias-state-success-primary)}
.${CN}__issueBadgeActive{border-color:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-state-business-primary)}
.${CN}__issueBadgeVerify{border-color:var(--dsw-alias-state-warn-primary);color:var(--dsw-alias-state-warn-primary)}
.${CN}__issueBadgeRelation{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}
.${CN}__issueBadgeTypeBug{border-color:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary)}
.${CN}__issueBadgeTypeTask{border-color:var(--dsw-alias-border-l3);color:var(--dsw-alias-label-primary)}
.${CN}__issueBadgeTypeReq{border-color:var(--dsw-alias-state-warn-primary);color:var(--dsw-alias-state-warn-primary)}
.${CN}__issueMeta{display:flex;flex-wrap:wrap;gap:2px 8px;color:var(--dsw-alias-label-tertiary,var(--dsw-alias-label-secondary));font-size:11px;line-height:16px}
.${CN}__taskActionBtn{flex:none;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;height:24px;padding:0 10px;border-radius:6px;font:inherit;font-size:12px;font-weight:500;line-height:1;cursor:pointer;white-space:nowrap;transition:opacity .15s ease,background-color .15s ease}
.${CN}__taskActionStart{border:0.5px solid var(--dsw-alias-state-business-primary);background:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-label-primary-foreground)}
.${CN}__taskActionStart:hover{opacity:.9}
.${CN}__taskActionContinue{border:0.5px solid var(--dsw-alias-state-business-primary);background:transparent;color:var(--dsw-alias-state-business-primary)}
.${CN}__taskActionContinue:hover{background:var(--dsw-alias-interactive-bg-hover)}
.${CN}__detailScroll{flex:1;min-height:0;overflow-y:auto;padding:18px 22px}
.${CN}__detailEmpty{flex:1;display:flex;align-items:center;justify-content:center;padding:32px;color:var(--dsw-alias-label-tertiary,var(--dsw-alias-label-secondary));font-size:13px}
.${CN}__detailHeader{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 12px;margin-bottom:8px}
.${CN}__detailHeaderMeta{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.${CN}__detailTitle{margin:0 0 14px;color:var(--dsw-alias-label-primary);font-size:17px;line-height:24px;font-weight:600;overflow-wrap:anywhere}
.${CN}__openLink{display:inline-flex;align-items:center;gap:5px;color:var(--dsw-alias-brand-primary);font-size:12px;text-decoration:none}
.${CN}__openLink:hover{text-decoration:underline}
.${CN}__detailGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px 16px;margin:0 0 16px;padding:12px 14px;border-radius:10px;background:var(--dsw-alias-bg-base);border:0.5px solid var(--dsw-alias-border-l2,var(--dsw-alias-border-l3))}
.${CN}__detailRow{min-width:0}
.${CN}__detailRow dt{color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px}
.${CN}__detailRow dd{margin:2px 0 0;color:var(--dsw-alias-label-primary);font-size:13px;line-height:19px;overflow-wrap:anywhere}
.${CN}__descriptionSection h4,.${CN}__customFields h4{margin:16px 0 8px;color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px;font-weight:600}
.${CN}__description{box-sizing:border-box;padding:14px 16px;border-radius:10px;border:0.5px solid var(--dsw-alias-border-l2,var(--dsw-alias-border-l3));background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.65;font-size:13px}
.${CN}__descriptionEmpty{color:var(--dsw-alias-label-tertiary,var(--dsw-alias-label-secondary))}
.${CN}__descriptionMarkdown{white-space:normal}
.${CN}__markdown h1,.${CN}__markdown h2,.${CN}__markdown h3,.${CN}__markdown h4{margin:12px 0 6px;font-weight:600;line-height:1.4}
.${CN}__markdown h1{font-size:17px}.${CN}__markdown h2{font-size:15px}.${CN}__markdown h3{font-size:14px}
.${CN}__markdown p{margin:0 0 8px}.${CN}__markdown p:last-child{margin-bottom:0}
.${CN}__markdown ul,.${CN}__markdown ol{margin:0 0 8px;padding-left:20px}
.${CN}__markdown li{margin:2px 0}
.${CN}__markdown blockquote{margin:8px 0;padding:4px 12px;border-left:3px solid var(--dsw-alias-border-l3);color:var(--dsw-alias-label-secondary)}
.${CN}__markdown pre{margin:8px 0;padding:10px 12px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);overflow-x:auto;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:12px;line-height:1.5}
.${CN}__markdown code{padding:1px 4px;border-radius:4px;background:var(--dsw-alias-bg-layer-2);font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:12px}
.${CN}__markdown pre code{padding:0;background:transparent}
.${CN}__markdown a{color:var(--dsw-alias-brand-primary);text-decoration:none}
.${CN}__markdown a:hover{text-decoration:underline}
.${CN}__markdown hr{margin:12px 0;border:0;border-top:0.5px solid var(--dsw-alias-border-l3)}
.${CN}__issueEmpty,.${CN}__issueUnsupported{box-sizing:border-box;margin-top:24px;padding:32px 24px;border:0.5px dashed var(--dsw-alias-border-l3);border-radius:12px;text-align:center}
.${CN}__issueEmpty h3,.${CN}__issueUnsupported h2{margin:0;color:var(--dsw-alias-label-primary);font-size:14px;line-height:22px;font-weight:500}
.${CN}__issueEmpty p,.${CN}__issueUnsupported p{margin:6px 0 0;color:var(--dsw-alias-label-secondary);font-size:13px}
.${CN}__issueError{margin-bottom:12px}
.${CN}__loadMoreSentinel{height:1px}
.${CN}__loadMoreStatus{margin:10px 0 4px;text-align:center;font-size:12px}
.${CN}__loadMoreRow{display:flex;justify-content:center;margin:8px 0 4px}
.${CN}__loadMoreEnd{margin:10px 0 4px;color:var(--dsw-alias-label-tertiary);font-size:12px;text-align:center}
.${CN}__loadMoreError{margin-top:8px}
.${CN}__modalBackdrop{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.45)}
.${CN}__modalDialog{box-sizing:border-box;width:min(520px,100%);max-height:85vh;display:flex;flex-direction:column;border:0.5px solid var(--dsw-alias-border-l3);border-radius:14px;background:var(--dsw-alias-bg-base);box-shadow:0 16px 40px rgba(0,0,0,.22);overflow:hidden}
.${CN}__modalHeader{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:0.5px solid var(--dsw-alias-border-l2,var(--dsw-alias-border-l3))}
.${CN}__modalTitle{margin:0;font-size:16px;line-height:24px;font-weight:600}
.${CN}__modalBody{padding:18px 20px;overflow-y:auto}
.${CN}__modalFooter{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:0.5px solid var(--dsw-alias-border-l2,var(--dsw-alias-border-l3))}
.${CN}__modalForm{min-width:0}
.${CN}__fields{display:grid;gap:16px;min-width:0;margin:0;padding:0;border:0}
.${CN}__field{display:grid;gap:6px;min-width:0}
.${CN}__field label{font-size:13px;font-weight:500}
.${CN}__field input{box-sizing:border-box;width:100%;height:36px;padding:0 11px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:8px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px}
.${CN}__field input::placeholder{color:var(--dsw-alias-label-caption)}
.${CN}__hint{margin:0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.${CN}__accountListWrap{min-width:0}
.${CN}__accountList{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.${CN}__accountRow{padding:10px 12px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:10px;background:var(--dsw-alias-bg-layer-1)}
.${CN}__accountRowMain{display:flex;align-items:center;justify-content:space-between;gap:12px}
.${CN}__accountRowInfo{display:flex;align-items:center;gap:8px;min-width:0;flex:1}
.${CN}__platformTag{flex:none;display:inline-flex;align-items:center;height:20px;padding:0 7px;border-radius:6px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:500}
.${CN}__accountRowName{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500}
.${CN}__currentTag{flex:none;display:inline-flex;align-items:center;height:18px;padding:0 6px;border-radius:999px;border:0.5px solid var(--dsw-alias-state-business-primary);color:var(--dsw-alias-state-business-primary);font-size:11px}
.${CN}__accountRowActions{flex:none;display:flex;align-items:center;gap:6px}
.${CN}__rowConfirm{margin-top:10px;padding:10px 12px;border-radius:8px;border:0.5px solid var(--dsw-alias-state-error-primary);background:var(--dsw-alias-bg-base);display:flex;flex-direction:column;gap:10px}
.${CN}__confirmText strong{color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px;font-weight:500;overflow-wrap:anywhere}
.${CN}__confirmText p{margin:2px 0 0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.${CN}__formActions{display:flex;justify-content:flex-end;gap:8px}
.${CN}__selectTrigger:focus-visible,.${CN}__selectFallback:focus-visible,.${CN}__field input:focus-visible,.${CN}__issueItem:focus-visible,.${CN}__taskActionBtn:focus-visible,.${CN}__button:focus-visible,.${CN}__iconButton:focus-visible,.${CN}__openLink:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
@media(max-width:860px){.${CN}__page{overflow:auto}.${CN}__content{padding:20px 16px 32px;flex:none}.${CN}__split{grid-template-columns:1fr;flex:none}.${CN}__listPane{max-height:420px}.${CN}__detailPane{min-height:320px}.${CN}__accountTools{width:100%}.${CN}__accountSelect{flex:1;max-width:none}}
@media(pointer:coarse){.${CN}__field input{font-size:16px}}
`

    return {
      inject: ['slots', 'layout', 'locale', 'configForms', 'remote', 'remote.credentials', 'connection'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'git-workbench: dictionaries')
        const t = ctx.locale.bind(NS)
        const form = ctx.configForms.get(ENTRY_ID)
        const credentials = ctx.remote.credentials
        const rpc = ctx.connection?.rpc ?? null

        ctx.slots.inject('main', () => {
          const dispose = ctx.slots.register({
            name: 'main', key: PANEL_ID, locale: NS,
            inject: () => ({ form, credentials, rpc, onClose: () => { ctx.layout.selectPanel(null) } }),
          }, GitWorkbenchPage)
          return () => {
            dispose()
            // Never reset a panel another plugin selected during teardown.
            if (ctx.layout.panelInfo.getSnapshot().activePanelId === PANEL_ID) ctx.layout.selectPanel(null)
          }
        })

        // The sidebar owns the button, selected state and click navigation. Its
        // id matches the main key, so the entry opens exactly the page above.
        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist', id: PANEL_ID, order: 20, locale: NS,
          label: () => t('title'),
        }, BranchIcon))
      },
    }
  },
})
