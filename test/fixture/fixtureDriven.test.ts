import fs from 'fs';
import path from 'path';
import request from 'supertest';
import type { Application } from 'express';

/**
 *  关键行为验收测试：fixture 文件是人确认过的"标准答案"，Agent 不能改
 */

// 模拟Prisma客户端
jest.mock('../../src/shared/prisma', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
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

describe('Fixture Driven Test', () => {
  it('userCreateSuccess', async () => {
    const fixturePath = path.join(__dirname, '../fixtures/user-create-success.json');
    const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));

    const { request: requestPayload, expectedResponse } = fixture;

    mockPrisma.user.create.mockResolvedValue({
      id: BigInt(1),
      username: requestPayload.username,
      email: requestPayload.email,
      phone: requestPayload.phone,
      status: 'ACTIVE',
    });

    const response = await request(app)
      .post('/api/users')
      .send(requestPayload)
      .expect(201);

    expect(response.body.username).toBe(expectedResponse.username);
    expect(response.body.status).toBe(expectedResponse.status);
  });
});
