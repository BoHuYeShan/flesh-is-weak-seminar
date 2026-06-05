# 贡献指南

## 最简单的贡献方式

**只需要传一个 markdown 文件，其他什么都不用改。**

### 步骤

1. Fork 仓库
2. 在 `submissions/` 下创建文件夹（格式：`YYYY-MM-DD-简短描述`）
3. 在文件夹里放一个 `index.md`
4. 提交 PR
5. 等待合并

### 示例

```
submissions/
└── 2026-06-05-my-article/      ← 你的文件夹
    └── index.md                  ← 你的文章（唯一必须的文件）
```

就这样，其他代码、配置、页面都不需要改。

## index.md 格式

```markdown
---
title: 文章标题
author: 你的昵称
date: 2026-06-05
tags: [标签1, 标签2]
summary: 一句话简介
---

正文内容...
```

### Frontmatter 字段

| 字段 | 必须 | 说明 |
|------|------|------|
| title | ✅ | 文章标题 |
| author | ✅ | 作者昵称 |
| date | ✅ | 日期（YYYY-MM-DD） |
| tags | ✅ | 标签数组 |
| summary | ✅ | 一句话简介 |

## 图片使用

如果需要图片：

1. 在文件夹里创建 `images/` 目录
2. 把图片放进去
3. 正文中引用：`![描述](images/xxx.png)`

## 文件夹命名

- 格式：`YYYY-MM-DD-简短描述`
- 小写字母和连字符
- 示例：
  - `2026-06-05-ai-tools`
  - `2026-06-06-python-guide`
  - `2026-06-07-vim-tips`

## 注意事项

- 文件夹名不能和已有的重复
- index.md 的 frontmatter 必须完整
- 图片建议压缩后再上传
- **只需要传 markdown 文件，其他代码不用改**
