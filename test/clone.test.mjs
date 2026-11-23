import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createCloneService, defaultProjectBaseDir } from '../src/clone.js'

test('defaultProjectBaseDir points to <homedir>/project', () => {
  assert.equal(defaultProjectBaseDir(), path.join(os.homedir(), 'project'))
})

test('cloneRepositories clones multiple repositories sequentially, passes askpass without leaking token, and skips existing repos', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'dsh-clone-test-'))
  const baseDir = path.join(tempRoot, 'project')
  const existingDir = path.join(baseDir, 'repo-existing')
  await mkdir(existingDir, { recursive: true })
  await writeFile(path.join(existingDir, 'README.md'), 'existing')

  const calls = []
  let activeClones = 0
  let maxConcurrentClones = 0

  const execFile = async (cmd, args, options) => {
    assert.equal(cmd, 'git')
    calls.push({ args, env: options?.env })

    if (args[0] === '-C' && args[2] === 'rev-parse') {
      if (args[1] === existingDir) return { stdout: 'true\n', stderr: '' }
      throw new Error('not a git repo')
    }
    if (args[0] === '-C' && args[2] === 'remote') {
      if (args[1] === existingDir) {
        return { stdout: 'https://codeup.aliyun.com/org/repo-existing.git\n', stderr: '' }
      }
      return { stdout: '', stderr: '' }
    }
    if (args.includes('clone')) {
      activeClones += 1
      maxConcurrentClones = Math.max(maxConcurrentClones, activeClones)
      await new Promise(resolve => setTimeout(resolve, 10))
      activeClones -= 1
      assert.equal(JSON.stringify(args).includes('pt-secret-token'), false)
      return { stdout: '', stderr: '' }
    }
    throw new Error(`Unexpected git call: ${args.join(' ')}`)
  }

  try {
    const service = createCloneService({ execFile, baseDir })
    const result = await service.cloneRepositories({
      username: 'alice',
      token: 'pt-secret-token',
      repositories: [
        {
          id: '1',
          name: 'repo-existing',
          path: 'repo-existing',
          httpUrl: 'https://codeup.aliyun.com/org/repo-existing.git',
          sshUrl: 'git@codeup.aliyun.com:org/repo-existing.git',
        },
        {
          id: '2',
          name: 'repo-one',
          path: 'repo-one',
          httpUrl: 'https://codeup.aliyun.com/org/repo-one.git',
          sshUrl: 'git@codeup.aliyun.com:org/repo-one.git',
        },
        {
          id: '3',
          name: 'repo-two',
          path: 'repo-two',
          httpUrl: 'https://codeup.aliyun.com/org/repo-two.git',
          sshUrl: 'git@codeup.aliyun.com:org/repo-two.git',
        },
      ],
    })

    assert.equal(result.baseDir, baseDir)
    assert.equal(result.empty, false)
    assert.equal(maxConcurrentClones, 1)
    assert.deepEqual(
      result.results.map(item => ({ path: item.path, status: item.status, targetDir: item.targetDir })),
      [
        { path: 'repo-existing', status: 'exists', targetDir: path.join(baseDir, 'repo-existing') },
        { path: 'repo-one', status: 'cloned', targetDir: path.join(baseDir, 'repo-one') },
        { path: 'repo-two', status: 'cloned', targetDir: path.join(baseDir, 'repo-two') },
      ],
    )

    const cloneCalls = calls.filter(call => call.args.includes('clone'))
    assert.equal(cloneCalls.length, 2)
    assert.deepEqual(cloneCalls[0].args, [
      '-c', 'credential.helper=', 'clone', '--',
      'https://codeup.aliyun.com/org/repo-one.git', path.join(baseDir, 'repo-one'),
    ])
    assert.equal(cloneCalls[0].env.GIT_TERMINAL_PROMPT, '0')
    assert.equal(cloneCalls[0].env.DSH_GIT_USERNAME, 'alice')
    assert.equal(cloneCalls[0].env.DSH_GIT_PASSWORD, 'pt-secret-token')
    assert.ok(cloneCalls[0].env.GIT_ASKPASS)
  } finally {
    await rm(tempRoot, { recursive: true, force: true })
  }
})

