window.__ModuleLoader__.load({
  id: 'dsh-dev-dashboard',
  factory(require) {
    const React = require('react')
    const h = React.createElement

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
      add: '新增',
      addAccount: '新增 Git 账户',
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
      scopeAll: '我负责或参与',
      organization: '组织',
      project: '项目',
      allProjects: '全部项目',
      refresh: '刷新',
      refreshing: '正在刷新…',
      issuesLoading: '正在读取 Codeup 工作项…',
      issueCount: '个工作项',
      noIssues: '没有匹配的工作项',
      noIssuesDescription: '可以尝试切换范围、组织或项目。',
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
      description: '描述',
      noDescription: '没有描述。',
      serialNumber: '编号',
      type: '类型',
      status: '状态',
      assignedTo: '负责人',
      participants: '参与人',
      creator: '创建人',
      updatedAt: '更新时间',
      createdAt: '创建时间',
      labels: '标签',
      otherFields: '其他字段',
      openInCodeup: '在云效中打开',
      relationAssigned: '负责',
      relationParticipant: '参与',
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
      add: 'Add',
      addAccount: 'Add Git account',
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
      scopeAll: 'Assigned or participating',
      organization: 'Organization',
      project: 'Project',
      allProjects: 'All projects',
      refresh: 'Refresh',
      refreshing: 'Refreshing…',
      issuesLoading: 'Loading Codeup work items…',
      issueCount: 'work items',
      noIssues: 'No matching work items',
      noIssuesDescription: 'Try another scope, organization, or project.',
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

    function BackIcon() {
      return h('svg', {
        width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round',
        strokeLinejoin: 'round', 'aria-hidden': true,
      }, h('path', { d: 'm14.5 5-7 7 7 7' }))
    }

    function PlusIcon() {
      return h('svg', {
        width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round',
        'aria-hidden': true,
      }, h('path', { d: 'M12 5v14M5 12h14' }))
    }

    function EditIcon() {
      return h('svg', {
        width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round',
        strokeLinejoin: 'round', 'aria-hidden': true,
      },
      h('path', { d: 'M12 20h9' }),
      h('path', { d: 'M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z' }))
    }

    function TrashIcon() {
      return h('svg', {
        width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round',
        strokeLinejoin: 'round', 'aria-hidden': true,
      },
      h('path', { d: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6' }),
      h('path', { d: 'M10 11v5M14 11v5' }))
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
     * Yunxiao's workitem API does not return a Web URL. This pattern is the
     * observed Projex workitem deep link, not an API-guaranteed field; every
     * segment is encoded and only the fixed official host is used.
     */
    function codeupWebUrl(organizationId, spaceId, issueId) {
      const org = String(organizationId || '').trim()
      const space = String(spaceId || '').trim()
      const id = String(issueId || '').trim()
      if (!org || !space || !id) return ''
      return `https://devops.aliyun.com/projExcellence/${encodeURIComponent(org)}/${encodeURIComponent(space)}`
        + `?workItemFilter=all&workItemId=${encodeURIComponent(id)}`
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
        width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round',
        strokeLinejoin: 'round', 'aria-hidden': true,
      }, h('path', { d: 'M20 6v5h-5M4 18v-5h5M18.5 9A7 7 0 0 0 6 6.5L4 11M5.5 15A7 7 0 0 0 18 17.5l2-4.5' }))
    }

    function DetailRow({ label, value }) {
      return h('div', { className: `${CN}__detailRow` },
        h('dt', null, label),
        h('dd', null, value || '—'),
      )
    }

    function IssueDetail({ t, rpc, accountId, organizationId, issue, id }) {
      const [state, setState] = React.useState({ status: 'loading', detail: null, error: '' })
      React.useEffect(() => {
        const controller = new AbortController()
        setState({ status: 'loading', detail: null, error: '' })
        void callRpc(rpc, 'detail', {
          accountId, organizationId, issueId: issue.id,
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
      }, [rpc, accountId, organizationId, issue.id, t])

      if (state.status === 'loading') {
        return h('div', { id, className: `${CN}__issueDetail`, role: 'status' }, t('detailLoading'))
      }
      if (state.status === 'error') {
        return h('div', { id, className: `${CN}__issueDetail`, role: 'alert' },
          h('p', { className: `${CN}__error` }, state.error))
      }
      const detail = state.detail || {}
      const fields = detail.customFieldValues ?? []
      const webUrl = codeupWebUrl(organizationId, detail.space?.id || issue.space?.id, issue.id)
      return h('div', { id, className: `${CN}__issueDetail` },
        webUrl && h('a', {
          className: `${CN}__openLink`, href: webUrl, target: '_blank',
          rel: 'noopener noreferrer',
        }, t('openInCodeup'), h(ExternalIcon)),
        h('dl', { className: `${CN}__detailGrid` },
          h(DetailRow, { label: t('serialNumber'), value: detail.serialNumber }),
          h(DetailRow, { label: t('type'), value: detail.workitemType?.name || detail.categoryId }),
          h(DetailRow, { label: t('status'), value: detail.status?.name || detail.status?.displayName || detail.statusName }),
          h(DetailRow, { label: t('assignedTo'), value: detail.assignedTo?.name }),
          h(DetailRow, { label: t('participants'), value: displayNames(detail.participants) }),
          h(DetailRow, { label: t('creator'), value: detail.creator?.name }),
          h(DetailRow, { label: t('createdAt'), value: formatDate(detail.gmtCreate) }),
          h(DetailRow, { label: t('updatedAt'), value: formatDate(detail.gmtModified) }),
        ),
        h('section', { className: `${CN}__descriptionSection`, 'aria-label': t('description') },
          h('h3', null, t('description')),
          h('div', { className: `${CN}__description` }, detail.description || t('noDescription')),
        ),
        fields.length > 0 && h('section', { className: `${CN}__customFields`, 'aria-label': t('otherFields') },
          h('h3', null, t('otherFields')),
          h('dl', { className: `${CN}__detailGrid` }, fields.map((field, index) =>
            h(DetailRow, {
              key: field.id || field.fieldId || `${field.name || field.fieldName}-${index}`,
              label: field.name || field.fieldName || field.id || field.fieldId,
              value: displayFieldValue(field),
            }))),
        ),
      )
    }

    function IssueCard({ t, rpc, accountId, organizationId, issue, expanded, onToggle }) {
      const detailId = `${CN}-detail-${issue.id}`
      const statusName = issue.status?.name || issue.status?.displayName || issue.statusName || '—'
      const done = String(issue.statusStageId || '') === '4'
      const relations = Array.isArray(issue.relations) ? issue.relations : []
      return h('article', { className: `${CN}__issueCard` },
        h('button', {
          type: 'button', className: `${CN}__issueButton`, onClick: onToggle,
          'aria-expanded': expanded, 'aria-controls': detailId,
          'aria-label': `${expanded ? t('collapse') : t('expand')}：${issue.title}`,
        },
        h('div', { className: `${CN}__issueTitleRow` },
          h('div', { className: `${CN}__issueTitleBlock` },
            h('div', { className: `${CN}__issueTitle` }, issue.title || issue.subject || issue.id),
            h('div', { className: `${CN}__issueBadges` },
              h('span', { className: `${CN}__issueBadge ${done ? `${CN}__issueBadgeDone` : ''}` }, statusName),
              relations.includes('assigned') && h('span', { className: `${CN}__issueBadge ${CN}__issueBadgeRelation` }, t('relationAssigned')),
              relations.includes('participant') && h('span', { className: `${CN}__issueBadge ${CN}__issueBadgeRelation` }, t('relationParticipant')),
            ),
          ),
          h('span', { className: `${CN}__issueSerial` }, issue.serialNumber || issue.id),
        ),
        h('div', { className: `${CN}__issueMeta` },
          h('span', null, issue.project?.name || issue.space?.name || '—'),
          h('span', null, `${t('type')}：${issue.workitemType?.name || issue.categoryId || '—'}`),
          h('span', null, `${t('assignedTo')}：${issue.assignedTo?.name || '—'}`),
          h('span', null, `${t('updatedAt')}：${formatDate(issue.gmtModified)}`),
        )),
        expanded && h(IssueDetail, { t, rpc, accountId, organizationId, issue, id: detailId }),
      )
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

    function IssueWorkbench({ t, rpc, account }) {
      const [organizationId, setOrganizationId] = React.useState('')
      const [projectId, setProjectId] = React.useState('all')
      const [reload, setReload] = React.useState(0)
      const [expandedId, setExpandedId] = React.useState(null)
      const [state, setState] = React.useState({
        status: 'loading',
        data: null,
        error: '',
        loadingMore: false,
        loadMoreError: '',
      })
      const sentinelRef = React.useRef(null)
      const loadMoreControllerRef = React.useRef(null)
      const loadingMoreRef = React.useRef(false)
      const queryKeyRef = React.useRef('')
      const canLoad = account.platform === 'codeup' && Boolean(rpc)

      React.useEffect(() => {
        if (!canLoad) return
        const queryKey = `${account.id}\0${organizationId}\0${projectId}\0${reload}`
        queryKeyRef.current = queryKey
        loadMoreControllerRef.current?.abort()
        loadMoreControllerRef.current = null
        loadingMoreRef.current = false
        const controller = new AbortController()
        setExpandedId(null)
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
          setState({ status: 'ready', data, error: '', loadingMore: false, loadMoreError: '' })
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
                hasMore: Boolean(nextData?.hasMore && nextData?.nextCursor),
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
        const pageRoot = sentinel.closest?.(`.${CN}__page`) ?? null
        const usePageRoot = Boolean(pageRoot && pageRoot.scrollHeight > pageRoot.clientHeight)
        const checkPosition = () => {
          if (loadingMoreRef.current) return
          const rect = sentinel.getBoundingClientRect()
          const activePageRoot = pageRoot && pageRoot.scrollHeight > pageRoot.clientHeight ? pageRoot : null
          const viewportBottom = activePageRoot
            ? activePageRoot.getBoundingClientRect().bottom
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
            root: usePageRoot ? pageRoot : null,
            rootMargin: '160px 0px',
          })
          observer.observe(sentinel)
        }

        pageRoot?.addEventListener('scroll', checkPosition, { passive: true })
        if (typeof window !== 'undefined') {
          window.addEventListener('scroll', checkPosition, { passive: true })
        }
        return () => {
          observer?.disconnect()
          pageRoot?.removeEventListener('scroll', checkPosition)
          if (typeof window !== 'undefined') {
            window.removeEventListener('scroll', checkPosition)
          }
        }
      }, [hasMore, loading, loadingMore, loadMoreError, loadMore])

      if (account.platform !== 'codeup') {
        return h('section', { className: `${CN}__issueUnsupported` },
          h('h2', null, t('unsupportedIssues')),
          h('p', null, t('unsupportedDescription')),
        )
      }
      if (!rpc) return h('p', { className: `${CN}__error`, role: 'alert' }, t('issueUnavailable'))

      return h('section', { className: `${CN}__issues`, 'aria-label': t('issues'), 'aria-busy': loading || loadingMore },
        h('div', { className: `${CN}__issueHeading` },
          h('h2', null, t('issues')),
          h('span', { className: `${CN}__scopeNote` }, t('scopeAll')),
          h('button', {
            type: 'button', className: `${CN}__button`, disabled: loading,
            onClick: () => setReload(value => value + 1),
          }, h(RefreshIcon), loading ? t('refreshing') : t('refresh')),
        ),
        data && h('div', { className: `${CN}__issueControls` },
          h('div', { className: `${CN}__issueFilterRow` },
            h('label', { className: `${CN}__issueFilter` },
              h('span', { className: `${CN}__controlLabel` }, t('organization')),
              h('select', {
                value: selectedOrganizationId, disabled: loading || organizations.length === 0,
                onChange: event => { setOrganizationId(event.target.value); setProjectId('all') },
              }, organizations.map(item => h('option', { key: item.id, value: item.id }, item.name))),
            ),
            h('label', { className: `${CN}__issueFilter` },
              h('span', { className: `${CN}__controlLabel` }, t('project')),
              h('select', {
                value: selectedProjectId, disabled: loading || projects.length === 0,
                onChange: event => setProjectId(event.target.value),
              },
              h('option', { value: 'all' }, t('allProjects')),
              projects.map(item => h('option', { key: item.id, value: item.id }, item.name))),
            ),
          ),
        ),
        loading && h('p', { className: `${CN}__status`, role: 'status' }, t('issuesLoading')),
        state.status === 'error' && h('div', { className: `${CN}__issueError`, role: 'alert' },
          h('p', { className: `${CN}__error` }, state.error),
          h('button', { type: 'button', className: `${CN}__button`, onClick: () => setReload(value => value + 1) }, t('retry')),
        ),
        data && !loading && organizations.length === 0 && h('p', { className: `${CN}__status` }, t('noOrganizations')),
        data && !loading && organizations.length > 0 && projects.length === 0 && h('p', { className: `${CN}__status` }, t('noProjects')),
        data && items.length > 0 && h('p', { className: `${CN}__issueSummary` }, `${items.length} ${t('issueCount')}`),
        data?.truncated && h('p', { className: `${CN}__warning`, role: 'status' }, t('truncated')),
        data && !loading && items.length === 0 && organizations.length > 0 && projects.length > 0 && h('div', { className: `${CN}__issueEmpty` },
          h('h3', null, t('noIssues')),
          h('p', null, t('noIssuesDescription')),
        ),
        items.length > 0 && h('div', { className: `${CN}__issueList` }, items.map(issue =>
          h(IssueCard, {
            key: issue.id, t, rpc, accountId: account.id,
            organizationId: issue.organizationId || selectedOrganizationId,
            issue, expanded: expandedId === issue.id,
            onToggle: () => setExpandedId(value => value === issue.id ? null : issue.id),
          }))),
        !loading && items.length > 0 && hasMore && h('div', {
          ref: sentinelRef, className: `${CN}__loadMoreSentinel`, 'aria-hidden': true,
        }),
        !loading && items.length > 0 && loadingMore && h('p', {
          className: `${CN}__status ${CN}__loadMoreStatus`, role: 'status',
        }, t('loadingMore')),
        !loading && items.length > 0 && !loadingMore && loadMoreError && h('div', {
          className: `${CN}__issueError ${CN}__loadMoreError`, role: 'alert',
        },
        h('p', { className: `${CN}__error` }, loadMoreError),
        h('button', { type: 'button', className: `${CN}__button`, onClick: loadMore }, t('retry'))),
        !loading && items.length > 0 && !loadingMore && !loadMoreError && hasMore && h('div', {
          className: `${CN}__loadMoreRow`,
        }, h('button', { type: 'button', className: `${CN}__button`, onClick: loadMore }, t('loadMore'))),
        !loading && items.length > 0 && !loadingMore && !loadMoreError && !hasMore && h('p', {
          className: `${CN}__loadMoreEnd`,
        }, t('noMoreIssues')),
      )
    }

    function AccountForm({
      t, form, credentials, busy, setBusy, setError, onDone, onCancel,
      platform, setPlatform, username, setUsername, token, setToken,
      mode, account,
    }) {
      const platformInput = React.useRef(null)
      const id = React.useId()
      const editing = mode === 'edit' && Boolean(account)
      React.useEffect(() => { platformInput.current?.focus() }, [])

      const submit = (event) => {
        event.preventDefault()
        if (busy) return
        const cleanUsername = username.trim()
        const cleanToken = token.trim()
        // A token is mandatory for a new account, optional when editing: leaving
        // it blank keeps the credential already stored under the account's ref.
        if (!cleanUsername || (!editing && !cleanToken)) {
          setError('required')
          return
        }
        const existing = form.getSnapshot().value?.accounts ?? []
        if (existing.some(item => item.id !== account?.id
          && item.platform === platform
          && item.username.toLowerCase() === cleanUsername.toLowerCase())) {
          setError('duplicate')
          return
        }
        setBusy(true)
        setError('')

        if (editing) {
          void (async () => {
            try {
              // Re-read after the form was open so a concurrent accepted write
              // is retained instead of replaced by a stale array.
              const latest = form.getSnapshot()
              const accounts = latest.value?.accounts ?? []
              const accepted = await form.mutate([
                { op: 'set', path: ['accounts'], value: accounts.map(item => item.id === account.id
                  ? { ...item, platform, username: cleanUsername }
                  : item) },
              ], latest.revision)
              if (!accepted) {
                setError('editError')
                return
              }
              // Replace the token only after the metadata write is accepted, so
              // a failed token write leaves the previous credential intact.
              if (cleanToken) {
                try {
                  const stored = await credentials.set(tokenRef(account.id), cleanToken)
                  if (!stored.ok) {
                    setError('tokenSaveError')
                    return
                  }
                } catch (_error) {
                  setError('tokenSaveError')
                  return
                }
              }
              setToken('')
              onDone()
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
            // Re-read after the credential await so a concurrent accepted account
            // write is retained instead of replaced by a stale array.
            const latest = form.getSnapshot()
            const accounts = latest.value?.accounts ?? []
            const newAccount = { id: accountId, platform, username: cleanUsername }
            const accepted = await form.mutate([
              { op: 'set', path: ['accounts'], value: [...accounts, newAccount] },
              { op: 'set', path: ['selectedAccountId'], value: accountId },
            ], latest.revision)
            if (!accepted) {
              setError('accountSaveError')
              return
            }
            completed = true
            setToken('')
            setUsername('')
            setPlatform('github')
            onDone()
          } catch (_error) {
            setError(tokenStored ? 'accountSaveError' : 'tokenSaveError')
          } finally {
            // A failed or cancelled account write must not leave an orphaned
            // token behind under the newly generated, plugin-specific ref.
            if (!completed && credentialAttempted) {
              try { await credentials.unset(ref) } catch (_error) { /* Best-effort rollback. */ }
            }
            setBusy(false)
          }
        })()
      }

      return h('form', {
        className: `${CN}__form`, onSubmit: submit,
        'aria-label': editing ? t('editFormTitle') : t('formTitle'),
      },
      h('h2', { className: `${CN}__formTitle` }, editing ? t('editFormTitle') : t('formTitle')),
      h('fieldset', { className: `${CN}__fields`, disabled: busy },
      h('div', { className: `${CN}__field` },
      h('label', { htmlFor: `${id}-platform` }, t('platform')),
      h('select', {
        id: `${id}-platform`, ref: platformInput, value: platform,
        onChange: event => setPlatform(event.target.value),
      }, PLATFORMS.map(item => h('option', { key: item.id, value: item.id }, item.name)))),
      h('div', { className: `${CN}__field` },
      h('label', { htmlFor: `${id}-username` }, t('username')),
      h('input', {
        id: `${id}-username`, type: 'text', value: username, required: true,
        maxLength: 100, autoComplete: 'off', placeholder: t('usernamePlaceholder'),
        onChange: event => setUsername(event.target.value),
      })),
      h('div', { className: `${CN}__field` },
      h('label', { htmlFor: `${id}-token` }, t('token')),
      h('input', {
        id: `${id}-token`, type: 'password', value: token, required: !editing,
        maxLength: 4096, autoComplete: 'off', spellCheck: false,
        placeholder: t('tokenPlaceholder'), onChange: event => setToken(event.target.value),
      }),
      h('p', { className: `${CN}__hint` }, editing ? t('editTokenHint') : t('tokenHint'))),
      h('div', { className: `${CN}__formActions` },
      h('button', { type: 'button', className: `${CN}__button`, onClick: onCancel }, t('cancel')),
      h('button', { type: 'submit', className: `${CN}__button ${CN}__buttonPrimary` },
        editing ? t('saveChanges') : t('save')))))
    }

    function GitWorkbenchPage({ t, form, credentials, rpc, onClose }) {
      const subscribe = React.useCallback(listener => form.subscribe(listener), [form])
      const getSnapshot = React.useCallback(() => form.getSnapshot(), [form])
      const snapshot = React.useSyncExternalStore(subscribe, getSnapshot)
      const accounts = snapshot.value?.accounts ?? []
      const selected = accounts.find(account => account.id === snapshot.value?.selectedAccountId) ?? accounts[0]
      const [adding, setAdding] = React.useState(false)
      const [editing, setEditing] = React.useState(false)
      const [confirmingDelete, setConfirmingDelete] = React.useState(false)
      const [platform, setPlatform] = React.useState('github')
      const [username, setUsername] = React.useState('')
      const [token, setToken] = React.useState('')
      const [busy, setBusy] = React.useState(false)
      const [selectionBusy, setSelectionBusy] = React.useState(false)
      const [error, setError] = React.useState('')
      const canWrite = snapshot.status === 'ready' && snapshot.writable
      const formOpen = adding || editing
      const managing = formOpen || confirmingDelete

      const resetFields = () => {
        setToken('')
        setUsername('')
        setPlatform('github')
      }
      const openForm = () => {
        setError('')
        resetFields()
        setEditing(false)
        setConfirmingDelete(false)
        setAdding(true)
      }
      const openEdit = () => {
        if (!selected) return
        setError('')
        setPlatform(selected.platform)
        setUsername(selected.username)
        setToken('')
        setAdding(false)
        setConfirmingDelete(false)
        setEditing(true)
      }
      const closeForm = () => {
        setAdding(false)
        setEditing(false)
        setError('')
        resetFields()
      }
      const openDelete = () => {
        if (!selected) return
        setError('')
        setAdding(false)
        setEditing(false)
        setConfirmingDelete(true)
      }
      const cancelDelete = () => {
        setConfirmingDelete(false)
        setError('')
      }
      const confirmDelete = () => {
        if (!selected || busy) return
        const target = selected
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
            // The account is already gone from config; removing its token is a
            // best-effort cleanup that must not fail the whole operation.
            try { await credentials.unset(tokenRef(target.id)) } catch (_error) { /* Best effort. */ }
            setConfirmingDelete(false)
            resetFields()
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

      const header = h('header', { className: `${CN}__header`, 'data-window-drag': true },
        h('div', { className: `${CN}__heading` },
          h('button', {
            type: 'button', className: `${CN}__iconButton ${CN}__back`,
            onClick: onClose, 'aria-label': t('back'), title: t('back'),
          }, h(BackIcon)),
          h('div', { className: `${CN}__headingText` },
            h('h1', null, t('title')),
            h('p', null, t('subtitle')),
          ),
        ),
        accounts.length > 0 && h('div', { className: `${CN}__accountTools` },
          h('select', {
            className: `${CN}__accountSelect`, value: selected?.id ?? '',
            disabled: busy || selectionBusy || !canWrite, 'aria-label': t('accountSelect'),
            onChange: event => selectAccount(event.target.value),
          }, accounts.map(account => h('option', { key: account.id, value: account.id },
            `${platformName(account.platform)} · ${account.username}`))),
          h('button', {
            type: 'button', className: `${CN}__button ${CN}__buttonPrimary ${CN}__add`,
            disabled: busy || !canWrite, onClick: openForm, 'aria-expanded': adding,
          }, h(PlusIcon), t('add')),
          h('button', {
            type: 'button', className: `${CN}__iconButton ${CN}__accountAction`,
            disabled: busy || selectionBusy || !canWrite || managing,
            onClick: openEdit, 'aria-label': t('edit'), title: t('edit'),
          }, h(EditIcon)),
          h('button', {
            type: 'button', className: `${CN}__iconButton ${CN}__accountAction ${CN}__delete`,
            disabled: busy || selectionBusy || !canWrite || managing,
            onClick: openDelete, 'aria-label': t('delete'), title: t('delete'),
          }, h(TrashIcon)),
        ),
      )

      const deleteBar = confirmingDelete && selected && (() => {
        const summary = h('div', { className: `${CN}__confirmText` },
          h('strong', null, `${t('confirmDeleteTitle')}：${platformName(selected.platform)} · ${selected.username}`),
          h('p', null, t('confirmDeleteDescription')))
        const actions = h('div', { className: `${CN}__formActions` },
          h('button', {
            type: 'button', className: `${CN}__button`, disabled: busy, onClick: cancelDelete,
          }, t('cancel')),
          h('button', {
            type: 'button', className: `${CN}__button ${CN}__buttonDanger`,
            disabled: busy, onClick: confirmDelete,
          }, t('confirmDeleteAction')))
        return h('div', {
          className: `${CN}__confirm`, role: 'alertdialog', 'aria-label': t('confirmDeleteTitle'),
        }, summary, actions)
      })()

      return h('section', { className: `${CN}__page`, 'aria-label': t('title') },
        h('style', null, CSS),
        h('div', { className: `${CN}__content` },
          header,
          deleteBar,
          snapshot.status === 'loading' && h('p', { className: `${CN}__status`, role: 'status' }, t('loading')),
          snapshot.status === 'unavailable' && h('p', { className: `${CN}__status`, role: 'alert' }, t('unavailable')),
          snapshot.status === 'ready' && !snapshot.writable
            && h('p', { className: `${CN}__status`, role: 'note' }, t('readonly')),
          error && h('p', { className: `${CN}__error`, role: 'alert' }, t(error)),
          snapshot.status === 'ready' && accounts.length === 0 && !formOpen && h('div', { className: `${CN}__empty` },
            h('div', { className: `${CN}__emptyIcon` }, h(BranchIcon, { size: 30 })),
            h('h2', null, t('emptyTitle')),
            h('p', null, t('emptyDescription')),
            h('button', {
              type: 'button', className: `${CN}__button ${CN}__buttonPrimary`,
              disabled: !canWrite, onClick: openForm,
            }, h(PlusIcon), t('addAccount')),
          ),
          formOpen && h(AccountForm, {
            t, form, credentials, busy, setBusy, setError,
            onDone: closeForm, onCancel: closeForm,
            platform, setPlatform, username, setUsername, token, setToken,
            mode: editing ? 'edit' : 'add', account: editing ? selected : null,
          }),
          snapshot.status === 'ready' && selected && !formOpen
            && h(IssueWorkbench, { key: selected.id, t, rpc, account: selected }),
          snapshot.status === 'ready' && accounts.length > 0 && !formOpen
            && h('p', { className: `${CN}__note` }, t('configuredNote')),
        ),
      )
    }

    const CSS = `
.${CN}__page{box-sizing:border-box;width:100%;height:100%;overflow:auto;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:14px;line-height:1.6}
.${CN}__content{box-sizing:border-box;max-width:960px;min-height:100%;margin:0 auto;padding:0 clamp(24px,4vw,48px) 48px}
.${CN}__header{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;padding-top:calc(28px + var(--dsh-frame-top-clearance,0px));margin-bottom:28px}
.${CN}__heading{display:flex;align-items:center;gap:12px;min-width:0}
.${CN}__headingText{min-width:0}
.${CN}__heading h1{margin:0;font-size:20px;line-height:28px;font-weight:500}
.${CN}__heading p{margin:4px 0 0;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px}
.${CN}__iconButton{display:inline-flex;align-items:center;justify-content:center;flex:none;width:32px;height:32px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}
.${CN}__iconButton:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.${CN}__delete:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-state-error-primary)}
.${CN}__back{margin-left:-8px}
.${CN}__accountTools{display:flex;align-items:center;gap:8px;min-width:0}
.${CN}__accountSelect{box-sizing:border-box;max-width:min(360px,60vw);height:32px;padding:0 30px 0 11px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:8px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;cursor:pointer}
.${CN}__accountSelect:focus-visible,.${CN}__field input:focus-visible,.${CN}__field select:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
.${CN}__button{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:32px;padding:0 13px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:8px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;cursor:pointer}
.${CN}__button:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.${CN}__buttonPrimary{border-color:var(--dsw-alias-state-business-primary);background:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-label-primary-foreground)}
.${CN}__buttonPrimary:hover:not(:disabled){background:var(--dsw-alias-state-business-primary)}
.${CN}__buttonDanger{border-color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-label-primary-foreground)}
.${CN}__buttonDanger:hover:not(:disabled){background:var(--dsw-alias-state-error-primary)}
.${CN}__button:disabled,.${CN}__accountSelect:disabled{opacity:.5;cursor:not-allowed}
.${CN}__status{margin:0 0 16px;color:var(--dsw-alias-label-secondary);font-size:13px}
.${CN}__error{box-sizing:border-box;margin:0 0 16px;padding:10px 12px;border-left:2px solid var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary);font-size:13px}
.${CN}__empty{display:flex;flex-direction:column;align-items:center;box-sizing:border-box;margin-top:48px;padding:48px 24px;border:1px dashed var(--dsw-alias-border-l3);border-radius:16px;text-align:center}
.${CN}__emptyIcon{display:flex;align-items:center;justify-content:center;width:52px;height:52px;margin-bottom:16px;color:var(--dsw-alias-state-business-primary)}
.${CN}__empty h2{margin:0;font-size:16px;line-height:24px;font-weight:500}
.${CN}__empty p{max-width:480px;margin:8px 0 20px;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px}
.${CN}__form{box-sizing:border-box;max-width:560px;padding:24px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:14px;background:var(--dsw-alias-bg-base)}
.${CN}__formTitle{margin:0 0 20px;font-size:16px;line-height:24px;font-weight:500}
.${CN}__fields{display:grid;gap:18px;min-width:0;margin:0;padding:0;border:0}
.${CN}__field{display:grid;gap:7px;min-width:0}
.${CN}__field label{font-size:13px;font-weight:500}
.${CN}__field input,.${CN}__field select{box-sizing:border-box;width:100%;height:38px;padding:0 11px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:8px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:14px}
.${CN}__field input::placeholder{color:var(--dsw-alias-label-caption)}
.${CN}__hint{margin:0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.${CN}__formActions{display:flex;justify-content:flex-end;gap:8px;margin-top:4px}
.${CN}__confirm{box-sizing:border-box;display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:12px;margin:0 0 16px;padding:14px 16px;border:0.5px solid var(--dsw-alias-state-error-primary);border-radius:12px;background:var(--dsw-alias-bg-layer-1)}
.${CN}__confirmText{min-width:0}
.${CN}__confirmText strong{color:var(--dsw-alias-label-primary);font-size:14px;line-height:22px;font-weight:500;overflow-wrap:anywhere}
.${CN}__confirmText p{margin:4px 0 0;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px}
.${CN}__confirm .${CN}__formActions{flex:none;margin-top:0}
.${CN}__note{margin:24px 0 0;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px}
.${CN}__issues{box-sizing:border-box;margin-top:28px}
.${CN}__issueHeading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}
.${CN}__issueHeading h2{margin:0;font-size:16px;line-height:24px;font-weight:500}
.${CN}__scopeNote{margin-right:auto;display:inline-flex;align-items:center;min-height:20px;padding:0 8px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:999px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.${CN}__issueControls{display:grid;gap:14px;margin-bottom:18px}
.${CN}__controlLabel{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.${CN}__issueFilterRow{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.${CN}__issueFilter{display:grid;gap:7px;min-width:0}
.${CN}__issueFilter select{box-sizing:border-box;width:100%;height:36px;padding:0 30px 0 11px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:8px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px}
.${CN}__issueFilter select:disabled{opacity:.55;cursor:not-allowed}
.${CN}__issueSummary{margin:0 0 12px;color:var(--dsw-alias-label-secondary);font-size:13px}
.${CN}__issueList{display:grid;gap:10px}
.${CN}__issueCard{box-sizing:border-box;border:0.5px solid var(--dsw-alias-border-l3);border-radius:12px;background:var(--dsw-alias-bg-layer-1);overflow:hidden}
.${CN}__issueButton{box-sizing:border-box;display:block;width:100%;padding:16px;border:0;background:transparent;color:inherit;text-align:left;font:inherit;cursor:pointer}
.${CN}__issueButton:hover{background:var(--dsw-alias-interactive-bg-hover)}
.${CN}__issueTitleRow{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
.${CN}__issueTitleBlock{min-width:0}
.${CN}__issueTitle{color:var(--dsw-alias-label-primary);font-size:14px;line-height:22px;font-weight:500;overflow-wrap:anywhere}
.${CN}__issueSerial{flex:none;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:22px}
.${CN}__issueBadges{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.${CN}__issueBadge{display:inline-flex;align-items:center;min-height:20px;padding:0 7px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:999px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.${CN}__issueBadgeDone{border-color:var(--dsw-alias-state-success-primary);color:var(--dsw-alias-state-success-primary)}
.${CN}__issueBadgeRelation{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}
.${CN}__issueMeta{display:flex;flex-wrap:wrap;gap:4px 16px;margin-top:10px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.${CN}__issueDetail{padding:0 16px 18px;border-top:0.5px solid var(--dsw-alias-border-l3);color:var(--dsw-alias-label-secondary);font-size:13px}
.${CN}__openLink{display:inline-flex;align-items:center;gap:6px;margin-top:16px;color:var(--dsw-alias-brand-primary);font-size:13px;text-decoration:none}
.${CN}__openLink:hover{text-decoration:underline}
.${CN}__detailGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px 20px;margin:16px 0}
.${CN}__detailRow{min-width:0}
.${CN}__detailRow dt{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.${CN}__detailRow dd{margin:4px 0 0;color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px;overflow-wrap:anywhere}
.${CN}__descriptionSection h3,.${CN}__customFields h3{margin:18px 0 8px;color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px;font-weight:500}
.${CN}__description{box-sizing:border-box;max-height:380px;overflow:auto;padding:12px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.65}
.${CN}__issueEmpty,.${CN}__issueUnsupported{box-sizing:border-box;margin-top:28px;padding:24px;border:0.5px dashed var(--dsw-alias-border-l3);border-radius:12px;text-align:center}
.${CN}__issueEmpty h3,.${CN}__issueUnsupported h2{margin:0;color:var(--dsw-alias-label-primary);font-size:14px;line-height:22px;font-weight:500}
.${CN}__issueEmpty p,.${CN}__issueUnsupported p{margin:6px 0 0;color:var(--dsw-alias-label-secondary);font-size:13px}
.${CN}__warning{box-sizing:border-box;margin:0 0 14px;padding:10px 12px;border-left:2px solid var(--dsw-alias-state-warn-primary);color:var(--dsw-alias-state-warn-primary);font-size:13px}
.${CN}__issueError{margin-bottom:14px}
.${CN}__loadMoreSentinel{height:1px}
.${CN}__loadMoreStatus{margin:16px 0 0;text-align:center}
.${CN}__loadMoreRow{display:flex;justify-content:center;margin-top:16px}
.${CN}__loadMoreEnd{margin:16px 0 0;color:var(--dsw-alias-label-tertiary);font-size:12px;text-align:center}
.${CN}__loadMoreError{margin-top:16px}
.${CN}__issueButton:focus-visible,.${CN}__issueFilter select:focus-visible,.${CN}__button:focus-visible,.${CN}__iconButton:focus-visible,.${CN}__openLink:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
@media(max-width:767px){.${CN}__content{padding-inline:20px}.${CN}__header{align-items:flex-start}.${CN}__accountTools{width:100%}.${CN}__accountSelect{flex:1;max-width:none}.${CN}__form{padding:20px}.${CN}__confirm{flex-direction:column}.${CN}__issueFilterRow{grid-template-columns:1fr}.${CN}__issueTitleRow{flex-direction:column;gap:4px}.${CN}__issueSerial{white-space:normal}}
@media(pointer:coarse){.${CN}__field input,.${CN}__field select{font-size:16px}}
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
