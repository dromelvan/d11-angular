import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { User } from '@app/core/api/model/user.model';
import { DeleteFn, PostFn, PutFn, fakeUser } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { describe } from 'vitest';
import { ConfirmUserRequestBody } from './confirm-user-request-body.model';
import { CreateUserRequestBody } from './create-user-request-body.model';
import { UpdateUserRequestBody } from './update-user-request-body.model';
import { UserApiService } from './user-api.service';
import { UserResponseBody } from './user-response-body.model';

describe('UserApiService', () => {
  let userApi: UserApiService;
  let apiServiceMock: { post: PostFn; put: PutFn; delete: DeleteFn };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserApiService,
        {
          provide: ApiService,
          useValue: {
            post: vi.fn() as PostFn,
            put: vi.fn() as PutFn,
            delete: vi.fn() as DeleteFn,
          },
        },
      ],
    });

    userApi = TestBed.inject(UserApiService);
    apiServiceMock = TestBed.inject(ApiService) as { post: PostFn; put: PutFn; delete: DeleteFn };
  });

  it('is created', () => {
    expect(userApi).toBeTruthy();
  });

  // createUser -----------------------------------------------------------------------------------

  describe('createUser', () => {
    const user: User = fakeUser();
    const body: CreateUserRequestBody = {
      name: user.name,
      email: 'user@example.com',
      password: 'password',
      confirmPassword: 'password',
      confirmRegistrationLink: 'https://example.com/confirm',
    };
    const response: UserResponseBody = { user };

    it('calls post with namespace and body', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(response)) as PostFn;

      await firstValueFrom(userApi.createUser(body));

      expect(apiServiceMock.post).toHaveBeenCalledExactlyOnceWith(
        userApi.namespace,
        undefined,
        body,
      );
    });

    it('maps the result', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(response)) as PostFn;

      const result = await firstValueFrom(userApi.createUser(body));

      expect(result).toEqual(user);
    });

    it('propagates errors', async () => {
      const error = new Error('CONFLICT');
      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => error)) as PostFn;

      await expect(firstValueFrom(userApi.createUser(body))).rejects.toThrow(error.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => new Error())) as PostFn;

      await expect(firstValueFrom(userApi.createUser(body))).rejects.toBeInstanceOf(Error);
    });
  });

  // confirmUser ----------------------------------------------------------------------------------

  describe('confirmUser', () => {
    const body: ConfirmUserRequestBody = {
      email: 'user@example.com',
      confirmRegistrationToken: '550e8400-e29b-41d4-a716-446655440000',
    };

    it('calls post with namespace, endpoint and body', async () => {
      apiServiceMock.post = vi.fn().mockReturnValue(of(undefined)) as PostFn;

      await firstValueFrom(userApi.confirmUser(body));

      expect(apiServiceMock.post).toHaveBeenCalledExactlyOnceWith(
        userApi.namespace,
        'confirm',
        body,
      );
    });

    it('propagates errors', async () => {
      const error = new Error('BAD_REQUEST');
      apiServiceMock.post = vi.fn().mockReturnValue(throwError(() => error)) as PostFn;

      await expect(firstValueFrom(userApi.confirmUser(body))).rejects.toThrow(error.message);
    });
  });

  // updateUser -----------------------------------------------------------------------------------

  describe('updateUser', () => {
    const userId = 1;
    const user: User = fakeUser();
    const body: UpdateUserRequestBody = {
      currentPassword: 'oldpassword',
      password: 'newpassword',
      confirmPassword: 'newpassword',
    };
    const response: UserResponseBody = { user };

    it('calls put with namespace, id and body', async () => {
      apiServiceMock.put = vi.fn().mockReturnValue(of(response)) as PutFn;

      await firstValueFrom(userApi.updateUser(userId, body));

      expect(apiServiceMock.put).toHaveBeenCalledExactlyOnceWith(userApi.namespace, userId, body);
    });

    it('maps the result', async () => {
      apiServiceMock.put = vi.fn().mockReturnValue(of(response)) as PutFn;

      const result = await firstValueFrom(userApi.updateUser(userId, body));

      expect(result).toEqual(user);
    });

    it('propagates errors', async () => {
      const error = new Error('UNAUTHORIZED');
      apiServiceMock.put = vi.fn().mockReturnValue(throwError(() => error)) as PutFn;

      await expect(firstValueFrom(userApi.updateUser(userId, body))).rejects.toThrow(error.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.put = vi.fn().mockReturnValue(throwError(() => new Error())) as PutFn;

      await expect(firstValueFrom(userApi.updateUser(userId, body))).rejects.toBeInstanceOf(Error);
    });
  });

  // deleteUser -----------------------------------------------------------------------------------

  describe('deleteUser', () => {
    const userId = 1;

    it('calls delete with namespace and id', async () => {
      apiServiceMock.delete = vi.fn().mockReturnValue(of(undefined)) as DeleteFn;

      await firstValueFrom(userApi.deleteUser(userId));

      expect(apiServiceMock.delete).toHaveBeenCalledExactlyOnceWith(userApi.namespace, userId);
    });

    it('propagates errors', async () => {
      const error = new Error('NOT_FOUND');
      apiServiceMock.delete = vi.fn().mockReturnValue(throwError(() => error)) as DeleteFn;

      await expect(firstValueFrom(userApi.deleteUser(userId))).rejects.toThrow(error.message);
    });
  });
});
