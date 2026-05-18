import { Request, Response, NextFunction } from 'express';
import { UserService } from '../service/user.service';
import { CreateUserRequestSchema } from '../dto/user.dto';
import { ValidationError } from '../../../shared/errors';
import logger from '../../../shared/logger';

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
      const userId = Number(req.params.id);
      if (Number.isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user id' });
        return;
      }
      await this.userService.deleteUser(userId);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  };
}
