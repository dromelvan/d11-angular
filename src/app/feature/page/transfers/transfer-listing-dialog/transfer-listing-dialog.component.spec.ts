import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { fakeTransferListing } from '@app/test';
import { TransferListing } from '@app/core/api';
import { expect } from 'vitest';
import { TransferListingDialogComponent } from './transfer-listing-dialog.component';

function fakeConfig(transferListing?: TransferListing) {
  const currentTransferListing = transferListing ?? fakeTransferListing();
  const current = signal(currentTransferListing);
  return { data: { current } };
}

describe('TransferListingDialogComponent', () => {
  async function setup(transferListing?: TransferListing) {
    const config = fakeConfig(transferListing);
    await render(TransferListingDialogComponent, {
      providers: [{ provide: DynamicDialogConfig, useValue: config }],
    });
    return config;
  }

  it('renders position', async () => {
    const transferListing = fakeTransferListing();
    await setup(transferListing);

    expect(screen.getByText(transferListing.position.name)).toBeInTheDocument();
  });

  it('renders team', async () => {
    const transferListing = fakeTransferListing();
    await setup(transferListing);

    expect(screen.getByText(transferListing.team.name)).toBeInTheDocument();
  });

  it('renders d11 team', async () => {
    const transferListing = fakeTransferListing();
    await setup(transferListing);

    expect(screen.getByText(transferListing.d11Team.name)).toBeInTheDocument();
  });

  it('renders ranking', async () => {
    const transferListing = fakeTransferListing();
    await setup(transferListing);

    expect(screen.getByText(`#${transferListing.ranking}`)).toBeInTheDocument();
  });

  it('renders points', async () => {
    const transferListing = { ...fakeTransferListing(), points: 42 };
    await setup(transferListing);

    expect(screen.getAllByText('42').length).toBeGreaterThanOrEqual(1);
  });

  it('renders form match points', async () => {
    const transferListing = { ...fakeTransferListing(), formMatchPoints: [3, -2, 0, 1, 4] };
    await setup(transferListing);

    expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('-2')).toBeInTheDocument();
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);
  });

  it('renders goals', async () => {
    const transferListing = { ...fakeTransferListing(), goals: 7 };
    await setup(transferListing);

    expect(screen.getAllByText('7').length).toBeGreaterThanOrEqual(1);
  });

  it('renders assists', async () => {
    const transferListing = { ...fakeTransferListing(), goalAssists: 5 };
    await setup(transferListing);

    expect(screen.getAllByText('5').length).toBeGreaterThanOrEqual(1);
  });

  it('renders rating', async () => {
    const transferListing = { ...fakeTransferListing(), rating: 500 };
    await setup(transferListing);

    expect(screen.getByText('5.00')).toBeInTheDocument();
  });

  it('renders man of the match', async () => {
    const transferListing = { ...fakeTransferListing(), manOfTheMatch: 3, sharedManOfTheMatch: 1 };
    await setup(transferListing);

    expect(screen.getByText('3/1')).toBeInTheDocument();
  });

  it('renders points per appearance', async () => {
    const transferListing = { ...fakeTransferListing(), pointsPerAppearance: 200 };
    await setup(transferListing);

    expect(screen.getByText('2.00')).toBeInTheDocument();
  });

  it('renders games started', async () => {
    const transferListing = { ...fakeTransferListing(), gamesStarted: 37 };
    await setup(transferListing);

    expect(screen.getAllByText('37').length).toBeGreaterThanOrEqual(1);
  });

  it('renders games substitute', async () => {
    const transferListing = { ...fakeTransferListing(), gamesSubstitute: 8 };
    await setup(transferListing);

    expect(screen.getAllByText('8').length).toBeGreaterThanOrEqual(1);
  });

  it('renders minutes played', async () => {
    const transferListing = { ...fakeTransferListing(), minutesPlayed: 1234 };
    await setup(transferListing);

    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('renders goals conceded', async () => {
    const transferListing = { ...fakeTransferListing(), goalsConceded: 11 };
    await setup(transferListing);

    expect(screen.getAllByText('11').length).toBeGreaterThanOrEqual(1);
  });

  it('renders clean sheets', async () => {
    const transferListing = { ...fakeTransferListing(), cleanSheets: 9 };
    await setup(transferListing);

    expect(screen.getAllByText('9').length).toBeGreaterThanOrEqual(1);
  });

  it('renders yellow cards', async () => {
    const transferListing = { ...fakeTransferListing(), yellowCards: 6 };
    await setup(transferListing);

    expect(screen.getAllByText('6').length).toBeGreaterThanOrEqual(1);
  });

  it('renders red cards', async () => {
    const transferListing = { ...fakeTransferListing(), redCards: 2 };
    await setup(transferListing);

    expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);
  });

  it('renders own goals', async () => {
    const transferListing = { ...fakeTransferListing(), ownGoals: 4 };
    await setup(transferListing);

    expect(screen.getAllByText('4').length).toBeGreaterThanOrEqual(1);
  });
});
