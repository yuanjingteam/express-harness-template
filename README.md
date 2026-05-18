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

## Harness 的三层控制

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

- Node.js + Express 4
- mysql2（参数化查询）
- express-validator（请求校验）
- winston（结构化日志）
- Jest + Supertest（测试）
- ESLint + airbnb-base（代码风格）
