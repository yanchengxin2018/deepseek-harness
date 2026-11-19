---
description: "DSH Web 客户端的 IDE 风格工具窗口条：最左侧图标条切换任务侧栏、项目文件树停靠面板与终端标签；停靠宽度与显隐通过布局服务上报。"
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-toolstripe

[English](README.md) | 中文

## 概述

为外壳加上 PyCharm 风格的工具窗口条：固定的最左图标条（任务、项目、提交、Git、终端）以及这些按钮切换的左侧停靠面板。任务收起或展开现有侧栏；项目在停靠面板中打开当前会话工作区的懒加载文件树，并由根目录监听自动刷新；终端打开右侧停靠的终端标签；提交与 Git 随 git 工具窗口启用。停靠的显隐与宽度经由 `ctx.layout` 上报，与右侧面板同一模式；面板占用关系持久在本包的 store 中。

## 使用本包

在 Web bundle 的插件清单中注册本包。它填充外壳的 `shell.toolstripe.left` 与 `shell.tools` 两个槽位——均由 `ui-layout` 声明，因此布局插件需先组合。主视图打开的会话驱动项目文件树；无会话时面板显示引导文案。

## 已知限制与延期工作

- 「提交」与「Git」按钮在 git 工具窗口落地前渲染为禁用态。
- 停靠面板目前仅支持左侧列；底部停靠（PyCharm 的终端位置）延期。
