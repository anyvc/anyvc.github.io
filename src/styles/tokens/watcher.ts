import type { Tokens } from './types';
export const watcher: Tokens = {
  color: {
    bg: '#060303', surface: '#0d0505', text: '#efe7de', muted: '#b9ada5',
    border: 'rgba(225,6,0,.5)', line: 'rgba(225,6,0,.28)',
    accent: '#e10600', accentText: '#f2a550', onAccent: '#060303', tint: '#4a0000',
  },
  font: {
    display: "'Unbounded', 'Arial Black', sans-serif",
    body: "'Newsreader', Georgia, serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    displayWeight: '900', numWeight: '900',
  },
  status: { d: '#e10600', m: '#e10600', f: '#f2a550', n: '#8d837c', eyeFill: '#1a0000', slash: '#ffffff' },
  shape: {
    radius: '2px',
    cardBorder: '1px solid rgba(225,6,0,.5)',
    cardTop: '3px solid #e10600',
    cardBg: 'radial-gradient(circle at 100% 0%, rgba(225,6,0,.2), transparent 55%), #0d0505',
    numSize: 'clamp(2.5rem, 8vw, 4rem)', numColor: '#e10600',
  },
};
