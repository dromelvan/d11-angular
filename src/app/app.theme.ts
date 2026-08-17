import { definePreset, palette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const PRIMARY = '#0b164f';
export const BACKGROUND = '#f2f1ee';

export const D11Light = definePreset(Aura, {
  semantic: {
    primary: palette(PRIMARY),
    colorScheme: {
      light: {
        surface: {
          50: BACKGROUND,
        },
        primary: {
          hoverColor: 'var(--p-primary-400)',
        },
        success: '{green.700}',
        error: '{red.700}',
        warning: '{yellow.500}',
        neutral: '{surface.500}',
      },
    },
    disabledOpacity: 0.75,
  },

  components: {
    button: {
      colorScheme: {
        light: {
          root: {
            secondary: {
              background: '{gray.100}',
              hoverBackground: '{gray.200}',
              activeBackground: '{gray.300}',
            },
            contrast: {
              background: '{surface.500}',
              hoverBackground: '{surface.600}',
              activeBackground: '{surface.700}',
              borderColor: '{surface.500}',
              hoverBorderColor: '{surface.600}',
              activeBorderColor: '{surface.700}',
            },
          },
        },
      },
    },
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
    paginator: {
      root: {
        background: BACKGROUND,
      },
      navButton: {
        color: '{text.color}',
        hoverColor: '{text.color}',
      },
    },
    accordion: {
      panel: {
        borderWidth: '0',
      },
      header: {
        padding: '0',
        fontWeight: '400',
        borderRadius: '0',
        color: 'inherit',
        hoverColor: 'inherit',
        activeColor: 'inherit',
        activeHoverColor: 'inherit',
        background: 'transparent',
        hoverBackground: 'transparent',
        activeBackground: 'transparent',
        activeHoverBackground: 'transparent',
      },
      content: {
        background: '{gray.100}',
        padding: '0',
        borderWidth: '0',
      },
    },
    dialog: {
      root: {
        borderRadius: '25px',
      },
      footer: {
        padding: '1rem',
      },
    },
  },
});
