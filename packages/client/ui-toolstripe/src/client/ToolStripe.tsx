/**
 * The far-left tool stripe: one vertical button per tool window, PyCharm-style.
 * Pure presentational — state arrives through the framework hooks (layout
 * geometry, the panel store, the right dock's open tabs) and every action is
 * an injected callback.
 */
import type { ReactNode } from 'react'
import clsx from 'clsx'
import type {
  HostObservable, InjectFace, PropsLocale, PropsStore,
} from '@deepseek-ai/dsh-client-ui-slots'
import {
  IconBranchOutlineRegular, IconChecklistOutlineRegular, IconFolderCloseRegular,
  IconQueueOutlineRegular, PluginArtworkTerminal, Tooltip,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { LayoutInfo } from '@deepseek-ai/dsh-client-ui-layout/client'
import type { createToolstripeStore } from './store.ts'
import css from './ToolStripe.module.css'

/** The slice of the right-dock tab inventory the stripe reads. */
export interface ToolstripeOpenTabs {
  getSnapshot(): readonly { readonly kind: string }[]
  subscribe(listener: () => void): () => void
}

/** Callbacks the stripe drives, wired to ctx services by the plugin apply. */
export interface ToolstripeInjected {
  hooks: {
    /** Root-scoped frame geometry (column widths and shown states). */
    layoutInfo: HostObservable<LayoutInfo>
    /** The right-dock tab inventory (terminal active state). */
    openTabs: ToolstripeOpenTabs
  }
  /** Toggle the tasks sidebar (the workspace/session column). */
  toggleSidebar: () => void
  /** Toggle a left-dock tool panel (and the dock's shown state with it). */
  togglePanel: (id: string) => void
  /** Open the terminal tab in the right dock. */
  openTerminal: () => void
}

/** Full stripe props: InjectFace binds the hooks compartment into use<Name> selectors. */
export type ToolStripeProps =
  & PropsStore<ReturnType<typeof createToolstripeStore>>
  & PropsLocale<'toolstripe'>
  & InjectFace<ToolstripeInjected>

/** One stripe button. */
function StripeButton({ icon, label, active, disabled, onPress }: {
  icon: ReactNode
  label: string
  active?: boolean
  disabled?: boolean
  onPress: () => void
}) {
  return (
    <Tooltip label={label} side="right" delayMs={500} portal>
      <button
        type="button"
        className={clsx(css.stripeButton, active && css.active)}
        aria-label={label}
        aria-pressed={disabled ? undefined : active || undefined}
        disabled={disabled}
        onClick={onPress}
      >
        {icon}
      </button>
    </Tooltip>
  )
}

/** The vertical tool stripe (see module doc). */
export function ToolStripe({ useStore, useLayoutInfo, useOpenTabs, t, toggleSidebar, togglePanel, openTerminal }: ToolStripeProps) {
  const panelId = useStore(state => state.panelId)
  const info = useLayoutInfo(identity => identity)
  const tabs = useOpenTabs(inventory => inventory)
  const sidebarExpanded = info.narrowExpanded || info.sidebar > 0
  return (
    <nav className={css.stripe}>
      <StripeButton
        icon={<IconQueueOutlineRegular />}
        label={t('tool.tasks')}
        active={sidebarExpanded}
        onPress={toggleSidebar}
      />
      <StripeButton
        icon={<IconFolderCloseRegular />}
        label={t('tool.project')}
        active={info.toolsShown && panelId === 'project'}
        onPress={() => { togglePanel('project') }}
      />
      <StripeButton
        icon={<IconChecklistOutlineRegular />}
        label={t('tool.commit')}
        disabled
        onPress={() => {}}
      />
      <StripeButton
        icon={<IconBranchOutlineRegular />}
        label={t('tool.git')}
        disabled
        onPress={() => {}}
      />
      <StripeButton
        icon={<PluginArtworkTerminal size={16} />}
        label={t('tool.terminal')}
        active={tabs.some(tab => tab.kind === 'terminal')}
        onPress={openTerminal}
      />
    </nav>
  )
}
