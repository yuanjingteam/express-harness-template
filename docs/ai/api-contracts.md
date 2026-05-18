# API 契约

## POST /api/users

创建新用户。

### 请求体

```json
{
  "username": "string (必填，不可为空)",
  "email": "string (必填，合法邮箱)",
  "phone": "string (可选)"
}
```

### 响应 (201 Created)

```json
{
  "id": "number",
  "username": "string",
  "status": "ACTIVE"
}
```

### 校验规则

- `username` 不可为空白。
- `email` 不可为空白，且必须是合法邮箱格式。

### 错误响应 (400 Bad Request)

```json
{
  "error": "Validation failed",
  "details": ["字段: 错误信息"]
}
```

## GET /api/users

获取所有用户列表。

### 响应 (200 OK)

```json
[
  {
    "id": 1,
    "username": "zhangsan",
    "email": "zhangsan@example.com",
    "phone": "13800000001",
    "status": "ACTIVE"
  }
]
```

## DELETE /api/users/{id}

删除指定用户。

### 响应 (204 No Content)

无响应体。
