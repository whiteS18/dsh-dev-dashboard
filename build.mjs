import assert from 'node:assert/strict'
import { copyFile, mkdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(fileURLToPath(import.meta.url))
const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
assert.equal(manifest.name, 'dsh-dev-dashboard')
assert.equal(manifest.version, '1.4.0')
assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml')
assert.equal(manifest.exports['.'], './dist/index.js')
assert.equal(manifest.exports['./client'], './dist/client.js')

const patch = JSON.parse(await readFile(join(root, 'cordis.patch.yml'), 'utf8'))
assert.ok(Array.isArray(patch) && patch.length > 0)
const ids = new Set()
for (const operation of patch) {
  assert.deepEqual(Object.keys(operation), ['insert'])
  assert.ok(Array.isArray(operation.insert) && operation.insert.length > 0)
  for (const row of operation.insert) {
    assert.ok(row.id.startsWith(`${manifest.name}:`))
    assert.ok(!ids.has(row.id))
    ids.add(row.id)
    assert.equal(row.name, manifest.name)
    assert.notEqual(row.group, true)
  }
}

await mkdir(join(root, 'dist'), { recursive: true })
await copyFile(join(root, 'src/index.js'), join(root, 'dist/index.js'))
await copyFile(join(root, 'src/codeup.js'), join(root, 'dist/codeup.js'))
await copyFile(join(root, 'src/issue-rpc.js'), join(root, 'dist/issue-rpc.js'))
await copyFile(join(root, 'src/client.js'), join(root, 'dist/client.js'))
assert.equal(await readFile(join(root, 'dist/index.js'), 'utf8'), await readFile(join(root, 'src/index.js'), 'utf8'))
assert.equal(await readFile(join(root, 'dist/codeup.js'), 'utf8'), await readFile(join(root, 'src/codeup.js'), 'utf8'))
assert.equal(await readFile(join(root, 'dist/issue-rpc.js'), 'utf8'), await readFile(join(root, 'src/issue-rpc.js'), 'utf8'))
assert.equal(await readFile(join(root, 'dist/client.js'), 'utf8'), await readFile(join(root, 'src/client.js'), 'utf8'))
console.log(`Built ${manifest.name}@${manifest.version}`)
