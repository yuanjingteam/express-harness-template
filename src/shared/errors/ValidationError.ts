import { AppError } from './AppError';

export class ValidationError extends AppError {
  public readonly details: string[];

  constructor(details: string[]) {
    super('Validation failed', 400);
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
