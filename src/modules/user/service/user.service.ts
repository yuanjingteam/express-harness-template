import { User } from '@prisma/client';
import { IUserRepository } from '../repository/user.repository.interface';
import {
  CreateUserRequest,
  UserCreateResponse,
  UserResponse,
} from '../dto/user.dto';
import logger from '../../../shared/logger';
import { NotFoundError } from '../../../shared/errors';

function toCreateResponse(user: User): UserCreateResponse {
  return {
    id: Number(user.id),
    username: user.username,
    status: user.status,
  };
}

function toUserResponse(user: User): UserResponse {
  return {
    id: Number(user.id),
    username: user.username,
    email: user.email,
    phone: user.phone,
    status: user.status,
  };
}

export class UserService {
  constructor(private readonly userRepo: IUserRepository) {}

  async createUser(request: CreateUserRequest): Promise<UserCreateResponse> {
    const user = await this.userRepo.create({
      username: request.username,
      email: request.email,
      phone: request.phone ?? null,
      status: 'ACTIVE',
    });

    logger.info('User created', { id: Number(user.id), username: user.username });

    return toCreateResponse(user);
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepo.findAll();
    return users.map(toUserResponse);
  }

  async deleteUser(id: number): Promise<void> {
    const deleted = await this.userRepo.deleteById(BigInt(id));
    if (deleted === 0) {
      throw new NotFoundError('User', id);
    }
    logger.info('User deleted', { id });
  }
}
