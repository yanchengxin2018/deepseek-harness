/**
 * The tool stripe's viewing store: which tool panel occupies the left dock.
 * Persisted across reloads; the dock's shown state itself lives in the layout
 * store and is re-reported on restore (see apply).
 */
import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-store'

/** The tool panels this package ships, by their dock ids. */
export type BuiltinToolPanelId = 'project' | 'commit' | 'git'

/** Tool stripe viewing state persisted across reloads. */
type ToolstripeState = {
  /** The panel occupying the left dock; null when the user closed it. */
  panelId: string | null
}

/** Annotation twin of the actions literal below. */
type ToolstripeActions = {
  togglePanel: (draft: ToolstripeState, id: string) => void
  closePanel: (draft: ToolstripeState) => void
}

/**
 * Create the tool stripe viewing store handle.
 * @returns the store handle (spec + type + identity + factory in one).
 */
export function createToolstripeStore(): EngineStoreHandle<ToolstripeState, ToolstripeActions> {
  return defineStore({
    init: (): ToolstripeState => ({ panelId: null }),
    persist: 'dsh.toolstripe.v1',
    actions: {
      togglePanel: (d, id: string) => { d.panelId = d.panelId === id ? null : id },
      closePanel: (d) => { d.panelId = null },
    },
  })
}

/** The bound write set of one toolstripe store instance. */
export type ToolstripeStoreActions = ReturnType<ReturnType<typeof createToolstripeStore>['create']>['actions']
