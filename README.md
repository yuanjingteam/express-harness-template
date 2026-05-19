# Node Express — Harness 示例
<p align="center">
  <img src="./banner.png" alt="Harness Node Express Banner" />
</p>

基于 Martin Fowler 提出的 Harness Engineering 理念，为 Node Express Web 项目搭建的最小可用 harness。

核心思路：让 agent 写代码之前，先给它修一条能回家的路。

## 项目结构

```
harness-example/
├── CLAUDE.md                              # Feedforward: agent 规则（铁律在最前）
├── docs/ai/                               # 项目知识库
│   ├── index.md                           # 项目知识库索引
│   ├── architecture.md                    # 架构说明
│   └── api-contracts.md                   # API 契约
├── scripts/agent-check.sh                 # 后置检查 : 自动检查脚本
├── .claude/ai-review/SKILL.md         # AI Review: Claude Code 命令
├── .eslintrc.json                         # ESLint 代码风格规则
├── src/
│   ├── server.js                          # 入口
│   ├── app.js                             # Express app 配置
│   ├── config/database.js                 # 数据库连接池
│   ├── logger.js                          # winston 日志
│   ├── controller/userController.js       # HTTP 入口，参数校验，返回 DTO
│   ├── service/userService.js             # 业务逻辑，事务边界
│   ├── mapper/userMapper.js               # 数据访问层（参数化查询）
│   ├── model/user.js                      # 数据库实体
│   ├── dto/userDto.js                     # 请求/响应 DTO + 校验规则
│   ├── routes/userRoutes.js               # 路由定义
│   └── middleware/
│       ├── validation.js                  # 校验中间件
│       └── errorHandler.js                # 错误处理中间件
├── test/
│   ├── controller/userController.test.js  # Controller 测试
│   ├── service/userService.test.js        # Service 测试
│   ├── architecture/layering.test.js      # 分层架构测试
│   ├── fixture/fixtureDriven.test.js      # fixture 驱动的验收测试
│   └── fixtures/user-create-success.json
├── sql/
│   ├── schema.sql                         # 建表脚本
│   └── data.sql                           # 初始化数据
└── .env.example                           # 环境变量示例
```

## Harness 的六层控制

### 1. Feedforward：事前引导

CLAUDE.md 在 agent 开工前告诉它：

- 分层规则：Controller → Service → Mapper，禁止穿透
- SQL 安全：只用参数化查询（`?` 占位符），禁止拼接用户输入
- 日志安全：禁止输出密钥、token、手机号等敏感信息
- 完成前必须运行 `./scripts/agent-check.sh`

### 2. Architecture Fitness：架构守护

分层测试自动检查分层边界：

- Controller 禁止直接 import Mapper
- Service 禁止 import Controller

agent 如果在 Controller 里直接调 Mapper，测试立刻红。

### 3. Feedback：事后检查

`scripts/agent-check.sh` 按顺序执行：

| 检查         | 工具      | 抓什么                     |
| ------------ | --------- | -------------------------- |
| 代码风格     | ESLint    | 命名、格式、最佳实践       |
| 单元测试     | Jest      | 功能正确性、分层边界       |

### 4. Behaviour Harness：fixture 驱动

关键输入输出由人确认，agent 不能改：

```json
{
  "request": { "username": "wangwu", "email": "wangwu@example.com" },
  "expectedResponse": { "username": "wangwu", "status": "ACTIVE" }
}
```

- fixture 是人类确认的验收样例，agent 不得为了让测试通过而修改它
- 新增行为可以新增 fixture，但要说明业务含义
- 修改 fixture 必须在 PR 描述里单独解释

### 5. AI Review：智能审查(可以在 CI/CD是配置，此处通过 skills 代替)

代码通过自动检查后，由 AI 对变更进行语义级审查。CLAUDE.md 铁律强制要求在 agent-check.sh 通过后必须执行。

调用方式（根据使用的工具）：
- **Claude Code**：执行 `/ai-review`

审查维度：

- **过度设计**：是否引入了当前不需要的抽象层、接口或配置
- **误解需求**：实现是否偏离了 fixture 或 API 契约描述的业务意图
- **测试自嗨**：测试是否只覆盖了实现细节，而非业务行为（如 mock 了所有依赖却没验证任何可见输出）

输出结构化审查报告，每项给出 ✅/⚠️/❌ 结论。❌ 项必须修复后从 agent-check.sh 重新开始，⚠️ 项由人工 Review 做最终判断。

AI Review 在自动检查通过后、人工 Review 之前执行，过滤掉机器能发现的语义问题，减少人工审查负担。

### 6. Human Review：人工把关

最终兜底环节，由人做机器无法替代的判断：

- **语义判断**：错误信息措辞是否恰当、API 命名是否符合业务术语
- **业务取舍**：多个技术方案之间做出业务权衡（如性能 vs 一致性）
- **上下文感知**：结合项目历史、团队约定、产品规划等机器不具备的隐性知识

Human Review 是 Harness 闭环的最后一道门，任何自动检查和 AI 审查都不能替代它。

## 后续

## 快速开始

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 运行代码风格检查
npm run lint

# 运行完整检查（agent 每次改完代码必须跑这个）
./scripts/agent-check.sh
```

## API 接口

| 方法   | 路径                | 说明         |
| ------ | ------------------- | ------------ |
| POST   | `/api/users`        | 创建用户     |
| GET    | `/api/users`        | 获取所有用户 |
| DELETE | `/api/users/{id}`   | 删除用户     |

## 技术栈

- Node.js + Express 4 + TypeScript 5
- Prisma 6（类型安全查询）
- Zod（运行时 schema 校验）
- winston（结构化日志）
- Jest + Supertest + ts-jest（测试）
- ESLint + airbnb-typescript（代码风格）

## 后续演进

当前 Harness 侧重**信息边界（L1）**和**约束校验（L6）**，评估观测（L5）也比较充分。以下是后续按需补强的方向，遇到痛点再补，不预设：

| 层级 | 解决什么问题 | 什么时候补 |
|------|-------------|-----------|
| L2 工具系统层 | agent 该用什么工具、什么时候用、怎么提炼结果 | agent 反复选错工具或遗漏必要步骤时 |
| L3 执行编排层 | 接到需求后的实现流程（先改什么、后改什么） | agent 频繁走弯路或返工时 |
| L4 记忆与状态层 | 长任务断点续做、中间产物追踪 | 跨多轮对话的大任务经常断档时 |
| L6 恢复侧 | 出错后的诊断指引、结构化回滚、降级策略 | agent 修错越改越乱时 |
