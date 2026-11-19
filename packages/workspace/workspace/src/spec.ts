/**
 * The workspace domain declaration: record schema and the `defineDomain` spec
 * the registry opens. The zod schema validates the shipped format at the
 * durability boundary and is the direct source of a future RPC wire projection.
 * @module @deepseek-ai/dsh-workspace/src/spec
 */

import { z } from 'zod'
import { brandString } from '@deepseek-ai/dsh-brand'
import type { SessionId } from '@deepseek-ai/dsh-session'
import { defineDomain, domainTable } from '@deepseek-ai/dsh-storage-domain'
import type { WorkspaceGroupId, WorkspaceId } from './types.ts'

/** Workspace id schema at the durable boundary; branding has no runtime representation. */
const workspaceId = z.string().transform(value => value as WorkspaceId)

/** Group id schema at the durable boundary; branding has no runtime representation. */
const workspaceGroupId = z.string().transform(value => value as WorkspaceGroupId)

const sessionId = z.string().transform(value => brandString<SessionId>(value))

/**
 * Durable shape of one workspace record. `path` is the `fs.realpath` canon
 * stamped at create; `sessionIds` is the ordered ownership account (array
 * order is display order); timestamps are ISO-8601 strings. `groupId` names
 * the workspace group the record belongs to, or is absent when ungrouped;
 * records written before the field existed parse unchanged.
 */
export const workspaceRecord = z.object({
  path: z.string(),
  title: z.string(),
  sessionIds: z.array(sessionId),
  createdAt: z.string(),
  updatedAt: z.string(),
  groupId: workspaceGroupId.optional(),
})

/** One stored workspace record, inferred from {@link workspaceRecord}. */
export type WorkspaceRecord = z.infer<typeof workspaceRecord>

/** Durable shape of one workspace group row in the registry-global group table. */
export const workspaceGroupRecord = z.object({
  id: workspaceGroupId,
  title: z.string(),
})

/** One stored workspace group row, inferred from {@link workspaceGroupRecord}. */
export type WorkspaceGroupRecord = z.infer<typeof workspaceGroupRecord>

/**
 * Recoverable two-write mutation marker. The marker is persisted before the
 * record/order pair can diverge, so startup can distinguish an interrupted
 * registry operation from unexplained medium corruption.
 */
const workspacePendingMutation = z.discriminatedUnion('operation', [
  z.object({ operation: z.literal('create'), workspaceId }),
  z.object({ operation: z.literal('delete'), workspaceId }),
])

/**
 * Durable registry state. `initialized` distinguishes a valid empty registry
 * from one that still needs the header-only history bootstrap;
 * `workspaceIds` is the authoritative display order. `archivedSessionIds` is
 * the registry-global archive set layered over workspace accounting: an
 * archived session keeps its `sessionIds` slot (unarchiving must restore the
 * position), so the set never participates in the one-owner accounting
 * invariant. `pinnedSessionIds` is the registry-global pin set in pin order
 * (most recently pinned first); pinning and archival are mutually
 * exclusive, so archiving drops the session's pin. `workspaceGroups` is the
 * ordered group table; a workspace record's `groupId` must name a row here
 * whenever present. Both session sets and the group table are defaulted so
 * records written before the fields existed parse unchanged.
 */
export const workspaceDomainState = z.object({
  initialized: z.boolean(),
  /** First-use Workspace identity, retained after its registration is deleted. */
  defaultWorkspaceId: workspaceId.optional(),
  workspaceIds: z.array(workspaceId),
  archivedSessionIds: z.array(sessionId).default([]),
  pinnedSessionIds: z.array(sessionId).default([]),
  /** Ordered workspace group table; array order is the groups' display order. */
  workspaceGroups: z.array(workspaceGroupRecord).default([]),
  pendingMutation: workspacePendingMutation.optional(),
})

/** Durable registry state inferred from {@link workspaceDomainState}. */
export type WorkspaceDomainState = z.infer<typeof workspaceDomainState>

/**
 * The workspace domain spec: one `workspaces` table keyed by
 * {@link WorkspaceId} plus the bootstrap/order singleton. The registry opens
 * this through `ctx.storage.domain`; the spec object is the single source of
 * the domain's identity, version, and schemas. Version 3 added the group
 * table and per-record `groupId`; version 2 records (without them) parse
 * through the field defaults, so v2 remains a compatible read version while
 * writes stamp v3.
 */
export const workspaceDomainSpec = defineDomain({
  name: 'workspace',
  version: 3,
  compatibleVersions: [2],
  global: {
    schema: workspaceDomainState,
    initial: {
      initialized: false,
      workspaceIds: [],
      archivedSessionIds: [],
      pinnedSessionIds: [],
      workspaceGroups: [],
    },
  },
  tables: { workspaces: domainTable<WorkspaceId, WorkspaceRecord>(workspaceRecord) },
})
