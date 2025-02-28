import { AppError } from '../../../common/domain/exceptions/app-error';

export class EmailNotFoundError extends AppError {
  constructor(email: string) {
    super(`Entity with email ${email} not found.`);
  }
}
