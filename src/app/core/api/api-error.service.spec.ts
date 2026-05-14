import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ApiError } from './model/api-error.model';
import { ApiErrorService } from './api-error.service';

const mockApiError: ApiError = {
  status: 500,
  method: 'GET',
  url: '/api/resource/1',
  message: 'Http failure response for /api/resource/1: 500 Internal Server Error',
  body: '{"detail":"Something went wrong"}',
};

describe('ApiErrorService', () => {
  let service: ApiErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiErrorService);
  });

  it('error is null initially', () => {
    expect(service.error()).toBeNull();
  });

  it('setError sets the error signal', () => {
    service.setError(mockApiError);

    expect(service.error()).toEqual(mockApiError);
  });

  it('setError replaces a previously set error', () => {
    service.setError(mockApiError);

    const updatedError: ApiError = { ...mockApiError, status: 404 };
    service.setError(updatedError);

    expect(service.error()).toEqual(updatedError);
  });
});
