import { AppError } from '../../../common/domain/exceptions/app-error';

export class RoleNotFoundError extends AppError {
  constructor(code: string) {
    super(`Role with code ${code} not found.`);
  }
}
