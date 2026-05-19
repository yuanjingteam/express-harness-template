import { User } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { IUserRepository } from './user.repository.interface';

export class UserRepository implements IUserRepository {
  async create(data: {
    username: string;
    email: string;
    phone?: string | null;
    status: string;
  }): Promise<User> {
    return prisma.user.create({ data });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async findById(id: bigint): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async delete(id: bigint): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }

}
