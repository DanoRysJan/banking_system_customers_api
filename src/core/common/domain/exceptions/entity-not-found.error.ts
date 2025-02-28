import { AppError } from './app-error';

export class EntityNotFoundError extends AppError {
  constructor(id: string) {
    super(`Entity with ID ${id} not found.`);
  }
}
