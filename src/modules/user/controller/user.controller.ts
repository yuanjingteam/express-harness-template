import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { UserService } from '../service/user.service';
import { CreateUserRequestSchema } from '../dto/user.dto';
import { ValidationError } from '../../../shared/errors';
import logger from '../../../shared/logger';

const UserIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'id must be a positive integer').transform(Number),
});

export class UserController {
  constructor(private readonly userService: UserService) {}

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = CreateUserRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.issues.map(
          (issue) => `${issue.path.join('.')}: ${issue.message}`,
        );
        throw new ValidationError(details);
      }

      const response = await this.userService.createUser(parsed.data);
      logger.info('Creating user', { username: parsed.data.username });
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  };

  listUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.findAll();
      res.json(users);
    } catch (err) {
      next(err);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = UserIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        const details = parsed.error.issues.map(
          (issue) => `${issue.path.join('.')}: ${issue.message}`,
        );
        throw new ValidationError(details);
      }

      const response = await this.userService.deleteUser(parsed.data.id);
      logger.info('Deleting user', { id: parsed.data.id });
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

}
