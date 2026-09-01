import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SeasonBase } from '@app/core/api';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { fakeSeasonBase } from '@app/test';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { RulesPageComponent } from './rules-page.component';

const season = fakeSeasonBase();

const mockCurrentService = {
  season: signal<SeasonBase | undefined>(season),
};

describe('RulesPageComponent', () => {
  beforeEach(async () => {
    mockCurrentService.season.set(season);
    await render(RulesPageComponent, {
      providers: [{ provide: CurrentService, useValue: mockCurrentService }],
    });
  });

  it('renders', () => {
    expect(document.querySelector('.app-rules-page')).toBeInTheDocument();
  });

  it('renders section', () => {
    expect(screen.getByTestId('section-header')).toBeInTheDocument();
  });

  it('sets page context title to Rules', () => {
    expect(TestBed.inject(PageContextService).title()).toBe('Rules');
  });

  it('sets page context subtitle to Season <name>', () => {
    expect(TestBed.inject(PageContextService).subtitle()).toBe(`Season ${season.name}`);
  });

  it('sets page context subtitle to empty string when season is not set', () => {
    mockCurrentService.season.set(undefined);
    expect(TestBed.inject(PageContextService).subtitle()).toBe('');
  });

  it('renders the page header', () => {
    expect(screen.getByText('Rules')).toBeInTheDocument();
  });

  it('renders section headers', () => {
    for (const header of [
      'Scoring',
      'Player points',
      'Participation fee',
      'The draft',
      'The transfer system',
    ]) {
      expect(screen.getByText(header)).toBeInTheDocument();
    }
  });
});
