import { PlayerInput } from '@app/core/api/model/player-input.model';

export type { PlayerInput };

export interface PlayerInputRequestBody {
  player: PlayerInput;
}
