import fs from 'fs';
import path from 'path';
import request from 'supertest';
import type { Application } from 'express';

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
