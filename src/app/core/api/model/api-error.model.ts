export interface ApiError {
  status: number;
  method: string;
  url: string;
  message: string;
  body?: string;
}
