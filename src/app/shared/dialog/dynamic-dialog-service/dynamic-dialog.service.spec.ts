import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogService } from './dynamic-dialog.service';
import { fakePlayerMatchStat } from '@app/core/api/test/faker-util';
import { PlayerDialogMatchStatComponent } from '@app/feature/page/player/player-dialog-match-stat/player-dialog-match-stat.component';
import { DialogFooterAction } from '@app/shared/dialog/dynamic-dialog-footer/dynamic-dialog-footer.component';

function buildDialogService() {
  return { open: vi.fn().mockReturnValue({ close: vi.fn() }) };
}

function fakeAction(): DialogFooterAction {
  return {
    label: 'Test',
    icon: 'test' as const,
    onClick: vi.fn() as (
      current: import('@app/core/api/model/team-base-container').TeamBaseContainer,
    ) => void,
  };
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
      service.openPlayerMatchStat(stat, [stat], fakeAction());

      expect(dialogService.open).toHaveBeenCalledWith(
        PlayerDialogMatchStatComponent,
        expect.objectContaining({ modal: true }),
      );
    });

    it('sets data.current as a signal pointing to the passed stat', () => {
      const stat = fakePlayerMatchStat();
      service.openPlayerMatchStat(stat, [stat], fakeAction());

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.current()).toBe(stat);
    });

    it('sets data.list to the provided playerMatchStats array', () => {
      const stats = [fakePlayerMatchStat(), fakePlayerMatchStat()];
      service.openPlayerMatchStat(stats[0], stats, fakeAction());

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.list).toBe(stats);
    });

    it('sets data.action to the provided action', () => {
      const stat = fakePlayerMatchStat();
      const action = fakeAction();
      service.openPlayerMatchStat(stat, [stat], action);

      const { data } = dialogService.open.mock.calls[0][1];
      expect(data.action).toBe(action);
    });

    it('closes the previous dialog before opening a new one', () => {
      const stats = [fakePlayerMatchStat(), fakePlayerMatchStat()];
      service.openPlayerMatchStat(stats[0], stats, fakeAction());

      const firstRef = dialogService.open.mock.results[0].value;
      service.openPlayerMatchStat(stats[1], stats, fakeAction());

      expect(firstRef.close).toHaveBeenCalled();
      expect(dialogService.open).toHaveBeenCalledTimes(2);
    });
  });
});
