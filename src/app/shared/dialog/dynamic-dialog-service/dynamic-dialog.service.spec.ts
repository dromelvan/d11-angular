import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogService } from './dynamic-dialog.service';
import { fakePlayerMatchStat } from '@app/core/api/test/faker-util';
import { PlayerDialogMatchStatComponent } from '@app/feature/page/player/player-dialog-match-stat/player-dialog-match-stat.component';

function buildDialogService() {
  return { open: vi.fn().mockReturnValue({ close: vi.fn() }) };
}

describe('DynamicDialogService', () => {
  let service: DynamicDialogService;
  let dialogService: ReturnType<typeof buildDialogService>;

  beforeEach(() => {
    dialogService = buildDialogService();
    TestBed.configureTestingModule({
      providers: [{ provide: DialogService, useValue: dialogService }],
    });
    service = TestBed.inject(DynamicDialogService);
  });

  describe('openPlayerMatchStat', () => {
    it('opens the player match stat dialog component', () => {
      const stat = fakePlayerMatchStat();
      service.openPlayerMatchStat(stat, [stat]);

      expect(dialogService.open).toHaveBeenCalledWith(
        PlayerDialogMatchStatComponent,
        expect.objectContaining({ modal: true }),
      );
    });

    it('sets data.player from playerMatchStat.player', () => {
      const stat = fakePlayerMatchStat();
      service.openPlayerMatchStat(stat, [stat]);

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.player).toBe(stat.player);
    });

    it('sets data.current as a signal pointing to the passed stat', () => {
      const stat = fakePlayerMatchStat();
      service.openPlayerMatchStat(stat, [stat]);

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.current()).toBe(stat);
    });

    it('sets data.list to the provided playerMatchStats array', () => {
      const stats = [fakePlayerMatchStat(), fakePlayerMatchStat()];
      service.openPlayerMatchStat(stats[0], stats);

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.list).toBe(stats);
    });

    it('sets data.action.label to "Match stats"', () => {
      const stat = fakePlayerMatchStat();
      service.openPlayerMatchStat(stat, [stat]);

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.action.label).toBe('Match stats');
    });

    it('sets data.action.icon to "calendar"', () => {
      const stat = fakePlayerMatchStat();
      service.openPlayerMatchStat(stat, [stat]);

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.action.icon).toBe('calendar');
    });

    it('closes the previous dialog before opening a new one', () => {
      const stats = [fakePlayerMatchStat(), fakePlayerMatchStat()];
      service.openPlayerMatchStat(stats[0], stats);

      const firstRef = dialogService.open.mock.results[0].value;
      service.openPlayerMatchStat(stats[1], stats);

      expect(firstRef.close).toHaveBeenCalled();
      expect(dialogService.open).toHaveBeenCalledTimes(2);
    });
  });
});
