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

  components: {
    card: {
      title: {
        fontWeight: 'bold',
        fontSize: '1.5rem',
      },
      body: {
        padding: '1rem',
        gap: '1rem',
      },
    },
    tabs: {
      tab: {
        padding: '.5rem',
      },
      tabpanel: {
        padding: '1rem 0rem',
      },
    },
  },
});
