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
      githubIssues: 'GitHub Issues',
      organization: '组织',
      owner: '所有者',
      allOwners: '全部所有者',
      project: '项目',
      repository: '仓库',
      allProjects: '全部项目',
      allRepositories: '全部仓库',
      refresh: '刷新',
      refreshing: '正在刷新…',
      issuesLoading: '正在读取 Codeup 工作项…',
      githubIssuesLoading: '正在读取 GitHub Issues…',
      issueCount: '个工作项',
      githubIssueCount: '个 Issue',
      totalPrefix: '共',
      loadedCount: '已加载',
      countingTotal: '正在统计总数…',
      noIssues: '没有匹配的工作项',
      noIssuesDescription: '可以尝试切换范围、组织或项目。',
      noGithubIssues: '没有匹配的 Issue',
      noGithubIssuesDescription: '可以尝试切换所有者或仓库，或在 GitHub 中创建 Issue 后刷新。',
      selectIssuePrompt: '点击左侧任务查看详细描述',
      unsupportedIssues: '该平台尚未接入 Issue 获取',
      unsupportedDescription: '目前支持 Codeup（云效项目协作）和 GitHub 的 Issue 获取。',
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
      typeIssue: 'Issue',
      status: '状态',
      assignedTo: '负责人',
      participants: '参与人',
      creator: '创建人',
      updatedAt: '更新时间',
      createdAt: '创建时间',
      labels: '标签',
      otherFields: '其他字段',
      openInCodeup: '在云效中打开',
      openInGitHub: '在 GitHub 中打开',
      issueCopyLink: '复制链接',
      relationAssigned: '负责人',
      relationParticipant: '参与人',
      actionStart: '开始',
      actionContinue: '继续',
      cloneModalTitleStart: '开始任务',
      cloneModalTitleContinue: '继续任务',
      cloneLoading: '正在查询该任务关联的仓库并依次克隆到 ~/project…',
      cloneNoRepos: '该任务没有关联仓库，请先去关联。',
      cloneTargetDir: '目标目录',
      cloneStatusCloned: '克隆成功',
      cloneStatusExists: '已存在，已跳过',
      cloneStatusFailed: '克隆失败',
      cloneAllSuccess: '关联仓库已准备就绪。',
      clonePartialFailure: '部分仓库克隆失败，请检查权限或本地目录后重试。',
      cloneError: '克隆关联仓库失败。',
      cloneOpeningWorkspace: '正在以该仓库开启工作区…',
      cloneStartingAgent: '正在启动任务开发会话…',
      cloneWorkspaceError: '仓库已就绪，但自动开启工作区失败。',
      skillKickoffError: '工作区已开启，但技能流程启动失败。',
      copyCode: '复制代码',
      copied: '已复制',
      footnotes: '注释',
      noOrganizations: '这个账户没有可用的云效组织。',
      noProjects: '这个组织下没有可用项目。',
      noRepositories: '这个账户下没有可访问的 GitHub 仓库。',
      loadMore: '加载更多',
      loadingMore: '正在加载更多工作项…',
      loadingMoreGithub: '正在加载更多 Issue…',
      noMoreIssues: '已加载全部工作项',
      noMoreGithubIssues: '已加载全部 Issue',
      loadMoreError: '加载更多工作项失败。',
      loadMoreGithubError: '加载更多 Issue 失败。',
      viewModeSelect: '切换视图',
      viewTasks: '查看任务',
      viewRepos: '查看仓库',
      repos: 'Codeup 仓库',
      githubRepos: 'GitHub 仓库',
      reposLoading: '正在读取 Codeup 仓库…',
      githubReposLoading: '正在读取 GitHub 仓库…',
      repoCount: '个仓库',
      noRepos: '没有匹配的仓库',
      noReposDescription: '可以尝试切换组织或清空搜索条件后刷新。',
      noGithubReposDescription: '可以尝试切换所有者或清空搜索条件后刷新。',
      selectRepoPrompt: '点击左侧仓库查看详细信息',
      repoSearchPlaceholder: '搜索仓库…',
      repoUnavailable: '当前连接不可用，无法读取仓库列表。',
      unsupportedRepos: '该平台尚未接入仓库获取',
      unsupportedReposDescription: '目前支持 Codeup（云效）和 GitHub 的仓库获取与克隆。',
      loadingMoreRepos: '正在加载更多仓库…',
      noMoreRepos: '已加载全部仓库',
      loadMoreReposError: '加载更多仓库失败。',
      repoVisibility: '可见性',
      visibilityPrivate: '私有',
      visibilityInternal: '内部',
      visibilityPublic: '公开',
      repoArchived: '已归档',
      repoFork: 'Fork',
      repoDefaultBranch: '默认分支',
      repoLanguage: '主要语言',
      repoNamespace: '命名空间',
      repoCloneUrls: '克隆地址',
      repoCloneHttps: 'HTTPS',
      repoCloneSsh: 'SSH',
      repoCopyAddress: '复制地址',
      repoDescription: '仓库简介',
      repoNoDescription: '暂无简介。',
      repoStars: '星标',
      repoForks: 'Fork 数',
      repoOpenIssues: '打开的 Issue',
      cloneToLocal: '克隆到本地',
      cloningToLocal: '克隆中…',
      repoCloneModalTitle: '克隆仓库',
      repoCloneLoading: '正在将该仓库克隆到 ~/project…',
      repoCloneNotFound: '未找到该仓库的克隆地址。',
      repoCloneSuccess: '仓库已克隆到本地。',
      repoCloneExists: '本地已存在该仓库。',
      repoCloneFailed: '仓库克隆失败，请检查权限或本地目录后重试。',
      repoCloneError: '克隆仓库失败。',
      repoCreateWorkspacePrompt: '是否创建该仓库的工作区？',
      repoCreateWorkspaceConfirm: '是',
      repoCreateWorkspaceCancel: '否',
      viewPrs: '查看 PR',
      prs: 'Codeup 合并请求',
      githubPrs: 'GitHub Pull Requests',
      prsLoading: '正在读取 Codeup 合并请求…',
      githubPrsLoading: '正在读取 GitHub PR…',
      prCount: '个 PR',
      noPrs: '没有匹配的 PR',
      noPrsDescription: '可以尝试切换组织、仓库、状态或清空搜索条件后刷新。',
      noGithubPrsDescription: '可以尝试切换所有者、仓库、状态或清空搜索条件后刷新。',
      selectPrPrompt: '点击左侧 PR 查看详细信息',
      prSearchPlaceholder: '搜索 PR…',
      prUnavailable: '当前连接不可用，无法读取 PR 列表。',
      unsupportedPrs: '该平台尚未接入 PR 获取',
      unsupportedPrsDescription: '目前支持 Codeup（云效合并请求）和 GitHub 的 Pull Request 获取。',
      loadingMorePrs: '正在加载更多 PR…',
      noMorePrs: '已加载全部 PR',
      loadMorePrsError: '加载更多 PR 失败。',
      prState: 'PR 状态',
      prStateAll: '全部状态',
      prStateOpen: '开放中',
      prStateMerged: '已合并',
      prStateClosed: '已关闭',
      prDraft: '草稿',
      prConflict: '存在冲突',
      prBranches: '分支',
      prAuthor: '创建人',
      prReviewers: '评审人',
      prAssignees: '负责人',
      prMergedAt: '合并时间',
      prComments: '评论数',
      prCommits: '提交数',
      prDiffStats: '变更统计',
      prFilesChanged: '个文件',
      prDescription: 'PR 描述',
      prTruncated: '结果可能不完整：仓库或 PR 数量较多，仅展示最近更新的部分结果。请选择单个仓库查看完整列表。',
      prStartModalTitle: '开始处理 PR',
      prStartLoading: '正在克隆该 PR 对应的仓库到 ~/project…',
    }

    const en = {
      title: 'Git workbench',
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
      githubIssues: 'GitHub issues',
      organization: 'Organization',
      owner: 'Owner',
      allOwners: 'All owners',
      project: 'Project',
      repository: 'Repository',
      allProjects: 'All projects',
      allRepositories: 'All repositories',
      refresh: 'Refresh',
      refreshing: 'Refreshing…',
      issuesLoading: 'Loading Codeup work items…',
      githubIssuesLoading: 'Loading GitHub issues…',
      issueCount: 'work items',
      githubIssueCount: 'issues',
      totalPrefix: 'Total',
      loadedCount: 'Loaded',
      countingTotal: 'Counting total…',
      noIssues: 'No matching work items',
      noIssuesDescription: 'Try another scope, organization, or project.',
      noGithubIssues: 'No matching issues',
      noGithubIssuesDescription: 'Try switching owner or repository, or create an issue on GitHub and refresh.',
      selectIssuePrompt: 'Select a work item on the left to view its description',
      unsupportedIssues: 'Issue loading is not connected for this platform',
      unsupportedDescription: 'Codeup (Yunxiao Projex) work items and GitHub issues are currently supported.',
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
      typeIssue: 'Issue',
      status: 'Status',
      assignedTo: 'Assignee',
      participants: 'Participants',
      creator: 'Creator',
      updatedAt: 'Updated',
      createdAt: 'Created',
      labels: 'Labels',
      otherFields: 'Other fields',
      openInCodeup: 'Open in Yunxiao',
      openInGitHub: 'Open on GitHub',
      issueCopyLink: 'Copy link',
      relationAssigned: 'Assigned',
      relationParticipant: 'Participating',
      actionStart: 'Start',
      actionContinue: 'Continue',
      cloneModalTitleStart: 'Start task',
      cloneModalTitleContinue: 'Continue task',
      cloneLoading: 'Checking associated repositories and cloning to ~/project…',
      cloneNoRepos: 'This task has no associated repository. Please associate one first.',
      cloneTargetDir: 'Target directory',
      cloneStatusCloned: 'Cloned',
      cloneStatusExists: 'Already exists (skipped)',
      cloneStatusFailed: 'Failed',
      cloneAllSuccess: 'Associated repositories are ready.',
      clonePartialFailure: 'Some repositories failed to clone. Check permissions or local directories and retry.',
      cloneError: 'Could not clone associated repositories.',
      cloneOpeningWorkspace: 'Opening workspace for the repository…',
      cloneStartingAgent: 'Starting the task session…',
      cloneWorkspaceError: 'Repositories are ready, but opening the workspace failed.',
      skillKickoffError: 'The workspace opened, but the skill flow failed to start.',
      copyCode: 'Copy code',
      copied: 'Copied',
      footnotes: 'Footnotes',
      noOrganizations: 'No Yunxiao organizations are available to this account.',
      noProjects: 'No projects are available in this organization.',
      noRepositories: 'No accessible GitHub repositories were found for this account.',
      loadMore: 'Load more',
      loadingMore: 'Loading more work items…',
      loadingMoreGithub: 'Loading more issues…',
      noMoreIssues: 'All work items loaded',
      noMoreGithubIssues: 'All issues loaded',
      loadMoreError: 'Could not load more work items.',
      loadMoreGithubError: 'Could not load more issues.',
      viewModeSelect: 'Switch view',
      viewTasks: 'View tasks',
      viewRepos: 'View repositories',
      repos: 'Codeup repositories',
      githubRepos: 'GitHub repositories',
      reposLoading: 'Loading Codeup repositories…',
      githubReposLoading: 'Loading GitHub repositories…',
      repoCount: 'repositories',
      noRepos: 'No matching repositories',
      noReposDescription: 'Try switching organization or clearing the search filter, then refresh.',
      noGithubReposDescription: 'Try switching owner or clearing the search filter, then refresh.',
      selectRepoPrompt: 'Select a repository on the left to view its details',
      repoSearchPlaceholder: 'Search repositories…',
      repoUnavailable: 'The current connection cannot load repositories.',
      unsupportedRepos: 'Repository loading is not connected for this platform',
      unsupportedReposDescription: 'Codeup (Yunxiao) and GitHub repositories are currently supported.',
      loadingMoreRepos: 'Loading more repositories…',
      noMoreRepos: 'All repositories loaded',
      loadMoreReposError: 'Could not load more repositories.',
      repoVisibility: 'Visibility',
      visibilityPrivate: 'Private',
      visibilityInternal: 'Internal',
      visibilityPublic: 'Public',
      repoArchived: 'Archived',
      repoFork: 'Fork',
      repoDefaultBranch: 'Default branch',
      repoLanguage: 'Language',
      repoNamespace: 'Namespace',
      repoCloneUrls: 'Clone URLs',
      repoCloneHttps: 'HTTPS',
      repoCloneSsh: 'SSH',
      repoCopyAddress: 'Copy address',
      repoDescription: 'Description',
      repoNoDescription: 'No description.',
      repoStars: 'Stars',
      repoForks: 'Forks',
      repoOpenIssues: 'Open issues',
      cloneToLocal: 'Clone to local',
      cloningToLocal: 'Cloning…',
      repoCloneModalTitle: 'Clone repository',
      repoCloneLoading: 'Cloning repository to ~/project…',
      repoCloneNotFound: 'No clone URL was found for this repository.',
      repoCloneSuccess: 'Repository cloned locally.',
      repoCloneExists: 'Repository already exists locally.',
      repoCloneFailed: 'Failed to clone repository. Check permissions or local directory and retry.',
      repoCloneError: 'Could not clone repository.',
      repoCreateWorkspacePrompt: 'Create a workspace for this repository?',
      repoCreateWorkspaceConfirm: 'Yes',
      repoCreateWorkspaceCancel: 'No',
      viewPrs: 'View PRs',
      prs: 'Codeup merge requests',
      githubPrs: 'GitHub pull requests',
      prsLoading: 'Loading Codeup merge requests…',
      githubPrsLoading: 'Loading GitHub pull requests…',
      prCount: 'PRs',
      noPrs: 'No matching pull requests',
      noPrsDescription: 'Try switching organization, repository, state, or clearing search, then refresh.',
      noGithubPrsDescription: 'Try switching owner, repository, state, or clearing search, then refresh.',
      selectPrPrompt: 'Select a pull request on the left to view its details',
      prSearchPlaceholder: 'Search PRs…',
      prUnavailable: 'The current connection cannot load pull requests.',
      unsupportedPrs: 'Pull request loading is not connected for this platform',
      unsupportedPrsDescription: 'Codeup merge requests and GitHub pull requests are currently supported.',
      loadingMorePrs: 'Loading more pull requests…',
      noMorePrs: 'All pull requests loaded',
      loadMorePrsError: 'Could not load more pull requests.',
      prState: 'PR state',
      prStateAll: 'All states',
      prStateOpen: 'Open',
      prStateMerged: 'Merged',
      prStateClosed: 'Closed',
      prDraft: 'Draft',
      prConflict: 'Conflicts',
      prBranches: 'Branches',
      prAuthor: 'Author',
      prReviewers: 'Reviewers',
      prAssignees: 'Assignees',
      prMergedAt: 'Merged at',
      prComments: 'Comments',
      prCommits: 'Commits',
      prDiffStats: 'Changes',
      prFilesChanged: 'files',
      prDescription: 'PR description',
      prTruncated: 'Results may be incomplete because there are many repositories or pull requests. Select a single repository to see all PRs.',
      prStartModalTitle: 'Start PR',
      prStartLoading: 'Cloning the PR repository to ~/project…',
    }

    const PLATFORMS = [
      { id: 'github', name: 'GitHub' },
      { id: 'gitlab', name: 'GitLab' },
      { id: 'gitee', name: 'Gitee' },
      { id: 'codeup', name: 'Codeup' },
    ]

    const SUPPORTED_ISSUE_PLATFORMS = new Set(['codeup', 'github'])

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

    function DownloadIcon() {
      return h('svg', {
        width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round',
        strokeLinejoin: 'round', 'aria-hidden': true,
      },
      h('path', { d: 'M12 4v11m0 0-4-4m4 4 4-4' }),
      h('path', { d: 'M4 17v1.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V17' }))
    }

    function CopyIcon() {
      return h('svg', {
        width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round',
        strokeLinejoin: 'round', 'aria-hidden': true,
      },
      h('rect', { x: 9, y: 9, width: 12, height: 12, rx: 2 }),
      h('path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' }))
    }

    function copyText(text) {
      if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
        return Promise.reject(new Error('clipboard unavailable'))
      }
      return navigator.clipboard.writeText(text)
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
     * Dropdown with a built-in search box for long option lists. Uses the same
     * trigger styling as NativeSelect but renders its own popup so options can
     * be filtered by label.
     */
    function FilterableSelect({
      id,
      value,
      options,
      onChange,
      disabled = false,
      ariaLabel,
      placeholder = '',
      className = '',
      searchPlaceholder = '',
      emptyText = '',
    }) {
      const [open, setOpen] = React.useState(false)
      const [query, setQuery] = React.useState('')
      const list = Array.isArray(options) ? options : []
      const selected = optionId(value)
      const current = list.find(item => optionId(item.value ?? item.id) === selected)
      const displayLabel = current?.label ?? placeholder
      const isDisabled = disabled || list.length === 0
      const normalizedQuery = query.trim().toLowerCase()
      const filtered = normalizedQuery
        ? list.filter(item => String(item.label ?? '').toLowerCase().includes(normalizedQuery))
        : list

      const pick = React.useCallback((item) => {
        const next = optionId(item.value ?? item.id)
        setOpen(false)
        if (next !== selected) onChange(next)
      }, [onChange, selected])

      React.useEffect(() => {
        if (!open) return
        const onKeyDown = (event) => {
          if (event.key === 'Escape') {
            event.stopPropagation()
            setOpen(false)
          }
        }
        window.addEventListener('keydown', onKeyDown, true)
        return () => window.removeEventListener('keydown', onKeyDown, true)
      }, [open])

      return h('div', { className: `${CN}__filterable` },
        h('button', {
          type: 'button',
          id,
          role: 'combobox',
          className: `${CN}__selectTrigger ${open && !isDisabled ? 'is-open' : ''} ${className}`.trim(),
          disabled: isDisabled,
          'aria-haspopup': 'listbox',
          'aria-expanded': open && !isDisabled,
          'aria-label': ariaLabel,
          title: displayLabel || ariaLabel || '',
          onClick: () => {
            if (isDisabled) return
            setQuery('')
            setOpen(prev => !prev)
          },
        },
          h('span', { className: `${CN}__selectLabel` }, displayLabel),
          h(ChevronDownIcon, { open: open && !isDisabled })),
        open && !isDisabled && h('div', { className: `${CN}__selectBackdrop`, onClick: () => setOpen(false) }),
        open && !isDisabled && h('div', { className: `${CN}__selectPanel`, role: 'listbox', 'aria-label': ariaLabel },
          h('input', {
            type: 'search',
            className: `${CN}__selectSearch`,
            value: query,
            placeholder: searchPlaceholder,
            'aria-label': searchPlaceholder || ariaLabel,
            autoFocus: true,
            onChange: event => setQuery(event.target.value),
            onKeyDown: (event) => {
              if (event.key === 'Enter' && filtered.length === 1) {
                event.preventDefault()
                pick(filtered[0])
              }
            },
          }),
          h('div', { className: `${CN}__selectOptions` },
            filtered.length === 0 && h('div', { className: `${CN}__selectEmpty` }, emptyText),
            filtered.map(item => {
              const itemValue = optionId(item.value ?? item.id)
              const isSelected = itemValue === selected
              return h('button', {
                key: itemValue,
                type: 'button',
                role: 'option',
                'aria-selected': isSelected,
                className: `${CN}__selectOption${isSelected ? ' is-selected' : ''}`,
                onClick: () => pick(item),
              }, item.label)
            }),
          ),
        ),
      )
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
        const code = result?.error?.code || 'internal'
        const message = result?.error?.message || ''
        if (code === 'bad-request' && message === '不支持的工作台请求。') {
          const hint = new Error('host-not-loaded')
          hint.code = 'host-not-loaded'
          throw hint
        }
        const error = new Error(message)
        error.code = code
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

    function shortRepoName(value) {
      if (typeof value !== 'string') return value
      const trimmed = value.trim()
      if (!trimmed) return value
      const parts = trimmed.split('/')
      return parts.length > 1 ? parts[parts.length - 1] : trimmed
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

    function githubWebUrl(rawUrl) {
      const href = safeHref(rawUrl)
      if (!href) return ''
      try {
        const parsed = new URL(href)
        const host = parsed.hostname.toLowerCase()
        return parsed.protocol === 'https:' && (host === 'github.com' || host.endsWith('.github.com'))
          ? parsed.href
          : ''
      } catch (_error) {
        return ''
      }
    }

    function codeupRepoWebUrl(rawUrl) {
      const href = safeHref(rawUrl)
      if (!href) return ''
      try {
        const parsed = new URL(href)
        const host = parsed.hostname.toLowerCase()
        return parsed.protocol === 'https:' && (host === 'codeup.aliyun.com' || host.endsWith('.codeup.aliyun.com'))
          ? parsed.href
          : ''
      } catch (_error) {
        return ''
      }
    }

    function repoExternalLink(t, platform, repo) {
      if (!repo) return null
      if (platform === 'github') {
        const href = githubWebUrl(repo.webUrl)
        return href ? { href, label: t('openInGitHub') } : null
      }
      if (platform === 'codeup') {
        const href = codeupRepoWebUrl(repo.webUrl)
        return href ? { href, label: t('openInCodeup') } : null
      }
      return null
    }

    function repoVisibilityBadge(t, visibility) {
      const normalized = String(visibility || '').trim().toLowerCase()
      if (normalized === 'private') return { label: t('visibilityPrivate'), className: '' }
      if (normalized === 'internal') return { label: t('visibilityInternal'), className: `${CN}__issueBadgeActive` }
      if (normalized === 'public') return { label: t('visibilityPublic'), className: `${CN}__issueBadgeDone` }
      return null
    }

    function prStateBadge(t, state) {
      const normalized = String(state || '').trim().toLowerCase()
      if (normalized === 'merged') return { label: t('prStateMerged'), className: `${CN}__issueBadgeDone` }
      if (normalized === 'closed') return { label: t('prStateClosed'), className: '' }
      return { label: t('prStateOpen'), className: `${CN}__issueBadgeActive` }
    }

    function prExternalLink(t, platform, pr, detail) {
      const rawUrl = detail?.webUrl || pr?.webUrl
      if (!rawUrl) return null
      if (platform === 'github') {
        const href = githubWebUrl(rawUrl)
        return href ? { href, label: t('openInGitHub') } : null
      }
      if (platform === 'codeup') {
        const href = codeupRepoWebUrl(rawUrl)
        return href ? { href, label: t('openInCodeup') } : null
      }
      return null
    }

    function formatPrDiffStats(t, detail) {
      const parts = []
      if (typeof detail?.additions === 'number' || typeof detail?.deletions === 'number') {
        parts.push(`+${detail.additions ?? 0} / -${detail.deletions ?? 0}`)
      }
      if (typeof detail?.changedFiles === 'number') {
        parts.push(`${detail.changedFiles} ${t('prFilesChanged')}`)
      }
      return parts.join(' · ')
    }

    function issueExternalLink(t, platform, issue, detail) {
      if (platform === 'github') {
        const href = githubWebUrl(detail?.webUrl || issue?.webUrl)
        return href ? { href, label: t('openInGitHub') } : null
      }
      const categoryPath = workitemCategoryKind(detail) || workitemCategoryKind(issue)
      const href = codeupWebUrl(
        detail?.space?.id || issue?.space?.id,
        categoryPath,
        detail?.id || issue?.id,
      )
      return href ? { href, label: t('openInCodeup') } : null
    }

    function taskIssueUrl(platform, issue, detail) {
      if (platform === 'github') {
        return githubWebUrl(detail?.webUrl || issue?.webUrl)
      }
      const categoryPath = workitemCategoryKind(detail) || workitemCategoryKind(issue)
      return codeupWebUrl(
        detail?.space?.id || issue?.space?.id,
        categoryPath,
        detail?.id || issue?.id,
      )
    }

    function remoteValue(result) {
      if (result && typeof result === 'object' && 'ok' in result) {
        if (result.ok === false) {
          throw new Error(result.error?.message || 'remote call failed')
        }
        return result.value
      }
      return result
    }

    function newSessionRequestId() {
      try {
        return crypto.randomUUID()
      } catch (_error) {
        return `req-${Date.now()}-${Math.random().toString(36).slice(2)}`
      }
    }

    async function launchTaskSkillSession(sessionRemote, { workspaceId, prompt }) {
      const created = remoteValue(await sessionRemote.create({ workspaceId }))
      const sessionId = created?.sessionId
      if (!sessionId) throw new Error('session/create returned no sessionId')
      remoteValue(await sessionRemote.prompt({
        requestId: newSessionRequestId(),
        sessionId,
        mode: 'queue',
        content: [{ type: 'text', text: prompt }],
      }))
    }

    function buildTaskSkillPrompt({ platform, issue, detail }) {
      const source = detail && typeof detail === 'object' ? detail : {}
      const fallback = issue && typeof issue === 'object' ? issue : {}
      const pick = (key) => source[key] ?? fallback[key]
      const title = pick('title') || pick('subject') || ''
      const serial = pick('serialNumber') || pick('id') || ''
      const typeName = pick('workitemType')?.name || pick('categoryId') || ''
      const statusValue = pick('status')
      const statusName = (typeof statusValue === 'object'
        ? statusValue?.name || statusValue?.displayName
        : statusValue) || pick('statusName') || pick('logicalStatus') || ''
      const url = taskIssueUrl(platform, issue, detail)
      const platformLabel = platform === 'github' ? 'GitHub' : 'Codeup（云效）'
      const description = String(pick('description') || '').trim()
      return [
        '/grill-with-docs /to-spec /to-tickets /implement',
        '',
        `这是来自 ${platformLabel} 的任务，请按 Matt Pocock 技能流程完成开发修复：`,
        '',
        '1. 先用 grill-with-docs 拷问澄清需求与方案（必要时沉淀 ADR / 术语表）；',
        '2. 澄清后用 to-spec 综合产出 spec；',
        '3. 用 to-tickets 拆成可逐票实施的切片；',
        '4. 用 implement 逐票实现（驱动 tdd、类型检查，完成后 code-review 并提交到当前分支）。',
        '',
        '任务信息：',
        `- 平台：${platformLabel}`,
        title ? `- 标题：${title}` : false,
        serial ? `- 编号：${serial}` : false,
        typeName ? `- 类型：${typeName}` : false,
        statusName ? `- 状态：${statusName}` : false,
        url ? `- 链接：${url}` : false,
        '',
        '任务描述：',
        description || '（无描述）',
      ].filter(line => line !== false).join('\n')
    }

    function buildPrSkillPrompt({ platform, pr, detail }) {
      const source = detail && typeof detail === 'object' ? detail : {}
      const fallback = pr && typeof pr === 'object' ? pr : {}
      const pick = (key) => source[key] ?? fallback[key]
      const title = pick('title') || ''
      const serial = pick('serialNumber') || pick('id') || ''
      const repoName = pick('repositoryName') || pick('repositoryId') || ''
      const sourceBranch = pick('sourceBranch') || ''
      const targetBranch = pick('targetBranch') || ''
      const authorName = pick('author')?.name || ''
      const reviewers = displayNames(pick('reviewers'))
      const stateText = pick('state') || ''
      const hasConflict = pick('hasConflict')
      const external = prExternalLink(key => key, platform, pr, detail)
      const url = external?.href || ''
      const platformLabel = platform === 'github' ? 'GitHub' : 'Codeup（云效）'
      const description = String(pick('description') || '').trim()
      return [
        `这是来自 ${platformLabel} 的 Pull Request，请帮助处理与评审该 PR：`,
        '',
        '1. 检查当前仓库状态并切换到对应 PR 源分支（必要时先拉取远端分支）；',
        '2. 审阅变更内容，检查潜在缺陷、类型检查/测试与合并冲突情况；',
        '3. 结合 PR 描述与代码现状给出评审意见或完成必要的修改与验证。',
        '',
        'PR 信息：',
        `- 平台：${platformLabel}`,
        repoName ? `- 仓库：${repoName}` : false,
        title ? `- 标题：${title}` : false,
        serial ? `- 编号：${serial}` : false,
        stateText ? `- 状态：${stateText}` : false,
        (sourceBranch || targetBranch) ? `- 分支：${sourceBranch || '—'} -> ${targetBranch || '—'}` : false,
        authorName ? `- 创建人：${authorName}` : false,
        reviewers && reviewers !== '—' ? `- 评审人：${reviewers}` : false,
        hasConflict === true ? '- 合并状态：存在冲突' : false,
        url ? `- 链接：${url}` : false,
        '',
        'PR 描述：',
        description || '（无描述）',
      ].filter(line => line !== false).join('\n')
    }

    function DetailRow({ label, value }) {
      return h('div', { className: `${CN}__detailRow` },
        h('dt', null, label),
        h('dd', null, value || '—'),
      )
    }

    function IssueDetailPane({ t, rpc, platform, accountId, organizationId, issue }) {
      const [state, setState] = React.useState({ status: 'loading', detail: null, error: '' })
      const [copiedLink, setCopiedLink] = React.useState('')
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
      const labels = Array.isArray(detail.labels) ? detail.labels : []
      const externalLink = issueExternalLink(t, platform, issue, detail)
      const linkAddress = externalLink?.href || ''
      const linkCopied = Boolean(linkAddress) && copiedLink === linkAddress
      const onCopyLink = () => {
        if (!linkAddress) return
        void copyText(linkAddress).then(() => {
          setCopiedLink(linkAddress)
          setTimeout(() => setCopiedLink(current => (current === linkAddress ? '' : current)), 1600)
        }).catch(() => {})
      }

      return h('div', { className: `${CN}__detailScroll` },
        h('div', { className: `${CN}__detailHeader` },
          h('div', { className: `${CN}__detailHeaderMeta` },
            h('span', { className: `${CN}__issueSerial` }, detail.serialNumber || issue.serialNumber || issue.id),
            typeBadge && h('span', { className: `${CN}__issueBadge ${typeBadge.className}`.trim() }, typeBadge.label),
            h('span', { className: `${CN}__issueBadge ${statusClass}`.trim() }, statusName),
            relations.includes('assigned') && h('span', { className: `${CN}__issueBadge ${CN}__issueBadgeRelation` }, t('relationAssigned')),
            relations.includes('participant') && h('span', { className: `${CN}__issueBadge ${CN}__issueBadgeRelation` }, t('relationParticipant')),
          ),
          h('div', { className: `${CN}__detailHeaderActions` },
            externalLink && h('a', {
              className: `${CN}__openLink`, href: externalLink.href, target: '_blank',
              rel: 'noopener noreferrer',
            }, externalLink.label, h(ExternalIcon)),
            h('button', {
              type: 'button',
              className: `${CN}__button`,
              'data-action': 'copy-issue-link',
              disabled: !linkAddress,
              onClick: onCopyLink,
            }, h(CopyIcon), linkCopied ? t('copied') : t('issueCopyLink')),
          ),
        ),
        h('h3', { className: `${CN}__detailTitle` }, detail.title || detail.subject || issue.title || issue.id),
        state.status === 'loading' && h('p', { className: `${CN}__status`, role: 'status' }, t('detailLoading')),
        state.status === 'error' && h('p', { className: `${CN}__error`, role: 'alert' }, state.error),
        state.status === 'ready' && h('div', { className: `${CN}__detailBody` },
          h('dl', { className: `${CN}__detailGrid` },
            h(DetailRow, { label: platform === 'github' ? t('repository') : t('project'), value: detail.space?.name || issue.space?.name }),
            h(DetailRow, { label: t('type'), value: detail.workitemType?.name || detail.categoryId }),
            h(DetailRow, { label: t('status'), value: statusName }),
            h(DetailRow, { label: t('assignedTo'), value: detail.assignedTo?.name }),
            h(DetailRow, { label: t('participants'), value: displayNames(detail.participants) }),
            h(DetailRow, { label: t('creator'), value: detail.creator?.name }),
            labels.length > 0 && h(DetailRow, { label: t('labels'), value: displayNames(labels) }),
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

    function IssueListItem({ t, issue, selected, cloning, onSelect, onStartOrContinue }) {
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
          disabled: Boolean(cloning),
          onClick: (event) => {
            event.stopPropagation()
            onSelect()
            onStartOrContinue?.(issue, actionKind)
          },
        }, actionKind === 'start' ? t('actionStart') : t('actionContinue')),
      ))
    }

    function cloneResultBadge(t, status) {
      if (status === 'cloned') return { label: t('cloneStatusCloned'), className: `${CN}__issueBadgeDone` }
      if (status === 'exists') return { label: t('cloneStatusExists'), className: `${CN}__issueBadgeActive` }
      return { label: t('cloneStatusFailed'), className: `${CN}__issueBadgeTypeBug` }
    }

    function TaskCloneModal({ t, platform, cloneState, onClose, onRetry }) {
      const open = cloneState.status !== 'idle'
      if (!open) return null

      const issue = cloneState.issue || {}
      const issueLabel = issue.serialNumber || issue.id || ''
      const actionTitle = cloneState.actionKind === 'continue'
        ? t('cloneModalTitleContinue')
        : t('cloneModalTitleStart')
      const title = issueLabel ? `${actionTitle} · ${issueLabel}` : actionTitle
      const results = Array.isArray(cloneState.results) ? cloneState.results : []
      const hasFailure = results.some(item => item.status === 'failed')
      const externalLink = issueExternalLink(t, platform, issue, issue)

      const footer = [
        (cloneState.status === 'error' || (cloneState.status === 'done' && hasFailure)) && h('button', {
          key: 'retry',
          type: 'button',
          className: `${CN}__button`,
          onClick: onRetry,
        }, t('retry')),
        h('button', {
          key: 'close',
          type: 'button',
          className: `${CN}__button ${CN}__buttonPrimary`,
          onClick: onClose,
        }, t('close')),
      ].filter(Boolean)

      return h(DialogModal, {
        open: true,
        title,
        closeLabel: t('close'),
        onClose,
        footer,
      },
      h('div', { className: `${CN}__cloneModalBody` },
        (issue.title || issue.subject) && h('p', { className: `${CN}__cloneIssueTitle` }, issue.title || issue.subject),
        cloneState.status === 'loading' && h('p', { className: `${CN}__status`, role: 'status' }, t('cloneLoading')),
        cloneState.status === 'opening-workspace' && h('p', { className: `${CN}__status`, role: 'status' }, t('cloneOpeningWorkspace')),
        cloneState.status === 'starting-agent' && h('p', { className: `${CN}__status`, role: 'status' }, t('cloneStartingAgent')),
        cloneState.status === 'empty' && h('div', { className: `${CN}__cloneEmpty`, role: 'alert' },
          h('p', { className: `${CN}__warning` }, t('cloneNoRepos')),
          externalLink && h('a', {
            className: `${CN}__openLink`,
            href: externalLink.href,
            target: '_blank',
            rel: 'noopener noreferrer',
          }, externalLink.label, h(ExternalIcon)),
        ),
        cloneState.status === 'error' && h('p', { className: `${CN}__error`, role: 'alert' }, cloneState.error),
        cloneState.status === 'done' && h('div', { className: `${CN}__cloneDone` },
          cloneState.baseDir && h('p', { className: `${CN}__hint` }, `${t('cloneTargetDir')}：${cloneState.baseDir}`),
          h('p', {
            className: hasFailure ? `${CN}__warning` : `${CN}__cloneSummary`,
            role: 'status',
          }, hasFailure ? t('clonePartialFailure') : t('cloneAllSuccess')),
          cloneState.error && h('p', { className: `${CN}__error`, role: 'alert' }, cloneState.error),
          h('ul', { className: `${CN}__cloneList` }, results.map((item, idx) => {
            const badge = cloneResultBadge(t, item.status)
            return h('li', { key: `${item.targetDir || item.name}-${idx}`, className: `${CN}__cloneItem` },
              h('div', { className: `${CN}__cloneItemTop` },
                h('span', { className: `${CN}__cloneRepoName` }, item.name || item.path),
                h('span', { className: `${CN}__issueBadge ${badge.className}`.trim() }, badge.label),
              ),
              item.targetDir && h('div', { className: `${CN}__clonePath` }, item.targetDir),
              item.error && h('div', { className: `${CN}__cloneItemError` }, item.error),
            )
          })),
        ),
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

    function formatTotalSummary(t, { loadedCount, hasMore, totalCount, countStatus, countTruncated, unitLabel }) {
      const unit = unitLabel || t('issueCount')
      const plus = countTruncated ? '+' : ''
      if (typeof totalCount === 'number' && Number.isFinite(totalCount)) {
        const displayTotal = Math.max(totalCount, loadedCount)
        if (hasMore && loadedCount < displayTotal) {
          return `${t('totalPrefix')} ${displayTotal}${plus} ${unit}（${t('loadedCount')} ${loadedCount}）`
        }
        return `${t('totalPrefix')} ${displayTotal}${plus} ${unit}`
      }
      if (!hasMore) {
        return `${t('totalPrefix')} ${loadedCount} ${unit}`
      }
      if (countStatus === 'loading') {
        return `${t('loadedCount')} ${loadedCount} ${unit} · ${t('countingTotal')}`
      }
      return `${t('loadedCount')} ${loadedCount}+ ${unit}`
    }

    function IssueWorkbench({ t, rpc, workspaces, uiWorkspace, sessionRemote, account, accountTools }) {
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
      const [cloneState, setCloneState] = React.useState({
        status: 'idle',
        issue: null,
        actionKind: 'start',
        baseDir: '',
        results: [],
        error: '',
      })
      const sentinelRef = React.useRef(null)
      const loadMoreControllerRef = React.useRef(null)
      const countControllerRef = React.useRef(null)
      const cloneControllerRef = React.useRef(null)
      const loadingMoreRef = React.useRef(false)
      const queryKeyRef = React.useRef('')
      const isGitHub = account.platform === 'github'
      const isSupportedPlatform = SUPPORTED_ISSUE_PLATFORMS.has(account.platform)
      const canLoad = isSupportedPlatform && Boolean(rpc)
      const canLaunchSkillSession = Boolean(
        sessionRemote
        && typeof sessionRemote.create === 'function'
        && typeof sessionRemote.prompt === 'function',
      )

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
      const selectedOrganizationId = organizationId || data?.selectedOrganizationId || (isGitHub ? 'all' : '')
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
            : (error.message || (isGitHub ? t('loadMoreGithubError') : t('loadMoreError')))
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

      const startCloneRepos = React.useCallback((issue, actionKind = 'start') => {
        if (!canLoad || !issue?.id) return
        const orgId = issue.organizationId || data?.selectedOrganizationId || selectedOrganizationId
        cloneControllerRef.current?.abort()
        const controller = new AbortController()
        cloneControllerRef.current = controller
        setCloneState({
          status: 'loading',
          issue,
          actionKind,
          baseDir: '',
          results: [],
          error: '',
        })
        const detailPromise = callRpc(rpc, 'detail', {
          accountId: account.id,
          organizationId: orgId,
          issueId: issue.id,
        }, controller.signal).catch(() => null)
        void callRpc(rpc, 'cloneRepos', {
          accountId: account.id,
          organizationId: orgId,
          issueId: issue.id,
        }, controller.signal).then(async (result) => {
          if (controller.signal.aborted) return
          const results = Array.isArray(result?.results) ? result.results : []
          if (result?.empty || results.length === 0) {
            if (cloneControllerRef.current === controller) cloneControllerRef.current = null
            setCloneState({
              status: 'empty',
              issue,
              actionKind,
              baseDir: result?.baseDir || '',
              results: [],
              error: '',
            })
            return
          }

          const readyRepos = results.filter(
            item => (item.status === 'cloned' || item.status === 'exists') && item.targetDir,
          )
          const hasFailure = results.some(item => item.status === 'failed')
          const canOpenWorkspace = Boolean(
            !hasFailure
            && readyRepos.length > 0
            && workspaces
            && typeof workspaces.create === 'function'
            && uiWorkspace
            && typeof uiWorkspace.openWorkspace === 'function',
          )

          if (canOpenWorkspace) {
            setCloneState({
              status: 'opening-workspace',
              issue,
              actionKind,
              baseDir: result?.baseDir || '',
              results,
              error: '',
            })
            try {
              let primaryWorkspace = null
              for (const repo of readyRepos) {
                if (controller.signal.aborted) return
                const created = await workspaces.create({ path: repo.targetDir })
                if (!primaryWorkspace && created?.workspaceId) {
                  primaryWorkspace = created
                }
              }
              if (controller.signal.aborted) return
              if (primaryWorkspace?.workspaceId) {
                await uiWorkspace.openWorkspace(primaryWorkspace.workspaceId)
              }
              if (controller.signal.aborted) return
              if (primaryWorkspace?.workspaceId && canLaunchSkillSession) {
                setCloneState({
                  status: 'starting-agent',
                  issue,
                  actionKind,
                  baseDir: result?.baseDir || '',
                  results,
                  error: '',
                })
                const detail = await detailPromise
                if (controller.signal.aborted) return
                try {
                  await launchTaskSkillSession(sessionRemote, {
                    workspaceId: primaryWorkspace.workspaceId,
                    prompt: buildTaskSkillPrompt({
                      platform: account.platform,
                      issue,
                      detail,
                    }),
                  })
                } catch (skillError) {
                  if (controller.signal.aborted) return
                  if (cloneControllerRef.current === controller) cloneControllerRef.current = null
                  const skillMsg = skillError instanceof Error ? skillError.message : String(skillError || '')
                  setCloneState({
                    status: 'done',
                    issue,
                    actionKind,
                    baseDir: result?.baseDir || '',
                    results,
                    error: `${t('skillKickoffError')} ${skillMsg}`.trim(),
                  })
                  return
                }
              }
              if (controller.signal.aborted) return
              if (cloneControllerRef.current === controller) cloneControllerRef.current = null
              setCloneState({
                status: 'idle',
                issue: null,
                actionKind: 'start',
                baseDir: '',
                results: [],
                error: '',
              })
              return
            } catch (workspaceError) {
              if (controller.signal.aborted) return
              if (cloneControllerRef.current === controller) cloneControllerRef.current = null
              const detailMsg = workspaceError instanceof Error ? workspaceError.message : String(workspaceError || '')
              setCloneState({
                status: 'done',
                issue,
                actionKind,
                baseDir: result?.baseDir || '',
                results,
                error: `${t('cloneWorkspaceError')} ${detailMsg}`.trim(),
              })
              return
            }
          }

          if (cloneControllerRef.current === controller) cloneControllerRef.current = null
          setCloneState({
            status: 'done',
            issue,
            actionKind,
            baseDir: result?.baseDir || '',
            results,
            error: '',
          })
        }).catch((error) => {
          if (controller.signal.aborted) return
          if (cloneControllerRef.current === controller) cloneControllerRef.current = null
          const message = error?.code === 'host-not-loaded'
            ? t('hostNotLoaded')
            : (error.message || t('cloneError'))
          setCloneState({
            status: 'error',
            issue,
            actionKind,
            baseDir: '',
            results: [],
            error: message,
          })
        })
      }, [canLoad, canLaunchSkillSession, data?.selectedOrganizationId, selectedOrganizationId, rpc, workspaces, uiWorkspace, sessionRemote, account.id, account.platform, t])

      const closeCloneModal = React.useCallback(() => {
        cloneControllerRef.current?.abort()
        cloneControllerRef.current = null
        setCloneState({
          status: 'idle',
          issue: null,
          actionKind: 'start',
          baseDir: '',
          results: [],
          error: '',
        })
      }, [])

      React.useEffect(() => () => {
        cloneControllerRef.current?.abort()
        cloneControllerRef.current = null
      }, [])

      if (!isSupportedPlatform) {
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

      const orgOptions = isGitHub
        ? [
            { value: 'all', label: t('allOwners') },
            ...organizations.map(item => ({ value: item.id, label: item.name })),
          ]
        : organizations.map(item => ({ value: item.id, label: item.name }))
      const projectOptions = [
        { value: 'all', label: isGitHub ? t('allRepositories') : t('allProjects') },
        ...projects.map(item => ({ value: item.id, label: item.name })),
      ]
      const summaryText = formatTotalSummary(t, {
        loadedCount: items.length,
        hasMore,
        totalCount: effectiveTotalCount,
        countStatus: countState.status,
        countTruncated: countState.truncated || Boolean(data?.truncated),
        unitLabel: isGitHub ? t('githubIssueCount') : t('issueCount'),
      })

      return h('section', { className: `${CN}__issues`, 'aria-label': isGitHub ? t('githubIssues') : t('issues'), 'aria-busy': loading || loadingMore },
        h('div', { className: `${CN}__issueToolbar` },
          h('div', { className: `${CN}__issueToolbarLeft` }, accountTools),
          h('div', { className: `${CN}__issueToolbarRight` },
            data && h(NativeSelect, {
              className: `${CN}__filterSelect`,
              value: selectedOrganizationId,
              options: orgOptions,
              disabled: loading || orgOptions.length === 0 || (isGitHub && organizations.length === 0),
              ariaLabel: isGitHub ? t('owner') : t('organization'),
              placeholder: isGitHub ? t('allOwners') : t('organization'),
              onChange: nextOrg => { setOrganizationId(nextOrg); setProjectId('all') },
            }),
            data && h(NativeSelect, {
              className: `${CN}__filterSelect`,
              value: selectedProjectId,
              options: projectOptions,
              disabled: loading || projects.length === 0,
              ariaLabel: isGitHub ? t('repository') : t('project'),
              placeholder: isGitHub ? t('allRepositories') : t('allProjects'),
              onChange: nextProject => setProjectId(nextProject),
            }),
            h('button', {
              type: 'button', className: `${CN}__button`, disabled: loading,
              onClick: () => setReload(value => value + 1),
            }, h(RefreshIcon), loading ? t('refreshing') : t('refresh')),
          ),
        ),
        loading && h('p', { className: `${CN}__status`, role: 'status' }, isGitHub ? t('githubIssuesLoading') : t('issuesLoading')),
        state.status === 'error' && h('div', { className: `${CN}__issueError`, role: 'alert' },
          h('p', { className: `${CN}__error` }, state.error),
          h('button', { type: 'button', className: `${CN}__button`, onClick: () => setReload(value => value + 1) }, t('retry')),
        ),
        !isGitHub && data && !loading && organizations.length === 0 && h('p', { className: `${CN}__status` }, t('noOrganizations')),
        !isGitHub && data && !loading && organizations.length > 0 && projects.length === 0 && h('p', { className: `${CN}__status` }, t('noProjects')),
        isGitHub && data && !loading && items.length === 0 && projects.length === 0 && h('p', { className: `${CN}__status` }, t('noRepositories')),
        (data?.truncated || countState.truncated) && h('p', { className: `${CN}__warning`, role: 'status' }, t('truncated')),
        !isGitHub && data && !loading && items.length === 0 && organizations.length > 0 && projects.length > 0 && h('div', { className: `${CN}__issueEmpty` },
          h('h3', null, t('noIssues')),
          h('p', null, t('noIssuesDescription')),
        ),
        isGitHub && data && !loading && items.length === 0 && projects.length > 0 && h('div', { className: `${CN}__issueEmpty` },
          h('h3', null, t('noGithubIssues')),
          h('p', null, t('noGithubIssuesDescription')),
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
                  cloning: (cloneState.status === 'loading' || cloneState.status === 'opening-workspace')
                    && cloneState.issue?.id === issue.id,
                  onSelect: () => setSelectedIssueId(issue.id),
                  onStartOrContinue: startCloneRepos,
                })),
              !loading && hasMore && h('div', {
                ref: sentinelRef, className: `${CN}__loadMoreSentinel`, 'aria-hidden': true,
              }),
              !loading && loadingMore && h('p', {
                className: `${CN}__status ${CN}__loadMoreStatus`, role: 'status',
              }, isGitHub ? t('loadingMoreGithub') : t('loadingMore')),
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
              }, isGitHub ? t('noMoreGithubIssues') : t('noMoreIssues')),
            ),
          ),
          h('div', { className: `${CN}__detailPane` },
            h(IssueDetailPane, {
              t,
              rpc,
              platform: account.platform,
              accountId: account.id,
              organizationId: activeIssue?.organizationId || data?.selectedOrganizationId || selectedOrganizationId,
              issue: activeIssue,
            }),
          ),
        ),
        h(TaskCloneModal, {
          t,
          platform: account.platform,
          cloneState,
          onClose: closeCloneModal,
          onRetry: () => startCloneRepos(cloneState.issue, cloneState.actionKind),
        }),
      )
    }

    function mergeRepoItems(existingItems, incomingItems) {
      const byId = new Map()
      for (const item of existingItems) {
        if (item?.id) byId.set(item.id, item)
      }
      for (const item of incomingItems) {
        if (item?.id) byId.set(item.id, item)
      }
      return [...byId.values()]
    }

    function RepoListItem({ t, repo, selected, onSelect }) {
      const visBadge = repoVisibilityBadge(t, repo.visibility)
      const displayTitle = repo.name || repo.fullName || repo.path || repo.id
      const subtitle = repo.fullName || repo.pathWithNamespace || repo.owner || '—'

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
        h('div', { className: `${CN}__issueTitle`, title: subtitle }, displayTitle),
      ),
      h('div', { className: `${CN}__issueBottomRow` },
        h('div', { className: `${CN}__issueInfoCol` },
          h('div', { className: `${CN}__issueBadges` },
            visBadge && h('span', { className: `${CN}__issueBadge ${visBadge.className}`.trim() }, visBadge.label),
            repo.language && h('span', { className: `${CN}__issueBadge ${CN}__issueBadgeRelation` }, repo.language),
            repo.archived && h('span', { className: `${CN}__issueBadge ${CN}__issueBadgeVerify` }, t('repoArchived')),
            repo.isFork && h('span', { className: `${CN}__issueBadge` }, t('repoFork')),
          ),
          h('div', { className: `${CN}__issueMeta` },
            h('span', null, subtitle),
            h('span', null, formatDate(repo.gmtModified)),
          ),
        ),
      ))
    }

    function RepoDetailPane({ t, platform, repo, cloning, onClone }) {
      const [copiedAddress, setCopiedAddress] = React.useState('')
      if (!repo) {
        return h('div', { className: `${CN}__detailEmpty` }, t('selectRepoPrompt'))
      }

      const visBadge = repoVisibilityBadge(t, repo.visibility)
      const externalLink = repoExternalLink(t, platform, repo)
      const hasCloneUrl = Boolean(repo.httpUrl || repo.sshUrl)
      const copyAddress = repo.httpUrl || repo.sshUrl || ''
      const addressCopied = Boolean(copyAddress) && copiedAddress === copyAddress
      const onCopyAddress = () => {
        if (!copyAddress) return
        void copyText(copyAddress).then(() => {
          setCopiedAddress(copyAddress)
          setTimeout(() => setCopiedAddress(current => (current === copyAddress ? '' : current)), 1600)
        }).catch(() => {})
      }

      return h('div', { className: `${CN}__detailScroll` },
        h('div', { className: `${CN}__detailHeader` },
          h('div', { className: `${CN}__detailHeaderMeta` },
            visBadge && h('span', { className: `${CN}__issueBadge ${visBadge.className}`.trim() }, visBadge.label),
            repo.language && h('span', { className: `${CN}__issueBadge ${CN}__issueBadgeRelation` }, repo.language),
            repo.archived && h('span', { className: `${CN}__issueBadge ${CN}__issueBadgeVerify` }, t('repoArchived')),
            repo.isFork && h('span', { className: `${CN}__issueBadge` }, t('repoFork')),
          ),
          h('div', { className: `${CN}__detailHeaderActions` },
            externalLink && h('a', {
              className: `${CN}__openLink`,
              href: externalLink.href,
              target: '_blank',
              rel: 'noopener noreferrer',
            }, externalLink.label, h(ExternalIcon)),
            h('button', {
              type: 'button',
              className: `${CN}__button`,
              'data-action': 'copy-repo-address',
              disabled: !hasCloneUrl,
              onClick: onCopyAddress,
            }, h(CopyIcon), addressCopied ? t('copied') : t('repoCopyAddress')),
            h('button', {
              type: 'button',
              className: `${CN}__button ${CN}__buttonPrimary`,
              'data-action': 'clone-repo',
              disabled: Boolean(cloning) || !hasCloneUrl,
              onClick: () => onClone?.(repo),
            }, h(DownloadIcon), cloning ? t('cloningToLocal') : t('cloneToLocal')),
          ),
        ),
        h('h3', { className: `${CN}__detailTitle` }, repo.name || repo.fullName || repo.pathWithNamespace || repo.id),
        h('div', { className: `${CN}__detailBody` },
          h('dl', { className: `${CN}__detailGrid` },
            h(DetailRow, { label: platform === 'github' ? t('owner') : t('repoNamespace'), value: repo.owner || '—' }),
            visBadge && h(DetailRow, { label: t('repoVisibility'), value: visBadge.label }),
            repo.defaultBranch && h(DetailRow, { label: t('repoDefaultBranch'), value: repo.defaultBranch }),
            repo.language && h(DetailRow, { label: t('repoLanguage'), value: repo.language }),
            typeof repo.starCount === 'number' && h(DetailRow, { label: t('repoStars'), value: String(repo.starCount) }),
            typeof repo.forkCount === 'number' && h(DetailRow, { label: t('repoForks'), value: String(repo.forkCount) }),
            typeof repo.openIssuesCount === 'number' && h(DetailRow, { label: t('repoOpenIssues'), value: String(repo.openIssuesCount) }),
            h(DetailRow, { label: t('createdAt'), value: formatDate(repo.gmtCreate) }),
            h(DetailRow, { label: t('updatedAt'), value: formatDate(repo.gmtModified) }),
          ),
          h('section', { className: `${CN}__descriptionSection`, 'aria-label': t('repoDescription') },
            h('h4', null, t('repoDescription')),
            h('div', {
              className: repo.description
                ? `${CN}__description`
                : `${CN}__description ${CN}__descriptionEmpty`,
            }, repo.description || t('repoNoDescription')),
          ),
          hasCloneUrl && h('section', { className: `${CN}__repoCloneUrls`, 'aria-label': t('repoCloneUrls') },
            h('h4', null, t('repoCloneUrls')),
            repo.httpUrl && h('div', { className: `${CN}__repoCloneUrlCard` },
              h('span', { className: `${CN}__repoCloneUrlLabel` }, t('repoCloneHttps')),
              h('div', { className: `${CN}__clonePath` }, repo.httpUrl),
            ),
            repo.sshUrl && h('div', { className: `${CN}__repoCloneUrlCard` },
              h('span', { className: `${CN}__repoCloneUrlLabel` }, t('repoCloneSsh')),
              h('div', { className: `${CN}__clonePath` }, repo.sshUrl),
            ),
          ),
        ),
      )
    }

    function RepoCloneModal({ t, cloneState, canCreateWorkspace, onClose, onRetry, onCreateWorkspace }) {
      const open = cloneState.status !== 'idle'
      if (!open) return null

      const repo = cloneState.repo || {}
      const repoLabel = repo.fullName || repo.pathWithNamespace || repo.name || ''
      const title = repoLabel ? `${t('repoCloneModalTitle')} · ${repoLabel}` : t('repoCloneModalTitle')
      const results = Array.isArray(cloneState.results) ? cloneState.results : []
      const primaryResult = results[0] || null
      const hasFailure = results.length === 0 || results.some(item => item.status === 'failed')
      const readyRepo = results.find(
        item => (item.status === 'cloned' || item.status === 'exists') && item.targetDir,
      ) || null
      const showWorkspacePrompt = cloneState.status === 'done' && !hasFailure && Boolean(readyRepo) && Boolean(canCreateWorkspace)

      let footer
      if (cloneState.status === 'loading') {
        footer = [
          h('button', {
            key: 'cancel',
            type: 'button',
            className: `${CN}__button`,
            onClick: onClose,
          }, t('cancel')),
        ]
      } else if (cloneState.status === 'creating-workspace') {
        footer = [
          h('button', {
            key: 'close',
            type: 'button',
            className: `${CN}__button`,
            disabled: true,
          }, t('close')),
        ]
      } else if (showWorkspacePrompt) {
        footer = [
          h('button', {
            key: 'cancel-workspace',
            type: 'button',
            className: `${CN}__button`,
            'data-action': 'dismiss-workspace',
            onClick: onClose,
          }, t('repoCreateWorkspaceCancel')),
          h('button', {
            key: 'create-workspace',
            type: 'button',
            className: `${CN}__button ${CN}__buttonPrimary`,
            'data-action': 'confirm-workspace',
            onClick: () => onCreateWorkspace?.(readyRepo),
          }, t('repoCreateWorkspaceConfirm')),
        ]
      } else {
        footer = [
          (cloneState.status === 'error' || (cloneState.status === 'done' && hasFailure)) && h('button', {
            key: 'retry',
            type: 'button',
            className: `${CN}__button`,
            onClick: onRetry,
          }, t('retry')),
          h('button', {
            key: 'close',
            type: 'button',
            className: `${CN}__button ${CN}__buttonPrimary`,
            onClick: onClose,
          }, t('close')),
        ].filter(Boolean)
      }

      return h(DialogModal, {
        open: true,
        title,
        closeLabel: t('close'),
        onClose: cloneState.status === 'creating-workspace' ? () => {} : onClose,
        footer,
      },
      h('div', { className: `${CN}__cloneModalBody` },
        cloneState.status === 'loading' && h('p', { className: `${CN}__status`, role: 'status' }, t('repoCloneLoading')),
        cloneState.status === 'creating-workspace' && h('p', { className: `${CN}__status`, role: 'status' }, t('cloneOpeningWorkspace')),
        cloneState.status === 'empty' && h('p', { className: `${CN}__warning`, role: 'alert' }, t('repoCloneNotFound')),
        cloneState.status === 'error' && h('p', { className: `${CN}__error`, role: 'alert' }, cloneState.error),
        cloneState.status === 'done' && h('div', { className: `${CN}__cloneDone` },
          cloneState.baseDir && h('p', { className: `${CN}__hint` }, `${t('cloneTargetDir')}：${cloneState.baseDir}`),
          h('p', {
            className: hasFailure ? `${CN}__warning` : `${CN}__cloneSummary`,
            role: 'status',
          }, hasFailure
            ? t('repoCloneFailed')
            : (primaryResult?.status === 'exists' ? t('repoCloneExists') : t('repoCloneSuccess'))),
          cloneState.error && h('p', { className: `${CN}__error`, role: 'alert' }, cloneState.error),
          h('ul', { className: `${CN}__cloneList` }, results.map((item, idx) => {
            const badge = cloneResultBadge(t, item.status)
            return h('li', { key: `${item.targetDir || item.name}-${idx}`, className: `${CN}__cloneItem` },
              h('div', { className: `${CN}__cloneItemTop` },
                h('span', { className: `${CN}__cloneRepoName` }, item.name || item.path),
                h('span', { className: `${CN}__issueBadge ${badge.className}`.trim() }, badge.label),
              ),
              item.targetDir && h('div', { className: `${CN}__clonePath` }, item.targetDir),
              item.error && h('div', { className: `${CN}__cloneItemError` }, item.error),
            )
          })),
          showWorkspacePrompt && h('div', { className: `${CN}__workspacePrompt`, role: 'region', 'aria-live': 'polite' },
            h('p', { className: `${CN}__workspacePromptText` }, t('repoCreateWorkspacePrompt')),
          ),
        ),
      ))
    }

    function RepoWorkbench({ t, rpc, workspaces, uiWorkspace, account, accountTools }) {
      const [organizationId, setOrganizationId] = React.useState('')
      const [searchInput, setSearchInput] = React.useState('')
      const [searchQuery, setSearchQuery] = React.useState('')
      const [reload, setReload] = React.useState(0)
      const [selectedRepoId, setSelectedRepoId] = React.useState(null)
      const [state, setState] = React.useState({
        status: 'loading',
        data: null,
        error: '',
        loadingMore: false,
        loadMoreError: '',
      })
      const [cloneState, setCloneState] = React.useState({
        status: 'idle',
        repo: null,
        baseDir: '',
        results: [],
        error: '',
      })
      const sentinelRef = React.useRef(null)
      const loadMoreControllerRef = React.useRef(null)
      const cloneControllerRef = React.useRef(null)
      const loadingMoreRef = React.useRef(false)
      const queryKeyRef = React.useRef('')
      const isGitHub = account.platform === 'github'
      const isSupportedPlatform = SUPPORTED_ISSUE_PLATFORMS.has(account.platform)
      const canLoad = isSupportedPlatform && Boolean(rpc)
      const canCreateWorkspace = Boolean(workspaces && typeof workspaces.create === 'function')

      React.useEffect(() => {
        const trimmed = searchInput.trim()
        if (trimmed === searchQuery) return
        if (typeof setTimeout !== 'function') {
          setSearchQuery(trimmed)
          return
        }
        const timer = setTimeout(() => {
          setSearchQuery(trimmed)
        }, 300)
        return () => clearTimeout(timer)
      }, [searchInput, searchQuery])

      React.useEffect(() => {
        if (!canLoad) return
        const queryKey = `${account.id}\0${organizationId}\0${searchQuery}\0${reload}`
        queryKeyRef.current = queryKey
        loadMoreControllerRef.current?.abort()
        loadMoreControllerRef.current = null
        loadingMoreRef.current = false
        const controller = new AbortController()
        setSelectedRepoId(null)
        setState(previous => ({
          status: 'loading',
          data: previous.data,
          error: '',
          loadingMore: false,
          loadMoreError: '',
        }))
        void callRpc(rpc, 'listRepos', {
          accountId: account.id,
          organizationId,
          search: searchQuery,
          page: 1,
          pageSize: WORKITEM_PAGE_SIZE,
        }, controller.signal).then(data => {
          if (controller.signal.aborted || queryKeyRef.current !== queryKey) return
          const loadedItems = data?.items ?? []
          setSelectedRepoId(loadedItems[0]?.id ?? null)
          setState({ status: 'ready', data, error: '', loadingMore: false, loadMoreError: '' })
        }).catch(error => {
          if (controller.signal.aborted || queryKeyRef.current !== queryKey) return
          const message = error?.code === 'host-not-loaded'
            ? t('hostNotLoaded')
            : (error.message || t('repoUnavailable'))
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
      }, [rpc, account.id, account.platform, canLoad, organizationId, searchQuery, reload, t])

      const data = state.data
      const loading = state.status === 'loading'
      const loadingMore = Boolean(state.loadingMore)
      const loadMoreError = state.loadMoreError || ''
      const organizations = data?.organizations ?? []
      const items = data?.items ?? []
      const hasMore = Boolean(data?.hasMore && data?.nextPage)
      const selectedOrganizationId = organizationId || data?.selectedOrganizationId || (isGitHub ? 'all' : '')
      const activeRepo = items.find(item => item.id === selectedRepoId) ?? items[0] ?? null
      const effectiveTotalCount = !hasMore
        ? items.length
        : (typeof data?.totalCount === 'number' ? data.totalCount : null)

      const loadMore = React.useCallback(() => {
        if (!canLoad || state.status !== 'ready' || loadingMoreRef.current) return
        const nextPage = state.data?.nextPage
        if (!state.data?.hasMore || !nextPage) return
        const queryKey = queryKeyRef.current
        loadingMoreRef.current = true
        loadMoreControllerRef.current?.abort()
        const controller = new AbortController()
        loadMoreControllerRef.current = controller
        setState(previous => ({ ...previous, loadingMore: true, loadMoreError: '' }))
        void callRpc(rpc, 'listRepos', {
          accountId: account.id,
          organizationId: selectedOrganizationId,
          search: searchQuery,
          page: nextPage,
          pageSize: WORKITEM_PAGE_SIZE,
        }, controller.signal).then(nextData => {
          if (controller.signal.aborted || queryKeyRef.current !== queryKey) return
          loadingMoreRef.current = false
          if (loadMoreControllerRef.current === controller) loadMoreControllerRef.current = null
          const nextHasMore = Boolean(nextData?.hasMore && nextData?.nextPage)
          setState(previous => {
            const prevData = previous.data || {}
            const mergedItems = mergeRepoItems(prevData.items ?? [], nextData?.items ?? [])
            return {
              ...previous,
              loadingMore: false,
              loadMoreError: '',
              data: {
                ...prevData,
                ...nextData,
                organizations: nextData?.organizations?.length ? nextData.organizations : (prevData.organizations ?? []),
                items: mergedItems,
                totalCount: typeof nextData?.totalCount === 'number'
                  ? nextData.totalCount
                  : (!nextHasMore ? mergedItems.length : (prevData.totalCount ?? null)),
                hasMore: nextHasMore,
                nextPage: nextData?.nextPage ?? null,
                truncated: Boolean(prevData.truncated || nextData?.truncated),
              },
            }
          })
        }).catch(error => {
          if (controller.signal.aborted || queryKeyRef.current !== queryKey) return
          loadingMoreRef.current = false
          if (loadMoreControllerRef.current === controller) loadMoreControllerRef.current = null
          const message = error?.code === 'host-not-loaded'
            ? t('hostNotLoaded')
            : (error.message || t('loadMoreReposError'))
          setState(previous => ({ ...previous, loadingMore: false, loadMoreError: message }))
        })
      }, [canLoad, state.status, state.data, rpc, account.id, selectedOrganizationId, searchQuery, t])

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

      const startCloneRepo = React.useCallback((repo) => {
        if (!canLoad || !repo?.id) return
        const orgId = repo.organizationId || data?.selectedOrganizationId || selectedOrganizationId
        cloneControllerRef.current?.abort()
        const controller = new AbortController()
        cloneControllerRef.current = controller
        setCloneState({
          status: 'loading',
          repo,
          baseDir: '',
          results: [],
          error: '',
        })
        void callRpc(rpc, 'cloneRepo', {
          accountId: account.id,
          organizationId: orgId,
          repositoryId: repo.id,
        }, controller.signal).then((result) => {
          if (controller.signal.aborted) return
          if (cloneControllerRef.current === controller) cloneControllerRef.current = null
          const results = Array.isArray(result?.results) ? result.results : []
          if (result?.empty || results.length === 0) {
            setCloneState({
              status: 'empty',
              repo,
              baseDir: result?.baseDir || '',
              results: [],
              error: '',
            })
            return
          }
          setCloneState({
            status: 'done',
            repo,
            baseDir: result?.baseDir || '',
            results,
            error: '',
          })
        }).catch((error) => {
          if (controller.signal.aborted) return
          if (cloneControllerRef.current === controller) cloneControllerRef.current = null
          const message = error?.code === 'host-not-loaded'
            ? t('hostNotLoaded')
            : (error.message || t('repoCloneError'))
          setCloneState({
            status: 'error',
            repo,
            baseDir: '',
            results: [],
            error: message,
          })
        })
      }, [canLoad, data?.selectedOrganizationId, selectedOrganizationId, rpc, account.id, t])

      const createWorkspaceForRepo = React.useCallback((readyRepo) => {
        if (!readyRepo?.targetDir || !canCreateWorkspace) return
        cloneControllerRef.current?.abort()
        const controller = new AbortController()
        cloneControllerRef.current = controller
        setCloneState(previous => ({
          ...previous,
          status: 'creating-workspace',
          error: '',
        }))
        void (async () => {
          try {
            const created = await workspaces.create({ path: readyRepo.targetDir })
            if (controller.signal.aborted) return
            if (created?.workspaceId && uiWorkspace && typeof uiWorkspace.openWorkspace === 'function') {
              await uiWorkspace.openWorkspace(created.workspaceId)
            }
            if (controller.signal.aborted) return
            if (cloneControllerRef.current === controller) cloneControllerRef.current = null
            setCloneState({
              status: 'idle',
              repo: null,
              baseDir: '',
              results: [],
              error: '',
            })
          } catch (workspaceError) {
            if (controller.signal.aborted) return
            if (cloneControllerRef.current === controller) cloneControllerRef.current = null
            const detailMsg = workspaceError instanceof Error ? workspaceError.message : String(workspaceError || '')
            setCloneState(previous => ({
              ...previous,
              status: 'done',
              error: `${t('cloneWorkspaceError')} ${detailMsg}`.trim(),
            }))
          }
        })()
      }, [canCreateWorkspace, workspaces, uiWorkspace, t])

      const closeCloneModal = React.useCallback(() => {
        cloneControllerRef.current?.abort()
        cloneControllerRef.current = null
        setCloneState({
          status: 'idle',
          repo: null,
          baseDir: '',
          results: [],
          error: '',
        })
      }, [])

      React.useEffect(() => () => {
        cloneControllerRef.current?.abort()
        cloneControllerRef.current = null
      }, [])

      if (!isSupportedPlatform) {
        return h('section', { className: `${CN}__issues` },
          accountTools && h('div', { className: `${CN}__issueToolbar` },
            h('div', { className: `${CN}__issueToolbarLeft` }, accountTools),
          ),
          h('div', { className: `${CN}__issueUnsupported` },
            h('h2', null, t('unsupportedRepos')),
            h('p', null, t('unsupportedReposDescription')),
          ),
        )
      }
      if (!rpc) {
        return h('section', { className: `${CN}__issues` },
          accountTools && h('div', { className: `${CN}__issueToolbar` },
            h('div', { className: `${CN}__issueToolbarLeft` }, accountTools),
          ),
          h('p', { className: `${CN}__error`, role: 'alert' }, t('repoUnavailable')),
        )
      }

      const orgOptions = isGitHub
        ? [
            { value: 'all', label: t('allOwners') },
            ...organizations.map(item => ({ value: item.id, label: item.name })),
          ]
        : organizations.map(item => ({ value: item.id, label: item.name }))
      const summaryText = formatTotalSummary(t, {
        loadedCount: items.length,
        hasMore,
        totalCount: effectiveTotalCount,
        countStatus: 'idle',
        countTruncated: Boolean(data?.truncated),
        unitLabel: t('repoCount'),
      })

      return h('section', {
        className: `${CN}__issues`,
        'aria-label': isGitHub ? t('githubRepos') : t('repos'),
        'aria-busy': loading || loadingMore,
      },
      h('div', { className: `${CN}__issueToolbar` },
        h('div', { className: `${CN}__issueToolbarLeft` }, accountTools),
        h('div', { className: `${CN}__issueToolbarRight` },
          data && h(NativeSelect, {
            className: `${CN}__filterSelect`,
            value: selectedOrganizationId,
            options: orgOptions,
            disabled: loading || orgOptions.length === 0 || (isGitHub && organizations.length === 0),
            ariaLabel: isGitHub ? t('owner') : t('organization'),
            placeholder: isGitHub ? t('allOwners') : t('organization'),
            onChange: nextOrg => setOrganizationId(nextOrg),
          }),
          h('input', {
            type: 'search',
            className: `${CN}__searchInput`,
            value: searchInput,
            placeholder: t('repoSearchPlaceholder'),
            'aria-label': t('repoSearchPlaceholder'),
            onChange: event => setSearchInput(event.target.value),
            onKeyDown: (event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                setSearchQuery(searchInput.trim())
              }
            },
          }),
          h('button', {
            type: 'button',
            className: `${CN}__button`,
            disabled: loading,
            onClick: () => setReload(value => value + 1),
          }, h(RefreshIcon), loading ? t('refreshing') : t('refresh')),
        ),
      ),
      loading && h('p', { className: `${CN}__status`, role: 'status' }, isGitHub ? t('githubReposLoading') : t('reposLoading')),
      state.status === 'error' && h('div', { className: `${CN}__issueError`, role: 'alert' },
        h('p', { className: `${CN}__error` }, state.error),
        h('button', { type: 'button', className: `${CN}__button`, onClick: () => setReload(value => value + 1) }, t('retry')),
      ),
      !isGitHub && data && !loading && organizations.length === 0 && h('p', { className: `${CN}__status` }, t('noOrganizations')),
      data && !loading && items.length === 0 && (isGitHub || organizations.length > 0) && h('div', { className: `${CN}__issueEmpty` },
        h('h3', null, t('noRepos')),
        h('p', null, isGitHub ? t('noGithubReposDescription') : t('noReposDescription')),
      ),
      items.length > 0 && h('div', { className: `${CN}__split` },
        h('div', { className: `${CN}__listPane` },
          h('div', { className: `${CN}__listHeader` },
            h('span', { className: `${CN}__issueSummary` }, summaryText),
          ),
          h('div', { className: `${CN}__listScroll` },
            items.map(repo =>
              h(RepoListItem, {
                key: repo.id,
                t,
                repo,
                selected: activeRepo?.id === repo.id,
                onSelect: () => setSelectedRepoId(repo.id),
              })),
            !loading && hasMore && h('div', {
              ref: sentinelRef, className: `${CN}__loadMoreSentinel`, 'aria-hidden': true,
            }),
            !loading && loadingMore && h('p', {
              className: `${CN}__status ${CN}__loadMoreStatus`, role: 'status',
            }, t('loadingMoreRepos')),
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
            }, t('noMoreRepos')),
          ),
        ),
        h('div', { className: `${CN}__detailPane` },
          h(RepoDetailPane, {
            t,
            platform: account.platform,
            repo: activeRepo,
            cloning: (cloneState.status === 'loading' || cloneState.status === 'creating-workspace')
              && cloneState.repo?.id === activeRepo?.id,
            onClone: startCloneRepo,
          }),
        ),
      ),
      h(RepoCloneModal, {
        t,
        cloneState,
        canCreateWorkspace,
        onClose: closeCloneModal,
        onRetry: () => startCloneRepo(cloneState.repo),
        onCreateWorkspace: createWorkspaceForRepo,
      }))
    }

    function PullRequestListItem({ t, pr, selected, cloning, onSelect, onStart }) {
      const stateBadge = prStateBadge(t, pr.state)
      const hasBranches = Boolean(pr.sourceBranch || pr.targetBranch)
      const canStart = pr.state === 'open'

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
        h('div', { className: `${CN}__issueTitle`, title: pr.title || pr.id }, pr.title || pr.id),
        h('span', { className: `${CN}__issueSerial` }, pr.serialNumber || pr.id),
      ),
      h('div', { className: `${CN}__issueBottomRow` },
        h('div', { className: `${CN}__issueInfoCol` },
          h('div', { className: `${CN}__issueBadges` },
            h('span', { className: `${CN}__issueBadge ${stateBadge.className}`.trim() }, stateBadge.label),
            pr.draft && h('span', { className: `${CN}__issueBadge ${CN}__issueBadgeVerify` }, t('prDraft')),
            pr.hasConflict === true && h('span', { className: `${CN}__issueBadge ${CN}__issueBadgeTypeBug` }, t('prConflict')),
          ),
          hasBranches && h('div', { className: `${CN}__prBranches` },
            h('span', { className: `${CN}__prBranch` }, pr.sourceBranch || '—'),
            h('span', { className: `${CN}__prBranchArrow`, 'aria-hidden': true }, '→'),
            h('span', { className: `${CN}__prBranch` }, pr.targetBranch || '—'),
          ),
          h('div', { className: `${CN}__issueMeta` },
            h('span', null, shortRepoName(pr.repositoryName) || '—'),
            pr.author?.name && h('span', null, pr.author.name),
            h('span', null, formatDate(pr.gmtModified)),
          ),
        ),
        canStart && h('button', {
          type: 'button',
          className: `${CN}__taskActionBtn ${CN}__taskActionStart`,
          'data-action': 'start',
          disabled: Boolean(cloning),
          onClick: (event) => {
            event.stopPropagation()
            onSelect()
            onStart?.(pr)
          },
        }, t('actionStart')),
      ))
    }

    function PrStartModal({ t, platform, cloneState, onClose, onRetry }) {
      const open = cloneState.status !== 'idle'
      if (!open) return null

      const pr = cloneState.pr || {}
      const prLabel = pr.serialNumber || pr.id || ''
      const title = prLabel ? `${t('prStartModalTitle')} · ${prLabel}` : t('prStartModalTitle')
      const results = Array.isArray(cloneState.results) ? cloneState.results : []
      const hasFailure = results.some(item => item.status === 'failed')
      const externalLink = prExternalLink(t, platform, pr, pr)

      const footer = [
        (cloneState.status === 'error' || (cloneState.status === 'done' && hasFailure)) && h('button', {
          key: 'retry',
          type: 'button',
          className: `${CN}__button`,
          onClick: onRetry,
        }, t('retry')),
        h('button', {
          key: 'close',
          type: 'button',
          className: `${CN}__button ${CN}__buttonPrimary`,
          onClick: onClose,
        }, t('close')),
      ].filter(Boolean)

      return h(DialogModal, {
        open: true,
        title,
        closeLabel: t('close'),
        onClose,
        footer,
      },
      h('div', { className: `${CN}__cloneModalBody` },
        pr.title && h('p', { className: `${CN}__cloneIssueTitle` }, pr.title),
        cloneState.status === 'loading' && h('p', { className: `${CN}__status`, role: 'status' }, t('prStartLoading')),
        cloneState.status === 'opening-workspace' && h('p', { className: `${CN}__status`, role: 'status' }, t('cloneOpeningWorkspace')),
        cloneState.status === 'starting-agent' && h('p', { className: `${CN}__status`, role: 'status' }, t('cloneStartingAgent')),
        cloneState.status === 'empty' && h('div', { className: `${CN}__cloneEmpty`, role: 'alert' },
          h('p', { className: `${CN}__warning` }, t('repoCloneNotFound')),
          externalLink && h('a', {
            className: `${CN}__openLink`,
            href: externalLink.href,
            target: '_blank',
            rel: 'noopener noreferrer',
          }, externalLink.label, h(ExternalIcon)),
        ),
        cloneState.status === 'error' && h('p', { className: `${CN}__error`, role: 'alert' }, cloneState.error),
        cloneState.status === 'done' && h('div', { className: `${CN}__cloneDone` },
          cloneState.baseDir && h('p', { className: `${CN}__hint` }, `${t('cloneTargetDir')}：${cloneState.baseDir}`),
          h('p', {
            className: hasFailure ? `${CN}__warning` : `${CN}__cloneSummary`,
            role: 'status',
          }, hasFailure ? t('clonePartialFailure') : t('cloneAllSuccess')),
          cloneState.error && h('p', { className: `${CN}__error`, role: 'alert' }, cloneState.error),
          h('ul', { className: `${CN}__cloneList` }, results.map((item, idx) => {
            const badge = cloneResultBadge(t, item.status)
            return h('li', { key: `${item.targetDir || item.name}-${idx}`, className: `${CN}__cloneItem` },
              h('div', { className: `${CN}__cloneItemTop` },
                h('span', { className: `${CN}__cloneRepoName` }, item.name || item.path),
                h('span', { className: `${CN}__issueBadge ${badge.className}`.trim() }, badge.label),
              ),
              item.targetDir && h('div', { className: `${CN}__clonePath` }, item.targetDir),
              item.error && h('div', { className: `${CN}__cloneItemError` }, item.error),
            )
          })),
        ),
      ))
    }

    function PullRequestDetailPane({ t, rpc, platform, accountId, organizationId, pr }) {
      const [state, setState] = React.useState({ status: 'loading', detail: null, error: '' })
      const [copiedLink, setCopiedLink] = React.useState('')
      const prId = pr?.id || ''

      React.useEffect(() => {
        if (!prId) {
          setState({ status: 'idle', detail: null, error: '' })
          return
        }
        const controller = new AbortController()
        setState({ status: 'loading', detail: null, error: '' })
        void callRpc(rpc, 'prDetail', {
          accountId,
          organizationId,
          pullRequestId: prId,
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
      }, [rpc, accountId, organizationId, prId, t])

      if (!pr) {
        return h('div', { className: `${CN}__detailEmpty` }, t('selectPrPrompt'))
      }

      const detail = state.detail || pr
      const stateBadge = prStateBadge(t, detail.state)
      const externalLink = prExternalLink(t, platform, pr, detail)
      const linkAddress = externalLink?.href || ''
      const linkCopied = Boolean(linkAddress) && copiedLink === linkAddress
      const onCopyLink = () => {
        if (!linkAddress) return
        void copyText(linkAddress).then(() => {
          setCopiedLink(linkAddress)
          setTimeout(() => setCopiedLink(current => (current === linkAddress ? '' : current)), 1600)
        }).catch(() => {})
      }
      const labels = Array.isArray(detail.labels) ? detail.labels : []
      const diffStats = formatPrDiffStats(t, detail)
      const hasBranches = Boolean(detail.sourceBranch || detail.targetBranch)

      return h('div', { className: `${CN}__detailScroll` },
        h('div', { className: `${CN}__detailHeader` },
          h('div', { className: `${CN}__detailHeaderMeta` },
            h('span', { className: `${CN}__issueSerial` }, detail.serialNumber || pr.serialNumber || pr.id),
            h('span', { className: `${CN}__issueBadge ${stateBadge.className}`.trim() }, stateBadge.label),
            detail.draft && h('span', { className: `${CN}__issueBadge ${CN}__issueBadgeVerify` }, t('prDraft')),
            detail.hasConflict === true && h('span', { className: `${CN}__issueBadge ${CN}__issueBadgeTypeBug` }, t('prConflict')),
          ),
          h('div', { className: `${CN}__detailHeaderActions` },
            externalLink && h('a', {
              className: `${CN}__openLink`,
              href: externalLink.href,
              target: '_blank',
              rel: 'noopener noreferrer',
            }, externalLink.label, h(ExternalIcon)),
            h('button', {
              type: 'button',
              className: `${CN}__button`,
              'data-action': 'copy-pr-link',
              disabled: !linkAddress,
              onClick: onCopyLink,
            }, h(CopyIcon), linkCopied ? t('copied') : t('issueCopyLink')),
          ),
        ),
        h('h3', { className: `${CN}__detailTitle` }, detail.title || pr.title || pr.id),
        hasBranches && h('div', { className: `${CN}__prBranches ${CN}__prBranchesDetail` },
          h('span', { className: `${CN}__prBranch` }, detail.sourceBranch || '—'),
          h('span', { className: `${CN}__prBranchArrow`, 'aria-hidden': true }, '→'),
          h('span', { className: `${CN}__prBranch` }, detail.targetBranch || '—'),
        ),
        state.status === 'loading' && h('p', { className: `${CN}__status`, role: 'status' }, t('detailLoading')),
        state.status === 'error' && h('p', { className: `${CN}__error`, role: 'alert' }, state.error),
        h('div', { className: `${CN}__detailBody` },
          h('dl', { className: `${CN}__detailGrid` },
            h(DetailRow, { label: t('repository'), value: shortRepoName(detail.repositoryName || pr.repositoryName) }),
            h(DetailRow, { label: t('status'), value: stateBadge.label }),
            h(DetailRow, { label: t('prAuthor'), value: detail.author?.name }),
            h(DetailRow, { label: t('prReviewers'), value: displayNames(detail.reviewers) }),
            Array.isArray(detail.assignees) && detail.assignees.length > 0
              && h(DetailRow, { label: t('prAssignees'), value: displayNames(detail.assignees) }),
            labels.length > 0 && h(DetailRow, { label: t('labels'), value: displayNames(labels) }),
            diffStats && h(DetailRow, { label: t('prDiffStats'), value: diffStats }),
            typeof detail.commitsCount === 'number'
              && h(DetailRow, { label: t('prCommits'), value: String(detail.commitsCount) }),
            typeof detail.commentsCount === 'number'
              && h(DetailRow, { label: t('prComments'), value: String(detail.commentsCount) }),
            h(DetailRow, { label: t('createdAt'), value: formatDate(detail.gmtCreate) }),
            h(DetailRow, { label: t('updatedAt'), value: formatDate(detail.gmtModified) }),
            detail.mergedAt && h(DetailRow, { label: t('prMergedAt'), value: formatDate(detail.mergedAt) }),
          ),
          h('section', { className: `${CN}__descriptionSection`, 'aria-label': t('prDescription') },
            h('h4', null, t('prDescription')),
            h(MarkdownDescription, { t, detail }),
          ),
        ),
      )
    }

    function PullRequestWorkbench({ t, rpc, workspaces, uiWorkspace, sessionRemote, account, accountTools }) {
      const [organizationId, setOrganizationId] = React.useState('')
      const [repositoryId, setRepositoryId] = React.useState('all')
      const [prState, setPrState] = React.useState('all')
      const [searchInput, setSearchInput] = React.useState('')
      const [searchQuery, setSearchQuery] = React.useState('')
      const [reload, setReload] = React.useState(0)
      const [selectedPrId, setSelectedPrId] = React.useState(null)
      const [state, setState] = React.useState({
        status: 'loading',
        data: null,
        error: '',
        loadingMore: false,
        loadMoreError: '',
      })
      const [cloneState, setCloneState] = React.useState({
        status: 'idle',
        pr: null,
        baseDir: '',
        results: [],
        error: '',
      })
      const sentinelRef = React.useRef(null)
      const loadMoreControllerRef = React.useRef(null)
      const cloneControllerRef = React.useRef(null)
      const loadingMoreRef = React.useRef(false)
      const queryKeyRef = React.useRef('')
      const isGitHub = account.platform === 'github'
      const isSupportedPlatform = SUPPORTED_ISSUE_PLATFORMS.has(account.platform)
      const canLoad = isSupportedPlatform && Boolean(rpc)
      const canLaunchSkillSession = Boolean(
        sessionRemote
        && typeof sessionRemote.create === 'function'
        && typeof sessionRemote.prompt === 'function',
      )

      React.useEffect(() => {
        const trimmed = searchInput.trim()
        if (trimmed === searchQuery) return
        if (typeof setTimeout !== 'function') {
          setSearchQuery(trimmed)
          return
        }
        const timer = setTimeout(() => {
          setSearchQuery(trimmed)
        }, 300)
        return () => clearTimeout(timer)
      }, [searchInput, searchQuery])

      React.useEffect(() => {
        if (!canLoad) return
        const queryKey = `${account.id}\0${organizationId}\0${repositoryId}\0${prState}\0${searchQuery}\0${reload}`
        queryKeyRef.current = queryKey
        loadMoreControllerRef.current?.abort()
        loadMoreControllerRef.current = null
        loadingMoreRef.current = false
        const controller = new AbortController()
        setSelectedPrId(null)
        setState(previous => ({
          status: 'loading',
          data: previous.data,
          error: '',
          loadingMore: false,
          loadMoreError: '',
        }))
        void callRpc(rpc, 'listPrs', {
          accountId: account.id,
          organizationId,
          repositoryId,
          state: prState,
          search: searchQuery,
          page: 1,
          pageSize: WORKITEM_PAGE_SIZE,
        }, controller.signal).then(data => {
          if (controller.signal.aborted || queryKeyRef.current !== queryKey) return
          const loadedItems = data?.items ?? []
          setSelectedPrId(loadedItems[0]?.id ?? null)
          setState({ status: 'ready', data, error: '', loadingMore: false, loadMoreError: '' })
        }).catch(error => {
          if (controller.signal.aborted || queryKeyRef.current !== queryKey) return
          const message = error?.code === 'host-not-loaded'
            ? t('hostNotLoaded')
            : (error.message || t('prUnavailable'))
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
      }, [rpc, account.id, account.platform, canLoad, organizationId, repositoryId, prState, searchQuery, reload, t])

      const data = state.data
      const loading = state.status === 'loading'
      const loadingMore = Boolean(state.loadingMore)
      const loadMoreError = state.loadMoreError || ''
      const organizations = data?.organizations ?? []
      const repositories = data?.repositories ?? []
      const items = data?.items ?? []
      const hasMore = Boolean(data?.hasMore && data?.nextPage)
      const selectedOrganizationId = organizationId || data?.selectedOrganizationId || (isGitHub ? 'all' : '')
      const selectedRepositoryId = repositoryId || data?.selectedRepositoryId || 'all'
      const activePr = items.find(item => item.id === selectedPrId) ?? items[0] ?? null
      const effectiveTotalCount = !hasMore
        ? items.length
        : (typeof data?.totalCount === 'number' ? data.totalCount : null)

      const loadMore = React.useCallback(() => {
        if (!canLoad || state.status !== 'ready' || loadingMoreRef.current) return
        const nextPage = state.data?.nextPage
        if (!state.data?.hasMore || !nextPage) return
        const queryKey = queryKeyRef.current
        loadingMoreRef.current = true
        loadMoreControllerRef.current?.abort()
        const controller = new AbortController()
        loadMoreControllerRef.current = controller
        setState(previous => ({ ...previous, loadingMore: true, loadMoreError: '' }))
        void callRpc(rpc, 'listPrs', {
          accountId: account.id,
          organizationId: selectedOrganizationId,
          repositoryId: selectedRepositoryId,
          state: prState,
          search: searchQuery,
          page: nextPage,
          pageSize: WORKITEM_PAGE_SIZE,
        }, controller.signal).then(nextData => {
          if (controller.signal.aborted || queryKeyRef.current !== queryKey) return
          loadingMoreRef.current = false
          if (loadMoreControllerRef.current === controller) loadMoreControllerRef.current = null
          const nextHasMore = Boolean(nextData?.hasMore && nextData?.nextPage)
          setState(previous => {
            const prevData = previous.data || {}
            const mergedItems = mergeRepoItems(prevData.items ?? [], nextData?.items ?? [])
            return {
              ...previous,
              loadingMore: false,
              loadMoreError: '',
              data: {
                ...prevData,
                ...nextData,
                organizations: nextData?.organizations?.length ? nextData.organizations : (prevData.organizations ?? []),
                repositories: nextData?.repositories?.length ? nextData.repositories : (prevData.repositories ?? []),
                items: mergedItems,
                totalCount: typeof nextData?.totalCount === 'number'
                  ? nextData.totalCount
                  : (!nextHasMore ? mergedItems.length : (prevData.totalCount ?? null)),
                hasMore: nextHasMore,
                nextPage: nextData?.nextPage ?? null,
                truncated: Boolean(prevData.truncated || nextData?.truncated),
              },
            }
          })
        }).catch(error => {
          if (controller.signal.aborted || queryKeyRef.current !== queryKey) return
          loadingMoreRef.current = false
          if (loadMoreControllerRef.current === controller) loadMoreControllerRef.current = null
          const message = error?.code === 'host-not-loaded'
            ? t('hostNotLoaded')
            : (error.message || t('loadMorePrsError'))
          setState(previous => ({ ...previous, loadingMore: false, loadMoreError: message }))
        })
      }, [canLoad, state.status, state.data, rpc, account.id, selectedOrganizationId, selectedRepositoryId, prState, searchQuery, t])

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

      const startHandlePr = React.useCallback((pr) => {
        if (!canLoad || !pr?.id) return
        const orgId = pr.organizationId || data?.selectedOrganizationId || selectedOrganizationId
        const repoId = pr.repositoryId || pr.repositoryName || ''
        cloneControllerRef.current?.abort()
        const controller = new AbortController()
        cloneControllerRef.current = controller
        if (!repoId) {
          setCloneState({
            status: 'empty',
            pr,
            baseDir: '',
            results: [],
            error: '',
          })
          return
        }
        setCloneState({
          status: 'loading',
          pr,
          baseDir: '',
          results: [],
          error: '',
        })
        const detailPromise = callRpc(rpc, 'prDetail', {
          accountId: account.id,
          organizationId: orgId,
          pullRequestId: pr.id,
        }, controller.signal).catch(() => null)
        void callRpc(rpc, 'cloneRepo', {
          accountId: account.id,
          organizationId: orgId,
          repositoryId: repoId,
        }, controller.signal).then(async (result) => {
          if (controller.signal.aborted) return
          const results = Array.isArray(result?.results) ? result.results : []
          if (result?.empty || results.length === 0) {
            if (cloneControllerRef.current === controller) cloneControllerRef.current = null
            setCloneState({
              status: 'empty',
              pr,
              baseDir: result?.baseDir || '',
              results: [],
              error: '',
            })
            return
          }

          const readyRepos = results.filter(
            item => (item.status === 'cloned' || item.status === 'exists') && item.targetDir,
          )
          const hasFailure = results.some(item => item.status === 'failed')
          const canOpenWorkspace = Boolean(
            !hasFailure
            && readyRepos.length > 0
            && workspaces
            && typeof workspaces.create === 'function'
            && uiWorkspace
            && typeof uiWorkspace.openWorkspace === 'function',
          )

          if (canOpenWorkspace) {
            setCloneState({
              status: 'opening-workspace',
              pr,
              baseDir: result?.baseDir || '',
              results,
              error: '',
            })
            try {
              let primaryWorkspace = null
              for (const repo of readyRepos) {
                if (controller.signal.aborted) return
                const created = await workspaces.create({ path: repo.targetDir })
                if (!primaryWorkspace && created?.workspaceId) {
                  primaryWorkspace = created
                }
              }
              if (controller.signal.aborted) return
              if (primaryWorkspace?.workspaceId) {
                await uiWorkspace.openWorkspace(primaryWorkspace.workspaceId)
              }
              if (controller.signal.aborted) return
              if (primaryWorkspace?.workspaceId && canLaunchSkillSession) {
                setCloneState({
                  status: 'starting-agent',
                  pr,
                  baseDir: result?.baseDir || '',
                  results,
                  error: '',
                })
                const detail = await detailPromise
                if (controller.signal.aborted) return
                try {
                  await launchTaskSkillSession(sessionRemote, {
                    workspaceId: primaryWorkspace.workspaceId,
                    prompt: buildPrSkillPrompt({
                      platform: account.platform,
                      pr,
                      detail,
                    }),
                  })
                } catch (skillError) {
                  if (controller.signal.aborted) return
                  if (cloneControllerRef.current === controller) cloneControllerRef.current = null
                  const skillMsg = skillError instanceof Error ? skillError.message : String(skillError || '')
                  setCloneState({
                    status: 'done',
                    pr,
                    baseDir: result?.baseDir || '',
                    results,
                    error: `${t('skillKickoffError')} ${skillMsg}`.trim(),
                  })
                  return
                }
              }
              if (controller.signal.aborted) return
              if (cloneControllerRef.current === controller) cloneControllerRef.current = null
              setCloneState({
                status: 'idle',
                pr: null,
                baseDir: '',
                results: [],
                error: '',
              })
              return
            } catch (workspaceError) {
              if (controller.signal.aborted) return
              if (cloneControllerRef.current === controller) cloneControllerRef.current = null
              const detailMsg = workspaceError instanceof Error ? workspaceError.message : String(workspaceError || '')
              setCloneState({
                status: 'done',
                pr,
                baseDir: result?.baseDir || '',
                results,
                error: `${t('cloneWorkspaceError')} ${detailMsg}`.trim(),
              })
              return
            }
          }

          if (cloneControllerRef.current === controller) cloneControllerRef.current = null
          setCloneState({
            status: 'done',
            pr,
            baseDir: result?.baseDir || '',
            results,
            error: '',
          })
        }).catch((error) => {
          if (controller.signal.aborted) return
          if (cloneControllerRef.current === controller) cloneControllerRef.current = null
          const message = error?.code === 'host-not-loaded'
            ? t('hostNotLoaded')
            : (error.message || t('repoCloneError'))
          setCloneState({
            status: 'error',
            pr,
            baseDir: '',
            results: [],
            error: message,
          })
        })
      }, [canLoad, canLaunchSkillSession, data?.selectedOrganizationId, selectedOrganizationId, rpc, workspaces, uiWorkspace, sessionRemote, account.id, account.platform, t])

      const closeCloneModal = React.useCallback(() => {
        cloneControllerRef.current?.abort()
        cloneControllerRef.current = null
        setCloneState({
          status: 'idle',
          pr: null,
          baseDir: '',
          results: [],
          error: '',
        })
      }, [])

      React.useEffect(() => () => {
        cloneControllerRef.current?.abort()
        cloneControllerRef.current = null
      }, [])

      if (!isSupportedPlatform) {
        return h('section', { className: `${CN}__issues` },
          accountTools && h('div', { className: `${CN}__issueToolbar` },
            h('div', { className: `${CN}__issueToolbarLeft` }, accountTools),
          ),
          h('div', { className: `${CN}__issueUnsupported` },
            h('h2', null, t('unsupportedPrs')),
            h('p', null, t('unsupportedPrsDescription')),
          ),
        )
      }
      if (!rpc) {
        return h('section', { className: `${CN}__issues` },
          accountTools && h('div', { className: `${CN}__issueToolbar` },
            h('div', { className: `${CN}__issueToolbarLeft` }, accountTools),
          ),
          h('p', { className: `${CN}__error`, role: 'alert' }, t('prUnavailable')),
        )
      }

      const orgOptions = isGitHub
        ? [
            { value: 'all', label: t('allOwners') },
            ...organizations.map(item => ({ value: item.id, label: item.name })),
          ]
        : organizations.map(item => ({ value: item.id, label: item.name }))
      const repoOptions = [
        { value: 'all', label: t('allRepositories') },
        ...repositories.map(item => ({ value: item.id, label: shortRepoName(item.name) })),
      ]
      const stateOptions = [
        { value: 'all', label: t('prStateAll') },
        { value: 'open', label: t('prStateOpen') },
        { value: 'merged', label: t('prStateMerged') },
        { value: 'closed', label: t('prStateClosed') },
      ]
      const summaryText = formatTotalSummary(t, {
        loadedCount: items.length,
        hasMore,
        totalCount: effectiveTotalCount,
        countStatus: 'idle',
        countTruncated: Boolean(data?.truncated),
        unitLabel: t('prCount'),
      })

      return h('section', {
        className: `${CN}__issues`,
        'aria-label': isGitHub ? t('githubPrs') : t('prs'),
        'aria-busy': loading || loadingMore,
      },
      h('div', { className: `${CN}__issueToolbar` },
        h('div', { className: `${CN}__issueToolbarLeft` }, accountTools),
        h('div', { className: `${CN}__issueToolbarRight` },
          data && h(NativeSelect, {
            className: `${CN}__filterSelect`,
            value: selectedOrganizationId,
            options: orgOptions,
            disabled: loading || orgOptions.length === 0 || (isGitHub && organizations.length === 0),
            ariaLabel: isGitHub ? t('owner') : t('organization'),
            placeholder: isGitHub ? t('allOwners') : t('organization'),
            onChange: nextOrg => { setOrganizationId(nextOrg); setRepositoryId('all') },
          }),
          data && h(FilterableSelect, {
            className: `${CN}__filterSelect`,
            value: selectedRepositoryId,
            options: repoOptions,
            disabled: loading || repositories.length === 0,
            ariaLabel: t('repository'),
            placeholder: t('allRepositories'),
            searchPlaceholder: t('repoSearchPlaceholder'),
            emptyText: t('noRepos'),
            onChange: nextRepo => setRepositoryId(nextRepo),
          }),
          h(NativeSelect, {
            className: `${CN}__prStateSelect`,
            value: prState,
            options: stateOptions,
            disabled: loading,
            ariaLabel: t('prState'),
            onChange: nextState => setPrState(nextState),
          }),
          h('input', {
            type: 'search',
            className: `${CN}__searchInput`,
            value: searchInput,
            placeholder: t('prSearchPlaceholder'),
            'aria-label': t('prSearchPlaceholder'),
            onChange: event => setSearchInput(event.target.value),
            onKeyDown: (event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                setSearchQuery(searchInput.trim())
              }
            },
          }),
          h('button', {
            type: 'button',
            className: `${CN}__button`,
            disabled: loading,
            onClick: () => setReload(value => value + 1),
          }, h(RefreshIcon), loading ? t('refreshing') : t('refresh')),
        ),
      ),
      loading && h('p', { className: `${CN}__status`, role: 'status' }, isGitHub ? t('githubPrsLoading') : t('prsLoading')),
      state.status === 'error' && h('div', { className: `${CN}__issueError`, role: 'alert' },
        h('p', { className: `${CN}__error` }, state.error),
        h('button', { type: 'button', className: `${CN}__button`, onClick: () => setReload(value => value + 1) }, t('retry')),
      ),
      !isGitHub && data && !loading && organizations.length === 0 && h('p', { className: `${CN}__status` }, t('noOrganizations')),
      data?.truncated && h('p', { className: `${CN}__warning`, role: 'status' }, t('prTruncated')),
      data && !loading && items.length === 0 && (isGitHub || organizations.length > 0) && h('div', { className: `${CN}__issueEmpty` },
        h('h3', null, t('noPrs')),
        h('p', null, isGitHub ? t('noGithubPrsDescription') : t('noPrsDescription')),
      ),
      items.length > 0 && h('div', { className: `${CN}__split` },
        h('div', { className: `${CN}__listPane` },
          h('div', { className: `${CN}__listHeader` },
            h('span', { className: `${CN}__issueSummary` }, summaryText),
          ),
          h('div', { className: `${CN}__listScroll` },
            items.map(pr =>
              h(PullRequestListItem, {
                key: pr.id,
                t,
                pr,
                selected: activePr?.id === pr.id,
                cloning: (cloneState.status === 'loading' || cloneState.status === 'opening-workspace' || cloneState.status === 'starting-agent')
                  && cloneState.pr?.id === pr.id,
                onSelect: () => setSelectedPrId(pr.id),
                onStart: startHandlePr,
              })),
            !loading && hasMore && h('div', {
              ref: sentinelRef, className: `${CN}__loadMoreSentinel`, 'aria-hidden': true,
            }),
            !loading && loadingMore && h('p', {
              className: `${CN}__status ${CN}__loadMoreStatus`, role: 'status',
            }, t('loadingMorePrs')),
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
            }, t('noMorePrs')),
          ),
        ),
        h('div', { className: `${CN}__detailPane` },
          h(PullRequestDetailPane, {
            t,
            rpc,
            platform: account.platform,
            accountId: account.id,
            organizationId: activePr?.organizationId || data?.selectedOrganizationId || selectedOrganizationId,
            pr: activePr,
          }),
        ),
      ),
      h(PrStartModal, {
        t,
        platform: account.platform,
        cloneState,
        onClose: closeCloneModal,
        onRetry: () => startHandlePr(cloneState.pr),
      }))
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

    function GitWorkbenchPage({ t, form, credentials, rpc, workspaces, uiWorkspace, sessionRemote }) {
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
      const [viewMode, setViewMode] = React.useState('tasks')
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
      const viewModeOptions = [
        { value: 'tasks', label: t('viewTasks') },
        { value: 'repos', label: t('viewRepos') },
        { value: 'prs', label: t('viewPrs') },
      ]

      const accountTools = accounts.length > 0 && h('div', { className: `${CN}__accountTools` },
        h(NativeSelect, {
          className: `${CN}__accountSelect`,
          value: selected?.id ?? '',
          options: accountOptions,
          disabled: busy || selectionBusy || !canWrite,
          ariaLabel: t('accountSelect'),
          onChange: selectAccount,
        }),
        h(NativeSelect, {
          className: `${CN}__viewModeSelect`,
          value: viewMode,
          options: viewModeOptions,
          disabled: busy || selectionBusy,
          ariaLabel: t('viewModeSelect'),
          onChange: nextMode => setViewMode(nextMode === 'repos' || nextMode === 'prs' ? nextMode : 'tasks'),
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
          snapshot.status === 'ready' && selected && (viewMode === 'repos'
            ? h(RepoWorkbench, { key: `repos:${selected.id}`, t, rpc, workspaces, uiWorkspace, account: selected, accountTools })
            : viewMode === 'prs'
              ? h(PullRequestWorkbench, { key: `prs:${selected.id}`, t, rpc, workspaces, uiWorkspace, sessionRemote, account: selected, accountTools })
              : h(IssueWorkbench, { key: selected.id, t, rpc, workspaces, uiWorkspace, sessionRemote, account: selected, accountTools })),
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
.${CN}__accountTools{display:flex;align-items:center;gap:8px;min-width:0;flex-wrap:wrap}
.${CN}__selectTrigger{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:space-between;gap:8px;height:32px;max-width:100%;padding:0 10px 0 12px;border:0.5px solid var(--dsw-alias-border-l2,var(--dsw-alias-border-l3));border-radius:8px;background:var(--dsw-alias-bg-layer-1,var(--dsw-alias-bg-base));color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;cursor:pointer;transition:background-color .15s ease,border-color .15s ease}
.${CN}__selectTrigger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);border-color:var(--dsw-alias-border-l3)}
.${CN}__selectTrigger.is-open{border-color:var(--dsw-alias-state-business-primary)}
.${CN}__selectTrigger:disabled{opacity:.5;cursor:not-allowed}
.${CN}__selectLabel{min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}
.${CN}__selectChevron{flex:none;color:var(--dsw-alias-label-tertiary);transition:transform .15s ease}
.${CN}__selectChevron.is-open{transform:rotate(180deg)}
.${CN}__selectMenu{max-height:320px;overflow-y:auto}
.${CN}__filterable{position:relative;display:inline-flex;min-width:0;max-width:100%}
.${CN}__filterable>.${CN}__selectTrigger{flex:1;min-width:0}
.${CN}__selectBackdrop{position:fixed;inset:0;z-index:90}
.${CN}__selectPanel{position:absolute;top:calc(100% + 4px);left:0;z-index:100;box-sizing:border-box;display:flex;flex-direction:column;min-width:100%;width:max-content;max-width:min(360px,80vw);padding:6px;border:0.5px solid var(--dsw-alias-border-l2,var(--dsw-alias-border-l3));border-radius:10px;background:var(--dsw-alias-bg-layer-1,var(--dsw-alias-bg-base));box-shadow:0 8px 24px rgba(0,0,0,.18)}
.${CN}__selectSearch{box-sizing:border-box;flex:none;width:100%;height:28px;margin-bottom:4px;padding:0 8px;border:0.5px solid var(--dsw-alias-border-l2,var(--dsw-alias-border-l3));border-radius:6px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px}
.${CN}__selectSearch::placeholder{color:var(--dsw-alias-label-caption)}
.${CN}__selectSearch:focus{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:1px}
.${CN}__selectOptions{max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:1px}
.${CN}__selectOption{display:block;flex:none;box-sizing:border-box;width:100%;padding:6px 10px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}
.${CN}__selectOption:hover{background:var(--dsw-alias-interactive-bg-hover)}
.${CN}__selectOption.is-selected{color:var(--dsw-alias-state-business-primary);font-weight:600}
.${CN}__selectEmpty{padding:8px 10px;color:var(--dsw-alias-label-caption);font-size:13px}
.${CN}__selectFallback{box-sizing:border-box;height:32px;padding:0 26px 0 10px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:8px;background:var(--dsw-alias-bg-layer-1,var(--dsw-alias-bg-base));color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;cursor:pointer}
.${CN}__selectFallback:disabled{opacity:.5;cursor:not-allowed}
.${CN}__accountSelect{min-width:140px;max-width:240px}
.${CN}__viewModeSelect{min-width:108px;max-width:160px}
.${CN}__filterSelect{min-width:140px;max-width:220px}
.${CN}__prStateSelect{min-width:104px;max-width:140px}
.${CN}__prBranches{display:flex;flex-wrap:wrap;align-items:center;gap:4px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary)}
.${CN}__prBranchesDetail{margin:0 0 14px;font-size:12px}
.${CN}__prBranch{max-width:100%;padding:1px 6px;border-radius:5px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.${CN}__prBranchArrow{flex:none;color:var(--dsw-alias-label-tertiary,var(--dsw-alias-label-secondary))}
.${CN}__searchInput{box-sizing:border-box;height:32px;min-width:150px;max-width:220px;padding:0 10px;border:0.5px solid var(--dsw-alias-border-l2,var(--dsw-alias-border-l3));border-radius:8px;background:var(--dsw-alias-bg-layer-1,var(--dsw-alias-bg-base));color:var(--dsw-alias-label-primary);font:inherit;font-size:13px}
.${CN}__searchInput::placeholder{color:var(--dsw-alias-label-caption)}
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
.${CN}__taskActionBtn:disabled{opacity:.5;cursor:not-allowed}
.${CN}__cloneModalBody{display:flex;flex-direction:column;gap:12px}
.${CN}__cloneIssueTitle{margin:0;color:var(--dsw-alias-label-primary);font-size:14px;line-height:20px;font-weight:600;overflow-wrap:anywhere}
.${CN}__cloneEmpty{display:flex;flex-direction:column;align-items:flex-start;gap:10px}
.${CN}__cloneDone{display:flex;flex-direction:column;gap:10px}
.${CN}__cloneSummary{margin:0;color:var(--dsw-alias-state-success-primary);font-size:13px;font-weight:500}
.${CN}__cloneList{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.${CN}__cloneItem{padding:10px 12px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:10px;background:var(--dsw-alias-bg-layer-1);display:flex;flex-direction:column;gap:4px}
.${CN}__cloneItemTop{display:flex;align-items:center;justify-content:space-between;gap:8px}
.${CN}__cloneRepoName{color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500;overflow-wrap:anywhere}
.${CN}__clonePath{color:var(--dsw-alias-label-secondary);font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:12px;overflow-wrap:anywhere}
.${CN}__cloneItemError{color:var(--dsw-alias-state-error-primary);font-size:12px;overflow-wrap:anywhere}
.${CN}__detailScroll{flex:1;min-height:0;overflow-y:auto;padding:18px 22px}
.${CN}__detailEmpty{flex:1;display:flex;align-items:center;justify-content:center;padding:32px;color:var(--dsw-alias-label-tertiary,var(--dsw-alias-label-secondary));font-size:13px}
.${CN}__detailHeader{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 12px;margin-bottom:8px}
.${CN}__detailHeaderMeta{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.${CN}__detailHeaderActions{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.${CN}__repoCloneUrls{display:flex;flex-direction:column;gap:8px;margin-top:16px}
.${CN}__repoCloneUrls h4{margin:0;color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px;font-weight:600}
.${CN}__repoCloneUrlCard{padding:10px 12px;border-radius:10px;border:0.5px solid var(--dsw-alias-border-l2,var(--dsw-alias-border-l3));background:var(--dsw-alias-bg-base);display:flex;flex-direction:column;gap:3px}
.${CN}__repoCloneUrlLabel{color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px}
.${CN}__workspacePrompt{padding:12px 14px;border-radius:10px;border:0.5px solid var(--dsw-alias-state-business-primary);background:var(--dsw-alias-bg-layer-1)}
.${CN}__workspacePromptText{margin:0;color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500;line-height:20px}
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
.${CN}__selectTrigger:focus-visible,.${CN}__selectFallback:focus-visible,.${CN}__searchInput:focus-visible,.${CN}__field input:focus-visible,.${CN}__issueItem:focus-visible,.${CN}__taskActionBtn:focus-visible,.${CN}__button:focus-visible,.${CN}__iconButton:focus-visible,.${CN}__openLink:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
@media(max-width:860px){.${CN}__page{overflow:auto}.${CN}__content{padding:20px 16px 32px;flex:none}.${CN}__split{grid-template-columns:1fr;flex:none}.${CN}__listPane{max-height:420px}.${CN}__detailPane{min-height:320px}.${CN}__accountTools{width:100%}.${CN}__accountSelect{flex:1;max-width:none}}
@media(pointer:coarse){.${CN}__field input{font-size:16px}}
`

    return {
      inject: [
        'slots', 'layout', 'locale', 'configForms', 'remote', 'remote.credentials',
        'remote.session', 'connection', 'workspaces', 'uiWorkspace',
      ],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'git-workbench: dictionaries')
        const t = ctx.locale.bind(NS)
        const form = ctx.configForms.get(ENTRY_ID)
        const credentials = ctx.remote.credentials
        const sessionRemote = ctx.remote?.session
          ?? (typeof ctx.get === 'function' ? ctx.get('remote.session') : null)
          ?? null
        const rpc = ctx.connection?.rpc ?? null
        const workspaces = ctx.workspaces ?? null
        const uiWorkspace = ctx.uiWorkspace ?? null

        ctx.slots.inject('main', () => {
          const dispose = ctx.slots.register({
            name: 'main', key: PANEL_ID, locale: NS,
            inject: () => ({
              form,
              credentials,
              rpc,
              workspaces,
              uiWorkspace,
              sessionRemote,
              onClose: () => { ctx.layout.selectPanel(null) },
            }),
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
