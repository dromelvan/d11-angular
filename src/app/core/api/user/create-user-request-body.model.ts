export interface CreateUserRequestBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  confirmRegistrationLink: string;
}
