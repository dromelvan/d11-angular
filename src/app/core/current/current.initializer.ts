import { inject, provideAppInitializer } from '@angular/core';
import { CurrentService } from './current.service';

export const provideCurrentInitializer = () =>
  provideAppInitializer(() => {
    inject(CurrentService);
  });
