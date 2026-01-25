import { User } from '@app/core/api';

export interface AuthorizationResponseBody {
  user: User;
  jwt: string;
  expiresAt: string;
  persistent: boolean;
}
