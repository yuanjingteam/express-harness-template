import { User } from '@prisma/client';

export interface IUserRepository {
  create(data: { username: string; email: string; phone?: string | null; status: string }): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: bigint): Promise<User | null>;
  delete(id: bigint): Promise<User>;
}
