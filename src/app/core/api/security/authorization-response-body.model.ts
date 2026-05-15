import { D11TeamBase } from '@app/core/api/model/d11-team-base.model';
import { User } from '@app/core/api/model/user.model';

export interface AuthorizationResponseBody {
  user: User;
  d11Team?: D11TeamBase;
  jwt: string;
  expiresAt: string;
  persistent: boolean;
}
