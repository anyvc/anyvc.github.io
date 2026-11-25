import type { Tokens } from './types';
export const clean: Tokens = {
  color: {
    bg: '#FCFBF9', surface: '#FFFFFF', text: '#1C1B18', muted: '#5C5A54',
    border: '#DCD9D0', line: '#DCD9D0',
    accent: '#1D4ED8', accentText: '#1D4ED8', onAccent: '#FFFFFF', tint: '#E8EEFC',
    warn: '#B45309', danger: '#C83E37',
  },
  font: {
    display: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    serif: "'Newsreader', Georgia, serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    displayWeight: '700', numWeight: '800',
  },
  status: { d: '#1A1A1A', m: '#C0392B', f: '#A06A00', n: '#6B6B66', eyeFill: '#EAF0FE', slash: '#1C1B18' },
  deco: { heroGlow: '#EAF0FE', heroMid: '#F5F7FE', sectionTint: '#FFFFFF', bandOne: '#1C1B18', bandText: '#FFFFFF', stripe: '#5C5A54' },
  shape: {
    radius: '8px',
    cardBorder: '1px solid #DCD9D0',
    cardTop: '1px solid #DCD9D0',
    cardBg: '#FFFFFF',
    numSize: '2.5rem', numColor: '#1D4ED8',
  },
};
