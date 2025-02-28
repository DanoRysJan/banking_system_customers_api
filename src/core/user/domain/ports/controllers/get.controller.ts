import { User } from '../../models/user.entity';

export interface GetUserControllerPort<R, B> {
  getUser(id: string): Promise<User>;
}
