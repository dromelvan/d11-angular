import { ValidationError } from './validation-error.model';

export interface BadRequestErrorBody {
  validationErrors?: ValidationError[];
}
