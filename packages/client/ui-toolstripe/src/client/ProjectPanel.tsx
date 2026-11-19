/**
 * The project tool panel: one lazily-listed workspace file tree for the
 * on-screen session, over the `workspaceFiles` Remote namespace. The tree
 * presentation is the `sidebar.files.tree` Factory (ui-sidebar-files owns it);
 * this panel owns the per-directory level cache, the watch that refreshes
 * listed levels, and what opening a file means (a right-dock preview).
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
import type { PropsLocale, PropsRenderFactories } from '@deepseek-ai/dsh-client-ui-slots'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { WorkspaceDirectoryListing } from '@deepseek-ai/dsh-api-workspace-files/types'
import type { TreeEntry } from '@deepseek-ai/dsh-client-ui-sidebar-files/client'
import css from './ProjectPanel.module.css'

/** One directory's listing cache entry. */
type Level =
  | { readonly state: 'loading' }
  | { readonly state: 'ready'; readonly entries: readonly TreeEntry[]; readonly truncated?: true }
  | { readonly state: 'failed'; readonly message: string }

/**
 * One directory listing, bound to a Remote face. The session travels with the
 * call because the endpoint resolves the workspace root from it.
 */
export type ListWorkspaceDirectory = (
  sessionId: SessionId,
  path: string,
  signal: AbortSignal,
) => Promise<RemoteResult<WorkspaceDirectoryListing>>

/** Observe one directory, yielding readiness and change notifications. */
export type WatchWorkspaceDirectory = (
  sessionId: SessionId,
  path: string,
  signal: AbortSignal,
) => AsyncIterable<'ready' | 'change'>

/** Business face injected by the plugin apply. */
export interface ProjectPanelInjected {
  list: ListWorkspaceDirectory
  watch: WatchWorkspaceDirectory
  /** Open a workspace-relative file as a right-dock preview. */
  openFile: (sessionId: SessionId, path: string) => void
}

/** Full project panel props. */
export type ProjectPanelProps =
  & PropsLocale<'toolstripe'>
  & PropsRenderFactories
  & ProjectPanelInjected
  & {
    /** The on-screen session whose workspace the tree lists. */
    sessionId: SessionId | undefined
  }

/** Workspace-relative child path of one listing entry. */
function childPath(parent: string, name: string): string {
  return parent === '' ? name : `${parent}/${name}`
}

/** The project panel (see module doc). */
export function ProjectPanel({ sessionId, list, watch, openFile, renderFactorySlot, t }: ProjectPanelProps) {
  const [levels, setLevels] = useState<Readonly<Record<string, Level>>>({})
  const [expanded, setExpanded] = useState<readonly string[]>([])
  // Session-scoped lifetime: the watch and every in-flight listing die with it.
  const sessionController = useRef<AbortController | null>(null)
  const expandedRef = useRef<readonly string[]>([])
  expandedRef.current = expanded

  const listLevel = async (path: string, sessionId: SessionId, signal: AbortSignal): Promise<void> => {
    setLevels(current => ({ ...current, [path]: current[path]?.state === 'ready' ? current[path] : { state: 'loading' } }))
    const result = await list(sessionId, path, signal)
    if (signal.aborted) return
    if (!result.ok) {
      setLevels(current => ({ ...current, [path]: { state: 'failed', message: t('project.listFailed') } }))
      return
    }
    const { entries, truncated } = result.value
    setLevels(current => ({
      ...current,
      [path]: {
        state: 'ready',
        entries: entries.map(entry => ({
          path: childPath(path, entry.name),
          name: entry.name,
          meta: { kind: entry.type, ...(entry.size === undefined ? {} : { size: entry.size }) },
        })),
        ...(truncated ? { truncated: true as const } : {}),
      },
    }))
  }

  // Session identity drives the whole panel: reset, list the root, and watch
  // it; a change re-lists the root and every expanded level.
  useEffect(() => {
    setLevels({})
    setExpanded([])
    sessionController.current?.abort()
    if (sessionId === undefined) return
    const controller = new AbortController()
    sessionController.current = controller
    const signal = controller.signal
    void listLevel('', sessionId, signal)
    void (async () => {
      try {
        for await (const event of watch(sessionId, '', signal)) {
          if (signal.aborted) return
          if (event === 'change') {
            void listLevel('', sessionId, signal)
            for (const path of expandedRef.current) void listLevel(path, sessionId, signal)
          }
        }
      } catch {
        // The stream supervisor owns retries; a terminal end only stops
        // auto-refresh until the next interaction re-lists.
      }
    })()
    return () => {
      controller.abort()
      sessionController.current = null
    }
  }, [sessionId, list, watch, t])

  const entries = useMemo(() => Object.values(levels).flatMap(level =>
    level.state === 'ready' ? level.entries : []), [levels])
  const directories = useMemo(() => {
    const state: Record<string, { loading?: true; failure?: string; truncated?: true }> = {}
    for (const [path, level] of Object.entries(levels)) {
      if (level.state === 'loading') state[path] = { loading: true }
      if (level.state === 'failed') state[path] = { failure: level.message }
      if (level.state === 'ready' && level.truncated) state[path] = { truncated: true }
    }
    return state
  }, [levels])
  const rootLevel = levels['']
  const rootTruncated = rootLevel?.state === 'ready' && rootLevel.truncated === true

  if (sessionId === undefined) {
    return <div className={css.empty}>{t('project.empty.noSession')}</div>
  }
  return (
    <div className={css.panel} data-project-panel="">
      {rootLevel?.state === 'failed' && <div className={css.notice} role="alert">{rootLevel.message}</div>}
      {rootTruncated && <div className={css.notice}>{t('project.truncated')}</div>}
      {rootLevel?.state === 'loading' && <div className={css.notice}>{t('project.loading')}</div>}
      {rootLevel?.state === 'ready' && (
        renderFactorySlot('sidebar.files.tree', {
          root: '',
          entries,
          expanded,
          directories,
          onToggle: (entry, expand) => {
            setExpanded(current => expand
              ? current.includes(entry.path) ? current : [...current, entry.path]
              : current.filter(path => path !== entry.path))
            if (expand) void listLevel(entry.path, sessionId, sessionController.current?.signal ?? new AbortController().signal)
          },
          onOpen: (entry) => { openFile(sessionId, entry.path) },
        })
      )}
    </div>
  )
}
