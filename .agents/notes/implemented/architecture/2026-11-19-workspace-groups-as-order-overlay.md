# Agent Note: workspace groups as an overlay over the registry order

Status: implemented

English | [中文](2026-11-19-workspace-groups-as-order-overlay.zh.md)

## Problem

The workspace sidebar needed user-defined grouping of Workspaces. The planned follow-up syncs Workspaces and their groups to a cloud account, so the grouping had to be Host-durable, wire-projected, and shaped for per-record cloud sync — not a browser-local view preference.

## Decision

**Groups are a bucketing overlay; the registry order stays the single ordering authority.** `workspaceDomainState.workspaceGroups` (domain version 3, `compatibleVersions: [2]`) holds the ordered group table `{ id, title }`; each `workspaceRecord` carries an optional `groupId`. A group's members render in the order they hold in `workspaceIds`, so within-group drag reuses the existing `insertBefore` verb unchanged and no per-group order list exists. Group display order is the `workspaceGroups` array itself, independent of `workspaceIds`.

**Membership lives on the workspace record, not in a registry-global map.** This matches what already syncs per record (path, title, sessionIds) and lets a future cloud sync move a Workspace row with its group assignment as one unit. The group table is the only registry-global addition; deleting a group clears member records' `groupId` inside the same queued operation before the row drops, so no committed state ever references a missing group and startup validation (`validateStoredState`) can fail loud on any orphan `groupId`.

**Wire projection mirrors the archive/pin pattern**: a complete-set `groups` frame (the group table is small; no per-row frames needed) and an optional `groupId` on `WorkspaceView`. Group rows carry no Session identities, so access filtering passes them through unchanged.

Group titles allow duplicates and only require non-blank: unlike Workspace titles, no surface resolves a group by name, so the conflict machinery would be unowned cost.

## Alternatives considered

**Client-local grouping in the browser view store.** Rejected: the user asked for cloud sync of Workspaces and groups; a localStorage blob would diverge from the Host-durable order and could not sync, and it splits grouping membership from the row order the sidebar already treats as authoritative.

**A per-group ordered member list in the global state.** Rejected: it would duplicate `workspaceIds` as a second ordering authority, so a within-group drag would need a new reorder verb and reconciliation with cross-group global reorders; the overlay keeps one source of truth.

**A nested tree of groups.** Rejected: no surface asked for group nesting; a flat ordered table keeps the wire projection and the sidebar rendering one level deep, and nesting can be added later as a `parentGroupId` on the same rows without changing the frames.

## Consequences

- Within-group reorder, cross-section reorder, and unassign are independent verbs; the UI maps drag targets to them instead of inventing per-section order writes.
- `workspaceDomainSpec.version` bumped to 3 with `compatibleVersions: [2]`; the pre-group fixtures in the domain suite stay at v2 and continuously prove the upgrade path.
- Group ids are `WorkspaceGroupId` (`Branded`), never the title, so renames cannot invalidate reference anchors.
