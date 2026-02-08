import { definePreset, palette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const D11Light = definePreset(Aura, {
  semantic: {
    primary: palette('#0b164f'),
    colorScheme: {
      light: {
        primary: {
          hoverColor: 'var(--p-primary-400)',
        },
      },
    },
    disabledOpacity: 0.75,
  },
});
