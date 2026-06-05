# 血肉苦短研讨班 - GitHub Copilot 规范

> 适用工具: GitHub Copilot

## 核心逻辑

**投稿只需要传一个 markdown 文件，其他代码都不用改。**

## 投稿操作

**在 `submissions/` 下创建文件夹，放入 `index.md`，提交 PR。**

```
submissions/
└── YYYY-MM-DD-简短描述/
    └── index.md              ← 唯一必须的文件
```

index.md 格式：
```markdown
---
title: 标题
author: 作者
date: 2026-06-05
tags: [标签1, 标签2]
summary: 一句话简介
---

正文内容...
```

**不需要改任何其他代码、配置、页面。**

## 图片使用

需要图片时：
1. 在文件夹里创建 `images/` 目录
2. 把图片放进去
3. 正文中引用：`![描述](images/xxx.png)`

## 禁止操作

- 删除 submissions/ 目录下的文件
- 删除 .vitepress/ 目录
- 删除 .github/ 目录
- 执行 git push --force
- 修改其他代码文件（投稿不需要）

## 本地开发

```bash
npm install
npm run dev
```
