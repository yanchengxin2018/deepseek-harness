# Agent Note：工作区分组作为注册表顺序之上的覆盖层

Status: implemented

[English](2026-11-19-workspace-groups-as-order-overlay.md) | 中文

## 问题

工作区侧边栏需要用户自定义的工作区分组。后续计划把 Workspace 及其分组同步到云端账号，因此分组必须是 Host 持久化、经 wire 投影、且按记录可同步的形态——不能是浏览器本地的视图偏好。

## 决策

**分组是分桶覆盖层；注册表顺序仍是唯一排序权威。** `workspaceDomainState.workspaceGroups`（领域版本 3，`compatibleVersions: [2]`）持有有序分组表 `{ id, title }`；每条 `workspaceRecord` 携带可选 `groupId`。组内成员按其在 `workspaceIds` 中的顺序渲染，因此组内拖拽复用现有 `insertBefore` 动词，不存在每分组一份顺序表。分组的展示顺序即 `workspaceGroups` 数组自身，独立于 `workspaceIds`。

**归属放在 workspace 记录上，而不是注册表全局映射。** 这与已按记录同步的数据（path、title、sessionIds）一致，未来云端同步可以把一条 Workspace 行连同其分组归属作为整体迁移。分组表是唯一的全局新增；删除分组会在同一队列操作里先清除成员记录的 `groupId` 再移除分组行，因此任何已提交状态都不会引用缺失的分组，启动校验（`validateStoredState`）对孤儿 `groupId` 直接失败。

**wire 投影镜像 archive/pinned 模式**：完整集合的 `groups` 帧（分组表很小，无需逐行帧）和 `WorkspaceView` 上的可选 `groupId`。分组行不携带 Session 身份，访问过滤原样放行。

分组标题允许重复、仅要求非空：与 Workspace 标题不同，没有任何界面按名称解析分组，冲突机制会是无主的成本。

## 备选方案

**在浏览器视图 store 里做客户端本地分组。** 否决：用户已明确 Workspace 与分组将来要同步到云端；localStorage 形态与 Host 持久化的顺序权威分叉、无法同步，还会把分组归属与侧边栏已视为权威的行顺序割裂开。

**在全局状态里保存每分组的有序成员表。** 否决：它会把 `workspaceIds` 复制成第二份排序权威，组内拖拽需要新的重排动词并与跨组的全局重排做调和；覆盖层方案保持单一事实来源。

**分组支持嵌套树。** 否决：没有任何界面要求分组嵌套；扁平有序表让 wire 投影与侧边栏渲染保持一层深度，未来如需嵌套，可在同样的行上加 `parentGroupId`，不改帧结构。

## 后果

- 组内重排、跨区块重排与取消归属是相互独立的动词；UI 把拖拽目标映射到它们，而不是发明每分组的顺序写入。
- `workspaceDomainSpec.version` 升到 3 并声明 `compatibleVersions: [2]`；域测试套件中的前分组夹具保持 v2，持续证明升级路径。
- 分组 id 是 `WorkspaceGroupId`（`Branded`），绝不使用标题，重命名不会使引用锚点失效。
