import request from 'supertest';
import type { Application } from 'express';

jest.mock('../../src/shared/prisma', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
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
    it('should return 204 when deleting a user', async () => {
      mockPrisma.user.deleteMany.mockResolvedValue({ count: 1 });

      await request(app)
        .delete('/api/users/1')
        .expect(204);
    });

    it('should return 400 when id is invalid', async () => {
      await request(app)
        .delete('/api/users/abc')
        .expect(400);
    });

    it('should return 404 when user does not exist', async () => {
      mockPrisma.user.deleteMany.mockResolvedValue({ count: 0 });

      await request(app)
        .delete('/api/users/999')
        .expect(404);
    });
  });
});
