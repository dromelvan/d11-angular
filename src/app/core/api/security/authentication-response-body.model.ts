import { User } from '@app/core/api';

export interface AuthenticationResponseBody {
  user: User;
  jwt: string;
  expiresAt: string;
  persistent: boolean;
}
