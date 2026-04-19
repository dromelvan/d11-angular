import { render } from '@testing-library/angular';
import { expect } from 'vitest';
import { MessageService } from 'primeng/api';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await render(App, {
      providers: [MessageService],
    });
  });

  it('renders header', () => {
    expect(document.querySelector('app-header')).toBeInTheDocument();
  });

  it('renders loading', () => {
    expect(document.querySelector('app-loading')).toBeInTheDocument();
  });

  it('renders router outlet', () => {
    expect(document.querySelector('router-outlet')).toBeInTheDocument();
  });
});
