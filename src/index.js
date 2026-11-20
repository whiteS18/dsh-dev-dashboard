import { registerIssueRpc } from './issue-rpc.js'

export { RPC_CHANNEL } from './issue-rpc.js'

// Resolved from the DSH install anchor via peerDependencies at runtime;
// falls back to null in bare test environments without node_modules.
const Schema = await import('@deepseek-ai/schemastery').then((m) => m.default ?? m, () => null)

const markVolatile = (schema) => {
  if (!schema) return schema
  if (typeof schema.volatile === 'function') {
    try {
      return schema.volatile()
    } catch {
      return schema
    }
  }
  if (typeof schema.extra === 'function') return schema.extra('volatile', true)
  if (schema.meta) schema.meta.volatile = true
  return schema
}

const accountSchema = Schema
  ? Schema.object({
      id: Schema.string(),
      platform: Schema.string(),
      username: Schema.string(),
    })
  : undefined

/**
 * Only non-secret account metadata and selection live in ordinary configuration.
 * Fields are marked volatile so DSH's settings service exposes them to the
 * page's configForms controller and hot-commits edits without a restart, while
 * `settings.configure({ auto: false })` suppresses the generic auto form.
 */
export const Config = Schema
  ? Schema.object({
      accounts: markVolatile(Schema.array(accountSchema).default([])),
      selectedAccountId: markVolatile(Schema.string().default('')),
    })
  : undefined

export function apply(ctx, config = {}) {
  ctx.inject(['settings'], (child) => {
    if (typeof child.settings?.configure !== 'function') return
    child.effect(
      () => child.settings.configure({ auto: false }, ctx.fiber),
      'git-workbench: custom account form',
    )
  })
  registerIssueRpc(ctx, config)
}
