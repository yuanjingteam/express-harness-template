import { AppError } from './AppError';

export class NotFoundError extends AppError {
  constructor(resource: string, id: string | number) {
    super(`${resource} with id ${id} not found`, 404);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
