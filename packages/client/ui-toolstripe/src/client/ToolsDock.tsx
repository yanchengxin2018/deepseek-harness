/**
 * The left tool dock's chrome: a header (panel title + close) and the active
 * tool panel's body. Which panel is active lives in the toolstripe store; the
 * dock's shown state is the layout store's business and only narrows what this
 * renders.
 */
import type { InjectFace, PropsLocale, PropsRenderFactories, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import type { SessionListState } from '@deepseek-ai/dsh-api-session-controller/client'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import { Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
// Type-only: pulls the 'mainView' SessionReferenceSource merge the retain info reads.
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type { createToolstripeStore } from './store.ts'
import { ProjectPanel, type ProjectPanelInjected } from './ProjectPanel.tsx'
import css from './ToolsDock.module.css'

/** Callbacks and data the dock body needs, injected by the plugin apply. */
export interface ToolsDockInjected extends ProjectPanelInjected {
  /** Close the dock (and clear the active panel). */
  closeDock: () => void
}

/** Full dock props: the frame's owner share plus the store and injected body. */
export type ToolsDockProps =
  & { width: number; viewportWidth: number }
  & PropsStore<ReturnType<typeof createToolstripeStore>>
  & PropsLocale<'toolstripe'>
  & PropsRenderFactories
  & InjectFace<ToolsDockInjected>
  & {
    /** Root-scoped sessions list (the standard hook) for the on-screen session. */
    useSessions: (selector: (state: SessionListState) => SessionId | undefined) => SessionId | undefined
  }

/** The left tool dock (see module doc). */
export function ToolsDock({ width, useStore, useSessions, t, renderFactorySlot, closeDock, list, watch, openFile }: ToolsDockProps) {
  const panelId = useStore(state => state.panelId)
  const sessionId = useSessions(state =>
    Object.values(state.byId).find(session => (session.retainedBy.mainView ?? 0) > 0)?.id)
  if (panelId === null || width === 0) return null
  return (
    <div className={css.dock} data-tool-panel={panelId}>
      <div className={css.header}>
        <span className={css.title}>
          {panelId === 'project' ? t('panel.project.title') : panelId}
        </span>
        <Tooltip label={t('panel.close')} side="bottom" delayMs={500} portal>
          <button type="button" className={css.close} aria-label={t('panel.close')} onClick={closeDock}>
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
        </Tooltip>
      </div>
      <div className={css.body}>
        {panelId === 'project' && (
          <ProjectPanel sessionId={sessionId} renderFactorySlot={renderFactorySlot} list={list} watch={watch} openFile={openFile} t={t} />
        )}
      </div>
    </div>
  )
}
