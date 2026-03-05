import { computed, Directive, inject } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TeamBase } from '@app/core/api';
import { PRIMARY } from '@app/app.theme';
import { contrastTextClass } from '@app/shared/util/contrast-text.util';
import { TeamBaseContainer } from '@app/core/api/model/team-base-container';

@Directive()
export class DynamicListDialogHeaderComponent {
  protected current = computed<TeamBaseContainer>(() => this.config.data.current());
  protected list = computed<TeamBaseContainer[]>(() => this.config.data.list);

  protected team = computed<TeamBase>(() => this.current().team);

  protected backgroundColor = computed(() =>
    this.team() && !this.team()?.dummy ? this.team()?.colour : PRIMARY,
  );

  protected textClass = computed(() => contrastTextClass(this.backgroundColor()));

  protected index = computed(() => this.list().indexOf(this.current()));

  protected hasPrevious = computed(() => this.index() > 0);
  protected hasNext = computed(() => this.index() < this.list().length - 1);

  protected config = inject(DynamicDialogConfig);

  protected onPrevious(): void {
    this.config.data.current.set(this.list()[this.index() - 1]);
  }

  protected onNext(): void {
    this.config.data.current.set(this.list()[this.index() + 1]);
  }
}
