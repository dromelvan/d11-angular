import { App } from './app';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';

describe('App', () => {
  test('Hello is visible', async () => {
    await render(App);

    expect(screen.getByText('Hello, d11-angular')).toBeVisible();
  });
});
