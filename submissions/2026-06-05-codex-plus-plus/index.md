---
title: "[test] Codex++：OpenAI Codex 的外部增强工具"
author: BOHUYESHAN-APB
date: 2026-06-05
tags: [AI, Codex, 工具, 开源]
summary: 面向 Codex App 的外部增强启动器和管理工具，通过 CDP 注入增强脚本，支持中转注入、插件解锁、会话管理等功能
---

## 项目链接

https://github.com/BigPizzaV3/CodexPlusPlus

## 简介

**Codex++** 是面向 OpenAI Codex App 的外部增强启动器和管理工具。它不修改 Codex App 原始安装文件，而是通过外部 launcher 启动 Codex，并使用 Chromium DevTools Protocol (CDP) 注入增强脚本。

目前已有 **13.8k Stars**，是一个非常活跃的开源项目。

## 核心功能

### 1. 中转注入模式

支持多个中转配置，可以将模型请求转到自定义兼容 API：

- 写入 `CodexPlusPlus` provider
- 支持多个中转配置切换
- 可切回官方 ChatGPT 登录态

### 2. 插件入口解锁

API Key 登录模式下，Codex 原生插件入口会提示需要登录 ChatGPT。Codex++ 可以解锁插件入口，让 API Key 用户也能使用插件功能。

### 3. 会话管理

- **会话删除**：原生 Codex 只有归档入口，Codex++ 添加了真正的删除按钮
- **Markdown 导出**：支持将会话导出为 Markdown 格式
- **项目移动**：支持移动项目位置

### 4. 其他功能

- Provider 同步：切换供应商后旧会话仍可见
- Zed 打开入口：从 Codex 直接打开文件到 Zed
- Upstream worktree 创建：从最新的远端跟踪分支开始
- 自动更新：通过 GitHub Release 自动检测更新

## 技术栈

| 组件 | 技术 |
|------|------|
| 后端 | Rust |
| 管理工具 | Tauri + React |
| 注入方式 | Chromium DevTools Protocol (CDP) |
| 安装包 | Windows NSIS / macOS DMG |

## 安装方式

从 [GitHub Releases](https://github.com/BigPizzaV3/CodexPlusPlus/releases) 下载：

- **Windows**：`CodexPlusPlus-*-windows-x64-setup.exe`
- **macOS Intel**：`CodexPlusPlus-*-macos-x64.dmg`
- **macOS Apple Silicon**：`CodexPlusPlus-*-macos-arm64.dmg`

安装后有两个入口：
- `Codex++`：静默启动入口
- `Codex++ 管理工具`：Tauri 控制面板

## 适用场景

- 使用 API Key 登录 Codex 的用户
- 需要中转 API 的用户
- 需要会话管理功能的用户
- 需要插件入口解锁的用户

## 总结

Codex++ 是一个非常实用的 Codex 增强工具，通过外部注入的方式，不修改原始文件，安全可靠。如果你是 Codex 用户，特别是使用 API Key 登录的用户，强烈推荐试试。

---

*注：这是一个测试投稿，用于验证投稿系统功能。*
