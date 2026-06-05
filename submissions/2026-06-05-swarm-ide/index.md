---
title: "Swarm-IDE：自组织 Agent 蜂群的工作原理深度解析"
author: 群友投稿
date: 2026-06-05
tags: [多Agent, 蜂群, 开源, 架构解析]
summary: 深入解析 Swarm-IDE 的核心架构：两原语（create+send）如何生成任意拓扑，IM 系统与 Agent Loop 的解耦设计，以及液态拓扑的自组织机制。
---

## 项目概览

Swarm-IDE 是一个开源的多 Agent 协作系统，核心理念是用最少的原语（create + send）生成任意复杂的 Agent 拓扑。它不像 LangGraph 那样预定义静态工作流，而是让 Agent 在运行时自主"雇佣"子代理、自组织成蜂群。

**项目地址**：[github.com/chmod777john/swarm-ide](https://github.com/chmod777john/swarm-ide)

**⚠️ 注意：原项目未声明开源协议。**

### 与同类项目对比

| 能力 | Kimi-Swarm | Claude Agent Team | Swarm-IDE |
|------|-----------|-------------------|-----------|
| 嵌套 Agent | ❌ | ❌ | ✅ |
| Agent 间通信 | ❌ | ✅ | ✅ |
| 人与子 Agent 通信 | ❌ | ✅ | ✅ |
| 群聊模式 | ❌ | ❌ | ✅ |
| 可视化 | ❌ | ❌ | ✅ |
| 开源 | ❌ | ❌ | ✅ |
| 发布时间 | 2026.1.27 | 2026.2.6 | 2026.1.2 |

---

## 核心设计哲学：两原语生成一切拓扑

Swarm-IDE 的设计哲学可以用一句话概括：**每个人都能生孩子，也能和任意一个人说话。** 只要有这两种能力（create + send），就能实现任意结构。

### 极简原语

系统只依赖两个核心通信原语：

- **create**：生成新节点（Agent）。任何 Agent 都可以调用 `create` 工具创建子代理，指定其 role（角色，如 coder、researcher、reviewer）。
- **send**：在节点之间传递信息。Agent 可以向任意其他 Agent 或群组发送消息。

复杂协作行为（如 Map-Reduce、路由到专家、树状递归）全部由这两个原语组合而来。系统提供 `create_group` / `send_group_message` 只是"多播容器"的便利工具，不改变最小原语的本质。

### 液态拓扑

拓扑不预设、在运行中自演化。遇到复杂任务时，由 Agent 主动"雇佣"下属。没有中心控制器，只有不断扩展的节点网络。这是一种**递归生成**的拓扑：

```
人类 → assistant → coder (子节点)
                 → researcher (子节点)
                 → reviewer (子节点)
                      → sub-reviewer (孙节点)
```

每个新创建的 Agent 运行**同一套 loop 逻辑**，可以继续 create 和 send，形成无限嵌套的蜂群结构。

### 扁平协作

人类可以像聊天一样介入任意层级的 Agent。不管 Agent 嵌套多深，人类都可以直接与其对话，使复杂拓扑可观察、可调试、可介入。

---

## 系统架构：IM 系统与 Agent Loop 的解耦

Swarm-IDE 的架构由两个独立但桥接的系统组成：

### 1. IM 系统（消息层）

IM 系统管理 `group`（群组）和 `message`（消息），只关心"谁发给谁"。核心数据模型：

```
Workspace
├── Agent (id, role, parentId, llmHistory)
├── Group (id, name, contextTokens)
│   └── GroupMember (userId, lastReadMessageId)
└── Message (groupId, senderId, content, sendTime)
```

关键设计点：
- **Agent 的 `llmHistory`**：每个 Agent 拥有独立的 LLM 上下文历史，与 IM group 无关。这是 Agent 的"内部记忆"。
- **消息与 LLM 输出的解耦**：LLM 产生的内容**不会自动进入 messages**。只有显式调用 `send_*` 工具才会在 IM 系统产生消息。
- **可见性规则**：谁需要知道信息，就必须显式 send。

### 2. Agent Loop（推理层）

每个 Agent 都运行相同的循环：

```
┌─────────────────────────────────────────────┐
│  1. 拉取各 group 的未读消息                  │
│  2. 拼成 user 内容，追加到 llmHistory        │
│  3. 调用 LLM（可多轮工具调用，最多 3 轮）    │
│  4. 工具结果写回 llmHistory                  │
│  5. assistant 输出写回 llmHistory            │
│  6. 需要对外可见时，显式 send_*              │
└─────────────────────────────────────────────┘
```

### 桥接机制

两个系统的唯一桥接点：

- **拉取方向**：Agent 从 IM 系统拉取未读消息，作为本轮 LLM 输入。
- **推送方向**：只有显式 `send_*` 才会在 IM 系统产生消息。

这意味着 Agent 的内部推理过程（思考链、工具调用）是完全私有的，只有它主动 send 的内容才会被其他 Agent 或人类看到。

---

## Agent 运行时详解

### 唤醒机制（Wake）

Agent 不是轮询运行的，而是被"唤醒"的。唤醒触发条件：

1. **group_message**：群内有新消息时，唤醒群里所有其他 Agent。
2. **direct_message**：收到私信时唤醒。
3. **manual**：手动唤醒。

唤醒后，Agent 进入 `processUntilIdle()` 循环：拉取所有未读 batch，逐个处理，直到没有未读消息。

### 工具系统

每个 Agent 拥有一组内置工具：

| 工具 | 功能 |
|------|------|
| `create` | 创建子 Agent |
| `send` | 发送私信 |
| `send_group_message` | 群发消息 |
| `send_direct_message` | 直接消息 |
| `list_agents` | 列出所有 Agent |
| `list_groups` / `list_group_members` | 查看群组信息 |
| `create_group` | 创建群组 |
| `get_group_messages` | 获取群消息历史 |
| `bash` | 执行 shell 命令 |
| `self` | 查看自身身份 |
| `get_skill` | 加载技能 |

此外，系统支持 **MCP（Model Context Protocol）** 扩展，可以接入外部工具服务器。支持 stdio、HTTP、SSE 三种传输方式。

### LLM 提供者

支持两种 LLM 后端：
- **GLM**（智谱 AI）：默认使用 glm-4.7 模型
- **OpenRouter**：支持 Kimi-2.5 等多种模型

### 防死循环机制

- 每轮最多 **3 轮工具调用**（`maxToolRounds = 3`）。
- 如果 Agent 本轮没有调用任何 `send_*` 工具，系统会自动追加一条提醒消息，要求它判断是否需要对外可见。
- 支持 `interruptAll()` 中断所有 Agent。

---

## UI 事件系统

系统通过两层事件总线实现前端实时更新：

### AgentEventBus（Agent 事件）

每个 Agent 一个 channel，事件类型：
- `agent.wakeup`：Agent 被唤醒
- `agent.unread`：有未读消息
- `agent.stream`：流式输出（reasoning / content / tool_calls / tool_result）
- `agent.done`：LLM 调用完成
- `agent.error`：错误

### WorkspaceUIBus（UI 事件）

每个 Workspace 一个 channel，事件类型：
- `ui.agent.created`：新 Agent 创建
- `ui.group.created`：新群组创建
- `ui.message.created`：新消息
- `ui.agent.llm.start` / `ui.agent.llm.done`：LLM 调用状态
- `ui.agent.tool_call.start` / `ui.agent.tool_call.done`：工具调用状态

前端通过 **SSE（Server-Sent Events）** 订阅 `ui-stream`，实时接收这些事件并更新界面。

---

## 前端界面设计

### 三栏布局

```
┌──────────────┬──────────────────────┬──────────────────┐
│  左侧栏      │  中间：聊天 + Graph   │  右侧：Agent 详情 │
│  - 对话列表   │  - 消息气泡区         │  - LLM history    │
│  - 搜索框     │  - Agent Graph 可视化 │  - 工具调用日志    │
│  - Agent 列表 │  - 输入区             │  - 推理过程        │
└──────────────┴──────────────────────┴──────────────────┘
```

### Agent Graph 可视化

Graph 页面展示 Agent 间的事件和数据流动：
- 圆点 = Agent（含人类）
- 箭头 = 消息/事件流
- 可点击节点查看详情
- 实时统计边数和消息聚合数

### LLM History 面板

展示 Agent 的完整 `llmHistory`，包括：
- 系统提示词
- 接收到的消息
- LLM 的推理过程（reasoning）
- 工具调用参数和结果
- Assistant 的回复

这让 Agent 不再是黑箱，你可以看到它的完整思考过程。

---

## 协作模式（Spells）

Swarm-IDE 预置了三种协作模式，通过"咒语"（system prompt 模板）实现：

### 1. Map-Reduce（并行分片→汇总）

大任务切分并行处理，最后汇总。入口 Agent 将任务拆分为 N 个子任务，为每个子任务创建一个 Agent，等待回报后汇总。

### 2. Router-Experts（路由到专家）

入口 Agent 根据任务内容把请求路由给最合适的专家：
- 需求/规划/产品 → role 含 "pm"
- 代码/实现/调试 → role 含 "coder"
- 设计/体验/交互 → role 含 "designer"
- 分析/总结/归纳 → role 含 "analyst"

如果不存在匹配的 Agent，就 create 对应 role 再发送。

### 3. Tree-Executor（树状递归）

每个节点想一个数字 → 向父节点汇报 → 父节点把"子节点汇总 + 自己的数字"再汇报给上级。这是一个典型的递归聚合模式。

---

## 技术栈

| 组件 | 技术 |
|------|------|
| 后端框架 | Next.js 16 (App Router) |
| 数据库 | PostgreSQL 17 (Drizzle ORM) |
| 实时通信 | Redis + Upstash Realtime (SSE) |
| LLM 集成 | GLM API / OpenRouter (OpenAI 兼容) |
| MCP 支持 | @modelcontextprotocol/sdk |
| 前端 | React 19 + Tailwind CSS + Framer Motion |
| Markdown 渲染 | Streamdown |
| 包管理 | Bun |
| 容器化 | Docker Compose |

### 运行要求

- Linux 系统（或使用 GitHub Codespaces）
- Bun 运行时
- PostgreSQL + Redis（通过 Docker Compose 启动）
- LLM API Key（GLM 或 OpenRouter）

---

## 关键代码解析

### Agent 创建流程

当 Agent 调用 `create` 工具时：

```typescript
// agent-runtime.ts 中的 create 工具处理
if (name === "create") {
  const args = safeJsonParse<{ role?: string; guidance?: string }>(input.call.argumentsText, {});
  const role = (args.role ?? "").trim();
  
  // 1. 在数据库中创建子 Agent + 自动建立 P2P 群
  const created = await store.createSubAgentWithP2P({
    workspaceId,
    creatorId: this.agentId,
    role,
    guidance,
  });
  
  // 2. 为新 Agent 启动 Runner（事件循环）
  this.ensureRunner(created.agentId);
  
  // 3. 发送 UI 事件通知前端
  getWorkspaceUIBus().emit(workspaceId, {
    event: "ui.agent.created",
    data: { workspaceId, agent: { id: created.agentId, role, parentId: this.agentId } },
  });
}
```

### 消息发送与唤醒

当 Agent 调用 `send_group_message` 时：

```typescript
// 1. 写入消息到数据库
const result = await store.sendMessage({
  groupId,
  senderId: this.agentId,
  content,
  contentType: args.contentType ?? "text",
});

// 2. 唤醒群里所有其他 Agent
for (const memberId of members) {
  if (memberId === this.agentId) continue;
  const role = await store.getAgentRole({ agentId: memberId }).catch(() => null);
  if (role === "human" || role === null) continue;
  this.ensureRunner(memberId);   // 确保 Runner 存在
  this.wakeAgent(memberId);       // 唤醒
}
```

### Agent 事件循环

```typescript
private async loop() {
  while (true) {
    await this.wake.promise;        // 阻塞等待唤醒
    if (this.running) continue;
    this.running = true;
    try {
      await this.processUntilIdle(); // 处理所有未读
    } finally {
      this.running = false;
    }
  }
}
```

---

## 运行方式

### 方式一：GitHub Codespaces（推荐）

无需本地环境，点击即可启动：

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&repo=chmod777john/swarm-ide)

