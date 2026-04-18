export interface Position {
  id: number;
  name: string;
  code: string;
  maxCount: number;
  defender: boolean;
  sortOrder: number;
}

export const POSITION_IDS = {
  KEEPER: 1,
  FULL_BACK: 2, // deprecated
  DEFENDER: 3,
  MIDFIELDER: 4,
  FORWARD: 5,
} as const;
