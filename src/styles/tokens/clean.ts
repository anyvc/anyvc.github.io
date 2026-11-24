import type { Tokens } from './types';
export const clean: Tokens = {
  color: {
    bg: '#FCFBF9', surface: '#FFFFFF', text: '#1C1B18', muted: '#5C5A54',
    border: '#DCD9D0', line: '#DCD9D0',
    accent: '#1D4ED8', accentText: '#1D4ED8', onAccent: '#FFFFFF', tint: '#EAF0FE',
  },
  font: {
    display: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    displayWeight: '800', numWeight: '800',
  },
  shape: {
    radius: '8px',
    cardBorder: '1px solid #DCD9D0',
    cardTop: '1px solid #DCD9D0',
    cardBg: '#FFFFFF',
    numSize: '2.5rem', numColor: '#1D4ED8',
  },
};
