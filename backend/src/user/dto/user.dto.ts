import { UserDocument } from '../schemas/user.schema';

export class UserDto {
  username: string;
  role: string;
  createdAt: Date;

  constructor(user: UserDocument) {
    if (user) {
      this.username = user.username;
      this.role = user.role;
      this.createdAt = user.createdAt;
    }
  }
}
