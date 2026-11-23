import { execFile as execFileCb } from 'node:child_process'
import { chmod, mkdir, mkdtemp, readdir, rm, stat, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFileCb)
const CLONE_TIMEOUT_MS = 5 * 60 * 1000
const MAX_OUTPUT_BYTES = 4 * 1024 * 1024

export function defaultProjectBaseDir() {
  return path.join(os.homedir(), 'project')
}

function sanitizeDirSegment(value) {
  if (typeof value !== 'string') return ''
  const cleaned = value.trim().replace(/\.git$/i, '')
  if (!cleaned || cleaned === '.' || cleaned === '..') return ''
  if (/[\\/\0\r\n]/.test(cleaned) || cleaned.startsWith('-')) return ''
  return cleaned
}

function isSafeCloneUrl(value) {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (!trimmed || /[\s\r\n\0]/.test(trimmed) || trimmed.startsWith('-')) return false
  if (/^(https?|ssh):\/\/.+/i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed)
      return Boolean(parsed.hostname)
    } catch {
      return false
    }
  }
  return /^[A-Za-z0-9._-]+@[A-Za-z0-9._-]+:[^\s]+$/.test(trimmed)
}

function isSshUrl(value) {
  const trimmed = String(value || '').trim()
  return /^ssh:\/\//i.test(trimmed) || /^[A-Za-z0-9._-]+@/.test(trimmed)
}

