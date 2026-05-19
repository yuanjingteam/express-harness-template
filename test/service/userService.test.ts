/**
 *  用户服务单元测试，只测 Service 层逻辑
 */
import { UserService } from '../../src/modules/user/service/user.service';
import { IUserRepository } from '../../src/modules/user/repository/user.repository.interface';
import { User } from '@prisma/client';
// 测试用的模拟用户
const mockUser: User = {
  id: BigInt(1),
  username: 'testuser',
  email: 'test@example.com',
  phone: '13800000000',
  status: 'ACTIVE',
};


const createMockRepo = (): jest.Mocked<IUserRepository> => ({
  create: jest.fn().mockResolvedValue(mockUser),
  findAll: jest.fn().mockResolvedValue([mockUser]),
  findById: jest.fn().mockResolvedValue(mockUser),
  delete: jest.fn().mockResolvedValue(mockUser),
});

describe('UserService', () => {
  let userService: UserService;
  let mockRepo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepo = createMockRepo();
    userService = new UserService(mockRepo);
  });

  /**
   *  测试创建用户成功
   */
  describe('createUser', () => {
    it('should return correct response after creating user', async () => {
      const response = await userService.createUser({
        username: 'testuser',
        email: 'test@example.com',
        phone: '13800000000',
      });

      expect(response).toMatchObject({
        id: 1,
        username: 'testuser',
        status: 'ACTIVE',
      });

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'testuser',
          email: 'test@example.com',
          status: 'ACTIVE',
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return list of user responses', async () => {
      const users = await userService.findAll();

      expect(users).toHaveLength(1);
      expect(users[0]).toMatchObject({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        phone: '13800000000',
        status: 'ACTIVE',
      });
    });
  });

  describe('deleteUser', () => {
    it('should return deleted user response', async () => {
      const response = await userService.deleteUser(1);

      expect(response).toMatchObject({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        status: 'ACTIVE',
      });

      expect(mockRepo.findById).toHaveBeenCalledWith(BigInt(1));
      expect(mockRepo.delete).toHaveBeenCalledWith(BigInt(1));
    });

    it('should throw NotFoundError when user does not exist', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(userService.deleteUser(999)).rejects.toThrow('User with id 999 not found');
    });
  });

});
