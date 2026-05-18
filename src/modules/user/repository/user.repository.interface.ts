import { User } from '@prisma/client';

export interface IUserRepository {
  create(data: { username: string; email: string; phone?: string | null; status: string }): Promise<User>;
  findAll(): Promise<User[]>;
  deleteById(id: bigint): Promise<number>;
}
