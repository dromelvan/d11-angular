import { render } from '@testing-library/angular';
import { expect } from 'vitest';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await render(App);
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
