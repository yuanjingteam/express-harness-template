import { z } from 'zod';

export const CreateUserRequestSchema = z.object({
  username: z.string().trim().min(1, 'username must not be blank'),
  email: z.string().trim().min(1, 'email must not be blank').email('email must be valid'),
  phone: z.string().trim().optional(),
});

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

export interface UserCreateResponse {
  id: number;
  username: string;
  status: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  status: string;
}