### 方式二：本地运行

```bash
cd swarm-ide/backend

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填写 API Key

# 启动数据库
docker compose up -d

# 初始化数据库
curl -X POST http://127.0.0.1:3017/api/admin/init-db

# 安装依赖并启动
bun install
bun dev
```

访问 http://localhost:3017，创建 workspace 即可开始。

### 体验蜂群

直接对 assistant 说：

> "创建 3 个儿子，给他们分别发消息，让他们再次自己创建 3 个孙子"

你会看到 Agent 自动创建子代理、建立群组、传递消息，形成一个树状的蜂群拓扑。

---

## 总结

Swarm-IDE 的核心创新在于：

1. **极简原语**：只用 create + send 两个原语就能表达任意多 Agent 协作行为。
2. **液态拓扑**：拓扑不预设，在运行时由 Agent 自主演化，真正实现"自组织"。
3. **IM + Agent 解耦**：消息系统与推理系统独立，LLM 输出不会自动暴露，只有显式 send 才产生可见消息。
4. **人类可介入**：人类可以像聊天一样随时介入任意层级的 Agent。
5. **完全开源**：在 Kimi-Swarm 和 Claude Agent Team 之前就独立提出了蜂群模式。

这个项目对于理解多 Agent 系统的设计非常有参考价值。它的"两原语生成一切拓扑"的思想，比预定义静态工作流的方式更加灵活和强大。

---

## 相关链接

- [GitHub 仓库](https://github.com/chmod777john/swarm-ide)
- [B 站演示视频](https://www.bilibili.com/video/BV1X163BQE5c/)
- [知乎文章](https://zhuanlan.zhihu.com/p/2000736341479138182)
- [白皮书链上时间戳](https://viewblock.io/arweave/tx/BJ5GVAQBUXtv21jIEvuyqTsv9t93j7rlG47Lwcmtdu8)
