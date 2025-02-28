import { AppError } from './app-error';

export class DuplicatedEntityError extends AppError {
  constructor(detail: string) {
    super(`Entity with ${detail}`);
  }
}
