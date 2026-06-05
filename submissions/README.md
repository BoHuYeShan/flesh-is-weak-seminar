# 投稿指南

## 目录结构

每篇投稿是一个独立文件夹，放在 `submissions/` 目录下：

```
submissions/
├── 2024-01-15-ai-tools/          # 文件夹名：日期-简短描述
│   ├── index.md                   # 主要内容（必须）
│   ├── images/                    # 图片（可选）
│   │   ├── cover.png              # 封面图
│   │   └── screenshot.png
│   └── assets/                    # 其他附件（可选）
│       └── demo.zip
└── _template/                     # 模板（不要删除）
```

## 命名规范

### 文件夹命名

- 格式：`YYYY-MM-DD-简短描述`
- 使用小写字母和连字符
- 示例：
  - `2024-01-15-ai-tools`
  - `2024-01-16-python-guide`
  - `2024-01-17-vim-tips`

### 图片命名

- 使用小写字母和连字符
- 格式：`描述.扩展名`
- 示例：
  - `cover.png`（封面图）
  - `screenshot.png`（截图）
  - `diagram.svg`（示意图）

### 附件命名

- 使用小写字母和连字符
- 示例：
  - `demo.zip`
  - `source-code.tar.gz`

## index.md 格式

```markdown
---
title: 投稿标题
author: 你的昵称
date: 2024-01-15
tags: [标签1, 标签2]
summary: 一句话简介，会显示在卡片上
cover: images/cover.png  # 封面图，可选
---

## 主要内容

正文内容...

![截图](images/screenshot.png)

## 相关链接

- [链接](https://example.com)
```

### Frontmatter 字段

| 字段 | 必须 | 说明 |
|------|------|------|
| title | ✅ | 投稿标题 |
| author | ✅ | 作者昵称 |
| date | ✅ | 发布日期（YYYY-MM-DD） |
| tags | ✅ | 标签数组 |
| summary | ✅ | 一句话简介 |
| cover | ❌ | 封面图路径（相对于 index.md） |

## 提交流程

1. Fork 仓库
2. 在 `submissions/` 下创建文件夹
3. 按规范命名文件夹和文件
4. 编写 `index.md`
5. 添加图片和附件
6. 提交 PR
7. 等待审核合并

## 注意事项

- 文件夹名必须唯一，不能与已有投稿重名
- 图片建议压缩后再上传（TinyPNG）
- 附件大小不要超过 10MB
- index.md 的 frontmatter 必须完整
