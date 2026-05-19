import request from 'supertest';
import type { Application } from 'express';

/**
 *  集成测试： 从 HTTP 请求到 Controller → Service → Repository 全链路走通，只是数据库用 mock 替代
 */

// 模拟Prisma客户端
jest.mock('../../src/shared/prisma', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}));

const mockPrisma = jest.requireMock('../../src/shared/prisma').prisma;

let app: Application;

beforeAll(() => {
  jest.isolateModules(() => {
    // eslint-disable-next-line global-require
    app = require('../../src/app').default;
  });
});

describe('UserController', () => {
  describe('POST /api/users', () => {
    it('should return 201 when creating a user', async () => {
      mockPrisma.user.create.mockResolvedValue({
        id: BigInt(1),
        username: 'testuser',
        email: 'test@example.com',
        phone: '13800000000',
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/users')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          phone: '13800000000',
        })
        .expect(201);

      expect(response.body).toMatchObject({
        id: 1,
        username: 'testuser',
        status: 'ACTIVE',
      });
    });

    it('should return 400 when username is blank', async () => {
      await request(app)
        .post('/api/users')
        .send({ username: '', email: 'test@example.com' })
        .expect(400);
    });

    it('should return 400 when email is invalid', async () => {
      await request(app)
        .post('/api/users')
        .send({ username: 'testuser', email: 'not-an-email' })
        .expect(400);
    });
  });

  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      mockPrisma.user.findMany.mockResolvedValue([
        {
          id: BigInt(1),
          username: 'zhangsan',
          email: 'zhangsan@example.com',
          phone: '13800000001',
          status: 'ACTIVE',
        },
      ]);

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        id: 1,
        username: 'zhangsan',
        email: 'zhangsan@example.com',
      });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should return 200 when deleting a user', async () => {
      const deletedUser = {
        id: BigInt(1),
        username: 'zhangsan',
        email: 'zhangsan@example.com',
        phone: '13800000001',
        status: 'ACTIVE',
      };

      mockPrisma.user.findUnique.mockResolvedValue(deletedUser);
      mockPrisma.user.delete.mockResolvedValue(deletedUser);

      const response = await request(app)
        .delete('/api/users/1')
        .expect(200);

      expect(response.body).toMatchObject({
        id: 1,
        username: 'zhangsan',
        email: 'zhangsan@example.com',
        status: 'ACTIVE',
      });
    });

    it('should return 400 when id is not a positive integer', async () => {
      await request(app)
        .delete('/api/users/abc')
        .expect(400);
    });

    it('should return 404 when user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await request(app)
        .delete('/api/users/999')
        .expect(404);
    });
  });

});
