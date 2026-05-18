# 架构

## 分层

```
Controller  ->  Service  ->  Repository
(路由)         (业务)       (DB - Prisma)
```

- **Controller**：处理 HTTP 请求/响应，Zod 校验入参，只返回 DTO。
- **Service**：业务逻辑，事务边界，编排 Repository。通过构造函数注入 Repository 接口。
- **Repository**：实现接口，通过 Prisma Client 访问数据库，不包含业务逻辑。

## 核心规则

1. Controller 禁止直接调用 Repository。
2. Controller 端点禁止返回 Prisma Model（数据库实体）。
3. 所有数据库查询通过 Prisma Client（类型安全），禁止原始 SQL 拼接用户输入。
4. 事务由 Service 层管理。
5. Service 通过接口依赖 Repository，便于测试和替换。

## 企业级特性

- **Zod Schema 校验**：DTO 和环境变量均有运行时校验。
- **自定义错误体系**：`AppError` → `ValidationError` / `NotFoundError`，统一错误处理中间件。
- **Prisma Client 单例**：开发环境复用连接，避免热重载连接泄漏。
- **依赖注入**：Service 接收 Repository 接口，Controller 接收 Service 实例。

## 技术栈

- Node.js + Express 4 + TypeScript 5
- Prisma 6（MySQL，类型安全查询）
- Zod（运行时 schema 校验）
- winston（结构化日志）
- Jest + Supertest + ts-jest（测试）
