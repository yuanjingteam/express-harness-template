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

## DELETE /api/users/:id

删除指定用户。

### 路径参数

- `id` (必填) — 用户 ID，正整数

### 响应 (200 OK)

```json
{
  "id": 1,
  "username": "zhangsan",
  "email": "zhangsan@example.com",
  "phone": "13800000001",
  "status": "ACTIVE"
}
```

### 错误响应 (400 Bad Request)

id 参数非法时返回：

```json
{
  "error": "Validation failed",
  "details": ["id: id must be a positive integer"]
}
```

### 错误响应 (404 Not Found)

用户不存在时返回：

```json
{
  "error": "User with id 999 not found"
}
```

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

