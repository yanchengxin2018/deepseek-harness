---
description: "IDE-style tool-window stripes for the dsh web client: the far-left icon stripe toggling the tasks sidebar, the project file-tree dock, and the terminal tab, with the dock's width and shown state reported through the layout."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-toolstripe

English | [中文](README.zh.md)

## Summary

Add the PyCharm-style tool-window chrome to the shell: a fixed far-left icon stripe (任务, 项目, 提交, Git, 终端) and the left tool dock its buttons toggle. 任务 collapses or expands the existing sidebar; 项目 opens the dock on a lazily-listed file tree of the on-screen session's workspace, refreshed by a root-directory watch; 终端 opens the right dock's terminal tab; 提交 and Git light up with the git tool windows. The dock's shown state and width are reported through `ctx.layout` exactly as the right column reports its own, so the frame sizes the track and the drag handle; which panel occupies the dock persists in this package's store.

## Use this package

Register the package in a web bundle's plugin roster. It fills the frame's `shell.toolstripe.left` and `shell.tools` slots — both are declared by `ui-layout`, so the layout plugin must be composed first. A session opened in the main view drives the project tree; without one the panel shows guidance instead.

## Known Limitations and Deferred Work

- The 提交 and Git buttons render disabled until the git tool windows ship.
- The dock is a left column only; a bottom dock (PyCharm's terminal placement) is deferred.
