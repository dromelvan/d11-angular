import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { User } from '@app/core/api/model/user.model';
import { ConfirmUserRequestBody } from './confirm-user-request-body.model';
import { CreateUserRequestBody } from './create-user-request-body.model';
import { UpdateUserRequestBody } from './update-user-request-body.model';
import { UserResponseBody } from './user-response-body.model';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  readonly namespace = 'users';
  private apiService = inject(ApiService);

  createUser(body: CreateUserRequestBody): Observable<User> {
    return this.apiService
      .post<UserResponseBody>(this.namespace, undefined, body)
      .pipe(map((result) => result.user));
  }

  confirmUser(body: ConfirmUserRequestBody): Observable<void> {
    return this.apiService.post<void>(this.namespace, 'confirm', body);
  }

  updateUser(userId: number, body: UpdateUserRequestBody): Observable<User> {
    return this.apiService
      .put<UserResponseBody>(this.namespace, userId, body)
      .pipe(map((result) => result.user));
  }

  deleteUser(userId: number): Observable<void> {
    return this.apiService.delete(this.namespace, userId);
  }
}
