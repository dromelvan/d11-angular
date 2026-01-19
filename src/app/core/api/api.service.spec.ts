import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpHeaders, HttpParams, provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';

describe('ApiService', () => {
  const apiVersion = environment.apiVersion;
  const namespace = 'namespace';
  const endpoint = 'endpoint';
  const url = `/${apiVersion}/${namespace}/${endpoint}`;

  let apiService: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    apiService = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('is created', () => {
    expect(apiService).toBeTruthy();
  });

  it('calls post with url and body', async () => {
    const body = { foo: 'bar' };
    const promise = firstValueFrom(apiService.post(namespace, endpoint, body));

    const testRequest = httpMock.expectOne(url);
    expect(testRequest.request.method).toBe('POST');
    expect(testRequest.request.body).toEqual(body);

    testRequest.flush({});

    await promise;
  });

  it('calls post with headers and params', async () => {
    const param = 'a';
    const value = '1';
    const header = 'header';

    const options = {
      headers: new HttpHeaders({ Authorization: header }),
      params: new HttpParams().set(param, value),
    };

    const promise = firstValueFrom(apiService.post(namespace, endpoint, {}, options));

    const testRequest = httpMock.expectOne(
      (request) => request.url === url && request.params.get(param) === value,
    );
    expect(testRequest.request.headers.get('Authorization')).toBe(header);
    expect(testRequest.request.params.get(param)).toBe(value);

    testRequest.flush({});

    await promise;
  });

  it('responds to post with the typed response', async () => {
    const promise = firstValueFrom(apiService.post<{ value: number }>(namespace, endpoint, {}));
    const response = { value: 42 };

    const testRequest = httpMock.expectOne(url);
    testRequest.flush(response);

    const responseBody = await promise;
    expect(responseBody.value).toBe(response.value);
  });

  it('calls post and propagates HTTP errors', async () => {
    const errorPromise = firstValueFrom(apiService.post(namespace, endpoint, {}));
    const options = { status: 500, statusText: 'Error' };

    const testRequest = httpMock.expectOne(url);
    testRequest.flush({}, options);

    await expect(errorPromise).rejects.toMatchObject({ status: options.status });
  });
});