test('cloneRepositories rejects unsafe paths/URLs, detects directory conflicts, falls back to SSH, and redacts secrets', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'dsh-clone-edge-'))
  const baseDir = path.join(tempRoot, 'project')
  const conflictDir = path.join(baseDir, 'conflict-repo')
  await mkdir(conflictDir, { recursive: true })
  await writeFile(path.join(conflictDir, 'file.txt'), 'occupied')

  const execFile = async (_cmd, args) => {
    if (args[0] === '-C' && args[2] === 'rev-parse') {
      throw new Error('not a git repo')
    }
    if (args.includes('clone')) {
      const url = args[args.indexOf('--') + 1]
      if (url.startsWith('https://codeup.aliyun.com/org/ssh-fallback')) {
        const err = new Error('Authentication failed for pt-secret-token')
        err.stderr = 'remote: Invalid credentials pt-secret-token'
        throw err
      }
      if (url.startsWith('git@codeup.aliyun.com:org/ssh-fallback')) {
        return { stdout: '', stderr: '' }
      }
      const err = new Error('fatal: failed with pt-secret-token')
      err.stderr = 'fatal: could not read from remote pt-secret-token'
      throw err
    }
    throw new Error(`Unexpected git call: ${args.join(' ')}`)
  }

  try {
    const service = createCloneService({ execFile, baseDir })
    const result = await service.cloneRepositories({
      username: 'alice',
      token: 'pt-secret-token',
      repositories: [
        { name: 'evil', path: '../evil', httpUrl: 'https://codeup.aliyun.com/org/evil.git' },
        { name: 'bad-url', path: 'bad-url', httpUrl: '--upload-pack=evil' },
        { name: 'conflict-repo', path: 'conflict-repo', httpUrl: 'https://codeup.aliyun.com/org/conflict-repo.git' },
        {
          name: 'ssh-fallback',
          path: 'ssh-fallback',
          httpUrl: 'https://codeup.aliyun.com/org/ssh-fallback.git',
          sshUrl: 'git@codeup.aliyun.com:org/ssh-fallback.git',
        },
        {
          name: 'always-fail',
          path: 'always-fail',
          httpUrl: 'https://codeup.aliyun.com/org/always-fail.git',
        },
      ],
    })

    assert.equal(result.results[0].status, 'failed')
    assert.equal(result.results[1].status, 'failed')
    assert.equal(result.results[2].status, 'failed')
    assert.ok(result.results[2].error.includes('已存在'))
    assert.equal(result.results[3].status, 'cloned')
    assert.equal(result.results[3].cloneUrl, 'git@codeup.aliyun.com:org/ssh-fallback.git')
    assert.equal(result.results[4].status, 'failed')
    assert.equal(result.results[4].error.includes('pt-secret-token'), false)
    assert.ok(result.results[4].error.includes('[redacted]'))
  } finally {
    await rm(tempRoot, { recursive: true, force: true })
  }
})

test('cloneRepositories supplies askpass credentials for GitHub HTTPS repos and isolates platform tokens by host', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'dsh-clone-gh-'))
  const baseDir = path.join(tempRoot, 'project')
  const calls = []

  const execFile = async (cmd, args, options) => {
    assert.equal(cmd, 'git')
    calls.push({ args, env: options?.env })
    if (args.includes('clone')) {
      return { stdout: '', stderr: '' }
    }
    throw new Error(`Unexpected git call: ${args.join(' ')}`)
  }

  try {
    const service = createCloneService({ execFile, baseDir })
    const result = await service.cloneRepositories({
      username: '',
      token: 'ghp-secret-token',
      platform: 'github',
      repositories: [
        {
          id: '1',
          name: 'demo',
          path: 'demo',
          httpUrl: 'https://github.com/octocat/demo.git',
          sshUrl: 'git@github.com:octocat/demo.git',
        },
        {
          id: '2',
          name: 'foreign',
          path: 'foreign',
          httpUrl: 'https://codeup.aliyun.com/org/foreign.git',
        },
      ],
    })

    assert.equal(result.results.length, 2)
    assert.equal(result.results[0].status, 'cloned')
    assert.equal(result.results[1].status, 'cloned')

    // GitHub repo gets askpass with x-access-token fallback and token
    assert.equal(calls[0].env.DSH_GIT_USERNAME, 'x-access-token')
    assert.equal(calls[0].env.DSH_GIT_PASSWORD, 'ghp-secret-token')
    assert.ok(calls[0].env.GIT_ASKPASS)

    // Non-GitHub host must NOT receive the GitHub token when platform === 'github'
    assert.equal(calls[1].env.DSH_GIT_PASSWORD, undefined)
    assert.equal(calls[1].env.GIT_ASKPASS, undefined)
  } finally {
    await rm(tempRoot, { recursive: true, force: true })
  }
})
