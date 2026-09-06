import { ApiErrorService } from '@app/core/api/api-error.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { render, screen } from '@testing-library/angular';
import { beforeEach, describe, expect, it } from 'vitest';
import { ApiErrorPageComponent } from './api-error-page.component';

const mockPageContextService = { register: vi.fn() };
const providers = [{ provide: PageContextService, useValue: mockPageContextService }];

async function renderWithError(partial: Partial<Parameters<ApiErrorService['setError']>[0]> = {}) {
  const result = await render(ApiErrorPageComponent, { providers });
  const apiErrorService = result.fixture.debugElement.injector.get(ApiErrorService);
  apiErrorService.setError({
    status: 500,
    method: 'GET',
    url: '/api/resource/1',
    message: 'Http failure response for /api/resource/1: 500 Internal Server Error',
    body: '{"detail":"Something went wrong"}',
    ...partial,
  });
  result.fixture.detectChanges();
  return result;
}

describe('ApiErrorPageComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('with error', () => {
    beforeEach(async () => {
      await renderWithError();
    });

    it('renders', () => {
      expect(document.querySelector('app-section')).toBeInTheDocument();
    });

    it('renders HTTP status heading', () => {
      expect(screen.getByText('HTTP 500')).toBeInTheDocument();
    });

    it('renders method and URL', () => {
      expect(screen.getByText('GET /api/resource/1')).toBeInTheDocument();
    });

    it('renders message', () => {
      expect(
        screen.getByText('Http failure response for /api/resource/1: 500 Internal Server Error'),
      ).toBeInTheDocument();
    });

    it('renders response body', () => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });

  describe('with error and no body', () => {
    beforeEach(async () => {
      await renderWithError({ body: undefined });
    });

    it('does not render response body section', () => {
      expect(screen.queryByText('Response body')).not.toBeInTheDocument();
    });
  });

  describe('with network error', () => {
    beforeEach(async () => {
      await renderWithError({ status: 0, message: 'Network error', body: undefined });
    });

    it('renders Network Error heading', () => {
      expect(screen.getByText('Network Error')).toBeInTheDocument();
    });

    it('renders method and URL', () => {
      expect(screen.getByText('GET /api/resource/1')).toBeInTheDocument();
    });

    it('renders message', () => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    it('does not render response body section', () => {
      expect(screen.queryByText('Response body')).not.toBeInTheDocument();
    });
  });

  describe('without error', () => {
    beforeEach(async () => {
      await render(ApiErrorPageComponent, { providers });
    });

    it('renders fallback heading', () => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('renders no error details message', () => {
      expect(screen.getByText('No error details available.')).toBeInTheDocument();
    });
  });

  // page context ------------------------------------------------------------------------------------

  describe('page context', () => {
    beforeEach(async () => {
      await render(ApiErrorPageComponent, { providers });
    });

    it('registers with title Api Error', () => {
      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.title()).toBe('Api Error');
    });

    it('has no subtitle', () => {
      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.subtitle()).toBeUndefined();
    });

    it('registers with empty background color', () => {
      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.backgroundColor()).toBe('');
    });
  });
});
