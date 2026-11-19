/**
 * Tool stripe plugin, browser half. Two registrations into the frame's chrome:
 * ToolStripe fills `shell.toolstripe.left` (the far-left vertical buttons) and
 * ToolsDock fills `shell.tools` (the left dock they toggle). The dock's shown
 * state is reported through `ctx.layout` exactly as the right column reports
 * its own; which panel occupies the dock is this package's persisted store.
 * 项目 lists the on-screen session's workspace over `workspaceFiles`; 终端
 * opens the right dock's terminal tab; 任务 toggles the sidebar; 提交 and Git
 * arrive with the git tool windows.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Type-only: pulls the merges this apply reads (ctx.locale, ctx.slots) and the
// standard-hooks map the renderer binds against.
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type { ClientRemote } from '@deepseek-ai/dsh-api-remotes/client'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { WorkspaceFileWatchFrame } from '@deepseek-ai/dsh-api-workspace-files/types'
import { createToolstripeStore } from './store.ts'
import { ToolStripe } from './ToolStripe.tsx'
import { ToolsDock, type ToolsDockInjected } from './ToolsDock.tsx'
import type { ListWorkspaceDirectory, WatchWorkspaceDirectory } from './ProjectPanel.tsx'
import { en, ja, es, fr, de, ru, pt, zh, type ToolstripeKey } from './locales.ts'

export type { BuiltinToolPanelId, ToolstripeStoreActions } from './store.ts'
export type { ToolstripeKey } from './locales.ts'
export type { ToolStripeProps, ToolstripeInjected, ToolstripeOpenTabs } from './ToolStripe.tsx'
export type { ToolsDockProps, ToolsDockInjected } from './ToolsDock.tsx'
export type { ProjectPanelProps, ProjectPanelInjected, ListWorkspaceDirectory, WatchWorkspaceDirectory } from './ProjectPanel.tsx'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The tool stripe, the left dock chrome, and the project panel copy. */
    toolstripe: ToolstripeKey
  }
}

/** Dictionary namespace owned by this plugin. */
const NS = 'toolstripe'

/** Required services (cordis fiber inject). */
export const inject = ['slots', 'locale', 'layout', 'sidebarRight', 'remote']

/**
 * Bind the workspace listing to the Remote face.
 * @param remote - the Client Remote face carrying the `workspaceFiles` namespace.
 * @returns the listing the project panel performs.
 */
export function createStripeList(remote: ClientRemote): ListWorkspaceDirectory {
  return (sessionId, path, signal) => remote.workspaceFiles.list(sessionId, path, signal)
}

/**
 * Bind directory observation to the Remote stream supervisor.
 * @param remote - the Client Remote face carrying workspace file streams.
 * @returns a watcher that stops when its node's signal aborts.
 */
export function createStripeWatch(remote: ClientRemote): WatchWorkspaceDirectory {
  return async function* (sessionId, path, signal) {
    const stream = remote.$stream<WorkspaceFileWatchFrame>({
      name: `toolstripe directory ${path}`,
      open: lifetime => remote.workspaceFiles.changes(sessionId, path, lifetime),
      ended: () => new Error(`Directory watch ended: ${path}`),
    })
    const abort = (): void => { void stream.dispose() }
    signal.addEventListener('abort', abort, { once: true })
    try {
      for await (const item of stream) {
        if (signal.aborted) return
        if (item.value.kind === 'ready') item.accept()
        yield item.value.kind
      }
    } finally {
      signal.removeEventListener('abort', abort)
      await stream.dispose()
    }
  }
}

/**
 * Register the stripe and the dock once the frame's chrome slots exist.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  const layout = ctx.layout
  ctx.effect(() => ctx.locale.register(NS, { zh, en, ja, es, fr, de, ru, pt }), 'ui-toolstripe: dictionaries')
  const handle = createToolstripeStore()
  const instance = handle.create()
  const store: typeof handle = { ...handle, create: () => instance }

  const openTerminal = (): void => {
    try {
      ctx.sidebarRight.openTab('terminal')
    } catch (error) {
      console.warn('toolstripe: terminal unavailable:', error)
    }
  }
  const openFile = (sessionId: SessionId, path: string): void => {
    try {
      ctx.sidebarRight.openResource(`dsh-resource://file/session/${sessionId}/${path}`)
    } catch (error) {
      console.warn('toolstripe: file preview unavailable:', error)
    }
  }
  const togglePanel = (id: string): void => {
    instance.actions.togglePanel(id)
    if (instance.getSnapshot().panelId === id) layout.openTools()
    else layout.closeTools()
  }
  const closeDock = (): void => {
    instance.actions.closePanel()
    layout.closeTools()
  }

  // A persisted active panel re-opens the dock after a reload.
  if (instance.getSnapshot().panelId === 'project') layout.openTools()

  ctx.slots.inject('shell.toolstripe.left', () => ctx.slots.register(
    {
      name: 'shell.toolstripe.left',
      store,
      locale: NS,
      inject: () => ({
        hooks: { layoutInfo: layout.layoutInfo, openTabs: ctx.sidebarRight.openTabs },
        toggleSidebar: () => { layout.toggleSidebar() },
        togglePanel,
        openTerminal,
        openFile,
        list: createStripeList(ctx.remote),
        watch: createStripeWatch(ctx.remote),
      }),
    },
    ToolStripe,
  ))
  ctx.slots.inject('shell.tools', () => ctx.slots.register(
    {
      name: 'shell.tools',
      store,
      locale: NS,
      inject: (): ToolsDockInjected => ({
        closeDock,
        openFile,
        list: createStripeList(ctx.remote),
        watch: createStripeWatch(ctx.remote),
      }),
    },
    ToolsDock,
  ))
}
