import { User } from '@app/core/api/model/user.model';

export interface AuthenticationResponseBody {
  user: User;
  jwt: string;
  expiresAt: string;
  persistent: boolean;
}