function shouldSupplyTokenForUrl(value, platform = '') {
  if (!/^https?:\/\//i.test(String(value || '').trim())) return false
  try {
    const host = new URL(value.trim()).hostname.toLowerCase()
    const isCodeupHost = host === 'codeup.aliyun.com' || host.endsWith('.aliyun.com') || host.endsWith('.aliyuncs.com')
    const isGitHubHost = host === 'github.com'
    if (platform === 'codeup') return isCodeupHost
    if (platform === 'github') return isGitHubHost
    return isCodeupHost || isGitHubHost
  } catch {
    return false
  }
}

function normalizeCloneIdentity(rawUrl) {
  const trimmed = String(rawUrl || '').trim()
  if (!trimmed) return ''
  const scpMatch = /^[A-Za-z0-9._-]+@([A-Za-z0-9._-]+):(.+)$/.exec(trimmed)
  if (scpMatch) {
    const host = scpMatch[1].toLowerCase()
    const repoPath = scpMatch[2].replace(/^\/+|\/+$/g, '').replace(/\.git$/i, '').toLowerCase()
    return `${host}/${repoPath}`
  }
  try {
    const parsed = new URL(trimmed)
    const host = parsed.hostname.toLowerCase()
    const repoPath = parsed.pathname.replace(/^\/+|\/+$/g, '').replace(/\.git$/i, '').toLowerCase()
    return `${host}/${repoPath}`
  } catch {
    return trimmed.replace(/\.git$/i, '').toLowerCase()
  }
}

function redactSecret(text, token) {
  const raw = String(text || '').trim()
  if (!raw) return ''
  return token ? raw.replaceAll(token, '[redacted]') : raw
}

function formatGitError(error, token) {
  const stderr = redactSecret(error?.stderr, token)
  const message = redactSecret(error?.message, token)
  const source = stderr || message || 'git clone 执行失败。'
  const lines = source.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
  return lines.slice(-3).join(' ') || 'git clone 执行失败。'
}

export function createCloneService({
  execFile = execFileAsync,
  baseDir = defaultProjectBaseDir(),
  fs = { chmod, mkdir, mkdtemp, readdir, rm, stat, writeFile },
} = {}) {
  const resolvedBaseDir = path.resolve(baseDir)

  async function runGit(args, options = {}) {
    return execFile('git', args, {
      timeout: CLONE_TIMEOUT_MS,
      maxBuffer: MAX_OUTPUT_BYTES,
      ...options,
    })
  }

  async function inspectExistingTarget(targetDir, candidateUrls, signal) {
    let info
    try {
      info = await fs.stat(targetDir)
    } catch (error) {
      if (error?.code === 'ENOENT') return { state: 'missing' }
      throw error
    }

    if (!info.isDirectory()) {
      return { state: 'conflict', reason: '目标路径已存在且不是目录。' }
    }

    try {
      await runGit(['-C', targetDir, 'rev-parse', '--is-inside-work-tree'], { signal })
      const remote = await runGit(['-C', targetDir, 'remote', 'get-url', 'origin'], { signal })
        .catch(() => ({ stdout: '' }))
      const originIdentity = normalizeCloneIdentity(remote?.stdout)
      const expectedIdentities = candidateUrls.map(normalizeCloneIdentity).filter(Boolean)
      if (originIdentity && expectedIdentities.includes(originIdentity)) {
        return { state: 'exists' }
      }
      return { state: 'conflict', reason: '目标目录已存在其他 Git 仓库。' }
    } catch (error) {
      if (signal?.aborted) throw error
      const entries = await fs.readdir(targetDir)
      if (entries.length === 0) return { state: 'empty-dir' }
      return { state: 'conflict', reason: '目标目录已存在且非空。' }
    }
  }

  async function cloneWithHttpsAskpass(cloneUrl, targetDir, username, token, platform, signal) {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-git-askpass-'))
    const askpassPath = path.join(tmpDir, 'askpass.sh')
    const script = [
      '#!/bin/sh',
      'case "$1" in',
      '  *Username*|*username*|*用户名*) printf \'%s\\n\' "$DSH_GIT_USERNAME" ;;',
      '  *) printf \'%s\\n\' "$DSH_GIT_PASSWORD" ;;',
      'esac',
      '',
    ].join('\n')
    const fallbackUser = platform === 'github' ? 'x-access-token' : 'oauth2'
    try {
      await fs.writeFile(askpassPath, script, 'utf8')
      await fs.chmod(askpassPath, 0o700)
      await runGit(['-c', 'credential.helper=', 'clone', '--', cloneUrl, targetDir], {
        signal,
        env: {
          ...process.env,
          GIT_TERMINAL_PROMPT: '0',
          GIT_ASKPASS: askpassPath,
          DSH_GIT_USERNAME: String(username || '').trim() || fallbackUser,
          DSH_GIT_PASSWORD: token,
        },
      })
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {})
    }
  }

  async function cloneSingleUrl(cloneUrl, targetDir, username, token, platform, signal) {
    if (token && shouldSupplyTokenForUrl(cloneUrl, platform)) {
      await cloneWithHttpsAskpass(cloneUrl, targetDir, username, token, platform, signal)
      return
    }
    const env = {
      ...process.env,
      GIT_TERMINAL_PROMPT: '0',
      ...(isSshUrl(cloneUrl) ? { GIT_SSH_COMMAND: 'ssh -o BatchMode=yes' } : {}),
    }
    await runGit(['clone', '--', cloneUrl, targetDir], { signal, env })
  }

  async function cloneRepositories({ repositories = [], username = '', token = '', platform = '', signal } = {}) {
    if (!Array.isArray(repositories) || repositories.length === 0) {
      return { baseDir: resolvedBaseDir, empty: true, results: [] }
    }

    await fs.mkdir(resolvedBaseDir, { recursive: true })
    const results = []

    for (const repo of repositories) {
      signal?.throwIfAborted()
      const dirName = sanitizeDirSegment(repo?.path) || sanitizeDirSegment(repo?.name)
      const displayName = String(repo?.name || dirName || '').trim()
      if (!dirName) {
        results.push({
          name: displayName || '未知仓库',
          path: '',
          targetDir: '',
          cloneUrl: '',
          status: 'failed',
          error: '仓库目录名称无效。',
        })
        continue
      }

      const targetDir = path.resolve(resolvedBaseDir, dirName)
      if (!targetDir.startsWith(`${resolvedBaseDir}${path.sep}`)) {
        results.push({
          name: displayName,
          path: dirName,
          targetDir: '',
          cloneUrl: '',
          status: 'failed',
          error: '仓库目标路径不安全。',
        })
        continue
      }

      const httpUrl = isSafeCloneUrl(repo?.httpUrl) ? repo.httpUrl.trim() : ''
      const sshUrl = isSafeCloneUrl(repo?.sshUrl) ? repo.sshUrl.trim() : ''
      const primaryUrl = httpUrl || sshUrl
      if (!primaryUrl) {
        results.push({
          name: displayName,
          path: dirName,
          targetDir,
          cloneUrl: '',
          status: 'failed',
          error: '缺少可用的仓库克隆地址。',
        })
        continue
      }

      const existing = await inspectExistingTarget(targetDir, [httpUrl, sshUrl], signal)
      if (existing.state === 'exists') {
        results.push({
          name: displayName,
          path: dirName,
          targetDir,
          cloneUrl: primaryUrl,
          status: 'exists',
          error: '',
        })
        continue
      }
      if (existing.state === 'conflict') {
        results.push({
          name: displayName,
          path: dirName,
          targetDir,
          cloneUrl: primaryUrl,
          status: 'failed',
          error: existing.reason,
        })
        continue
      }

      try {
        await cloneSingleUrl(primaryUrl, targetDir, username, token, platform, signal)
        results.push({
          name: displayName,
          path: dirName,
          targetDir,
          cloneUrl: primaryUrl,
          status: 'cloned',
          error: '',
        })
      } catch (primaryError) {
        if (signal?.aborted || primaryError?.name === 'AbortError') throw primaryError
        if (httpUrl && sshUrl && sshUrl !== primaryUrl) {
          const afterFail = await inspectExistingTarget(targetDir, [httpUrl, sshUrl], signal)
          if (afterFail.state === 'missing' || afterFail.state === 'empty-dir') {
            try {
              await cloneSingleUrl(sshUrl, targetDir, username, token, platform, signal)
              results.push({
                name: displayName,
                path: dirName,
                targetDir,
                cloneUrl: sshUrl,
                status: 'cloned',
                error: '',
              })
              continue
            } catch (sshError) {
              if (signal?.aborted || sshError?.name === 'AbortError') throw sshError
            }
          }
        }
        results.push({
          name: displayName,
          path: dirName,
          targetDir,
          cloneUrl: primaryUrl,
          status: 'failed',
          error: formatGitError(primaryError, token),
        })
      }
    }

    return {
      baseDir: resolvedBaseDir,
      empty: false,
      results,
    }
  }

  return {
    baseDir: () => resolvedBaseDir,
    cloneRepositories,
  }
}
