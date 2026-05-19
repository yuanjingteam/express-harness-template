# User Service Agent 指南

## 铁律：完成前必须运行检查

每次修改代码后，提交给人类 review 之前，必须运行：

```bash
./scripts/agent-check.sh
```

检查不通过就修，通过了才能交差。没有例外。**禁止以任何理由跳过失败。**

---

开始工作前，先读 `docs/ai/` 下的文档了解系统架构和 API 契约。

## 架构

- 遵循 Controller -> Service -> Repository 分层。Controller 禁止直接调用 Repository。
- 事务边界放在 Service 方法上。
- DTO 是 API 契约，Controller 禁止暴露数据库实体（Prisma Model）。
- 数据访问通过 Prisma Client（类型安全的参数化查询），禁止原始 SQL 拼接用户输入。

## 依赖注入

- Service 通过构造函数接收 Repository 接口（`IUserRepository`），便于测试和替换实现。
- Repository 实现对应接口，Prisma Client 在 Repository 内部使用。

## 类型安全

- 所有 DTO 使用 Zod schema 定义，运行时和编译时双重保障。
- 环境变量通过 Zod 校验（`src/config/env.ts`），启动时即验证。

## 安全

- 校验所有请求体、路径参数和查询参数。
- 权限检查放在 Service 或 Controller 层。
- 禁止在日志中输出密钥、token、完整请求体、手机号、邮箱等敏感数据。
- 面向用户的错误信息应为通用描述，详细错误写入安全的结构化日志。

## 测试规范

- 测试文件中 mock 模块时，使用 `jest.isolateModules` + `require()` 加载被测模块，确保 mock 生效。
- Express app 实例的类型是 `import type { Application } from 'express'`，不要写 `let app: Express`。
- 测试文件已豁免 `@typescript-eslint/no-require-imports` 规则，可以正常使用 `require()`。

```typescript
import type { Application } from 'express';

jest.mock('../../src/shared/prisma', () => ({ ... }));
const mockPrisma = jest.requireMock('../../src/shared/prisma').prisma;

let app: Application;
beforeAll(() => {
  jest.isolateModules(() => {
    app = require('../../src/app').default;
  });
});
```

## Fixture 规则

- `test/fixtures/` 下的 fixture 文件由人类确认，agent 不得为了让测试通过而修改它。
- 新增行为可以新增 fixture，但要说明业务含义。
- 修改 fixture 必须在 PR 描述里单独解释。
- Fixture 文件命名规则：`{资源}-{操作}-{场景}.json`，如 `user-create-success.json`、`user-delete-not-found.json`。
- 每个 fixture 文件必须包含 `_meta` 字段，说明场景、含义和各字段定义。
