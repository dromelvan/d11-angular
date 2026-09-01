import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CurrentService } from '@app/core/current/current.service';
import { SeasonBase } from '@app/core/api';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeSeasonBase } from '@app/test';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';
import { MorePageComponent } from './more-page.component';

const season = fakeSeasonBase();

const mockRouterService = {
  navigateToHistory: vi.fn(),
  navigateToRules: vi.fn(),
  navigateToD11Teams: vi.fn(),
};

const mockCurrentService = {
  season: signal<SeasonBase | undefined>(season),
};

describe('MorePageComponent', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockCurrentService.season.set(season);
    await render(MorePageComponent, {
      providers: [
        { provide: RouterService, useValue: mockRouterService },
        { provide: CurrentService, useValue: mockCurrentService },
      ],
    });
  });

  it('renders', () => {
    expect(document.querySelector('.app-more-page')).toBeInTheDocument();
  });

  it('renders section', () => {
    expect(screen.getByTestId('section-header')).toBeInTheDocument();
  });

  it('sets page context title to More', () => {
    expect(TestBed.inject(PageContextService).title()).toBe('More');
  });

  it('sets page context subtitle to Season <name>', () => {
    expect(TestBed.inject(PageContextService).subtitle()).toBe(`Season ${season.name}`);
  });

  it('sets page context subtitle to empty string when season is not set', () => {
    mockCurrentService.season.set(undefined);
    expect(TestBed.inject(PageContextService).subtitle()).toBe('');
  });

  it('renders History button', () => {
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('calls navigateToHistory on History click', async () => {
    await userEvent.click(screen.getByText('History'));

    expect(mockRouterService.navigateToHistory).toHaveBeenCalledOnce();
  });

  it('renders Rules button', () => {
    expect(screen.getByText('Rules')).toBeInTheDocument();
  });

  it('calls navigateToRules on Rules click', async () => {
    await userEvent.click(screen.getByText('Rules'));

    expect(mockRouterService.navigateToRules).toHaveBeenCalledOnce();
  });

  it('renders D11 Teams button', () => {
    expect(screen.getByText('D11 Teams')).toBeInTheDocument();
  });

  it('calls navigateToD11Teams on D11 Teams click', async () => {
    await userEvent.click(screen.getByText('D11 Teams'));

    expect(mockRouterService.navigateToD11Teams).toHaveBeenCalledOnce();
  });
});
