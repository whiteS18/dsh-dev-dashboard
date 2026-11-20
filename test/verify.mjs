import assert from 'node:assert/strict'
import { readFile, readdir, lstat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import vm from 'node:vm'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
for (const key of ['.', './client']) {
  const target = manifest.exports[key]
  assert.ok(target.endsWith('.js'))
  assert.ok((await lstat(join(root, target))).isFile())
}
for (const locale of ['zh', 'en']) {
  const data = JSON.parse(await readFile(join(root, `locale/${locale}.json`), 'utf8'))
  assert.equal(typeof data.meta.title, 'string')
  assert.equal(typeof data.meta.description, 'string')
}
assert.ok((await readFile(join(root, 'icon.svg'), 'utf8')).includes('<svg'))

async function assertNoLinks(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    assert.equal(entry.isSymbolicLink(), false, `Unexpected symlink: ${entry.name}`)
    if (entry.isDirectory()) await assertNoLinks(join(directory, entry.name))
  }
}
await assertNoLinks(root)

// Load the browser artifact with a minimal module loader and verify both owned
// registrations plus navigation-safe teardown without mounting React.
let definition
const context = {
  window: { __ModuleLoader__: { load(value) { definition = value } } },
  console,
}
vm.runInNewContext(await readFile(join(root, 'dist/client.js'), 'utf8'), context)
assert.equal(definition.id, manifest.name)
const React = { createElement: (...args) => ({ args }) }
const plugin = definition.factory((name) => {
  assert.equal(name, 'react')
  return React
})
assert.equal(JSON.stringify(plugin.inject), JSON.stringify(['slots', 'layout', 'locale', 'configForms', 'remote', 'remote.credentials', 'connection']))
const registrations = []
const injected = []
const cleanups = new Map()
const form = { getSnapshot() { return { status: 'ready', value: { accounts: [], selectedAccountId: '' }, writable: true } } }
let activePanelId = null
const ctx = {
  effect(setup) { return setup() },
  locale: {
    register() { return () => {} },
    bind() { return key => key },
  },
  configForms: { get(id) { assert.equal(id, `${manifest.name}:host`); return form } },
  remote: { credentials: {} },
  layout: {
    panelInfo: { getSnapshot() { return { activePanelId } } },
    selectPanel(id) { activePanelId = id },
  },
  slots: {
    inject(owner, setup) {
      injected.push(owner)
      const cleanup = setup()
      cleanups.set(owner, cleanup)
      return cleanup
    },
    register(options, component) {
      registrations.push({ options, component })
      return () => { registrations.splice(registrations.findIndex(item => item.options === options), 1) }
    },
  },
}
plugin.apply(ctx)
assert.equal(JSON.stringify(injected.sort()), JSON.stringify(['main', 'sidebar.panellist']))
assert.equal(registrations.length, 2)
const main = registrations.find(item => item.options.name === 'main')
const sidebar = registrations.find(item => item.options.name === 'sidebar.panellist')
assert.equal(main.options.key, `${manifest.name}:panel`)
assert.equal(sidebar.options.id, main.options.key)
assert.equal(sidebar.options.label(), 'title')
// Simulate the owner slot collapsing while this plugin's page is selected.
activePanelId = main.options.key
assert.equal(typeof cleanups.get('main'), 'function')
cleanups.get('main')()
assert.equal(activePanelId, null)
assert.equal(registrations.length, 1)
cleanups.get('sidebar.panellist')()
assert.equal(registrations.length, 0)
console.log('Package structure and client registration checks passed')
