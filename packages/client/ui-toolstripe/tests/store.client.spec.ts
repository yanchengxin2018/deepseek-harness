import { describe, expect, it } from 'vitest'
import { createToolstripeStore } from '../src/client/store.ts'

describe('createToolstripeStore', () => {
  it('starts with no active panel', () => {
    const { store } = createToolstripeStore().create()
    expect(store.getSnapshot()).toEqual({ panelId: null })
  })

  it('toggles a panel closed on a repeat pick and switches on a different pick', () => {
    const { store, actions } = createToolstripeStore().create()
    actions.togglePanel('project')
    expect(store.getSnapshot().panelId).toBe('project')
    actions.togglePanel('project')
    expect(store.getSnapshot().panelId).toBeNull()
    actions.togglePanel('commit')
    actions.togglePanel('git')
    expect(store.getSnapshot().panelId).toBe('git')
  })

  it('closePanel clears the active panel', () => {
    const { store, actions } = createToolstripeStore().create()
    actions.togglePanel('project')
    actions.closePanel()
    expect(store.getSnapshot().panelId).toBeNull()
  })
})
