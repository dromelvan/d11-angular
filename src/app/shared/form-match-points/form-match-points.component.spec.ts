import { render, screen } from '@testing-library/angular';
import { FormMatchPointsComponent } from './form-match-points.component';

describe('FormMatchPointsComponent', () => {
  describe('player type', () => {
    it('renders bg-success for positive points', async () => {
      await render(FormMatchPointsComponent, {
        inputs: { formMatchPoints: [50], type: 'player' },
      });

      expect(screen.getByText('50')).toHaveClass('bg-success');
    });

    it('renders bg-error for negative points', async () => {
      await render(FormMatchPointsComponent, {
        inputs: { formMatchPoints: [-10], type: 'player' },
      });

      expect(screen.getByText('-10')).toHaveClass('bg-error');
    });

    it('renders bg-neutral for zero points', async () => {
      await render(FormMatchPointsComponent, {
        inputs: { formMatchPoints: [0], type: 'player' },
      });

      expect(screen.getByText('0')).toHaveClass('bg-neutral');
    });
  });

  describe('team type', () => {
    it('renders W with bg-success for 3 points', async () => {
      await render(FormMatchPointsComponent, {
        inputs: { formMatchPoints: [3], type: 'team' },
      });

      expect(screen.getByText('W')).toHaveClass('bg-success');
    });

    it('renders D with bg-neutral for 1 point', async () => {
      await render(FormMatchPointsComponent, {
        inputs: { formMatchPoints: [1], type: 'team' },
      });

      expect(screen.getByText('D')).toHaveClass('bg-neutral');
    });

    it('renders L with bg-error for 0 points', async () => {
      await render(FormMatchPointsComponent, {
        inputs: { formMatchPoints: [0], type: 'team' },
      });

      expect(screen.getByText('L')).toHaveClass('bg-error');
    });
  });

  it('renders multiple badges', async () => {
    const { container } = await render(FormMatchPointsComponent, {
      inputs: { formMatchPoints: [3, 1, 0], type: 'team' },
    });

    expect(container.querySelectorAll('span')).toHaveLength(3);
    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('renders no badges for empty list', async () => {
    const { container } = await render(FormMatchPointsComponent, {
      inputs: { formMatchPoints: [], type: 'player' },
    });

    expect(container.querySelectorAll('span')).toHaveLength(0);
  });
});
