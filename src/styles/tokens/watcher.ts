import type { Tokens } from './types';
export const watcher: Tokens = {
  color: {
    bg: '#060303', surface: '#0a0404', text: '#efe7de', muted: '#b9ada5',
    border: 'rgba(225,6,0,.5)', line: 'rgba(225,6,0,.28)',
    accent: '#e10600', accentText: '#f2a550', onAccent: '#060303', tint: '#4a0000',
    warn: '#f2a550', danger: '#ff4a3d',
  },
  font: {
    display: "'Unbounded', 'Arial Black', sans-serif",
    body: "'Newsreader', Georgia, serif",
    serif: "'Newsreader', Georgia, serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    displayWeight: '900', numWeight: '900',
  },
  status: { d: '#e10600', m: '#e10600', f: '#f2a550', n: '#8d837c', eyeFill: '#1a0000', slash: '#ffffff' },
  deco: { heroGlow: '#5a0000', heroMid: '#1a0000', sectionTint: '#140000', bandOne: '#000000', bandText: '#ff4a42', stripe: '#8a0000' },
  shape: {
    radius: '2px',
    cardBorder: '1px solid rgba(225,6,0,.5)',
    cardTop: '3px solid #e10600',
    cardBg: 'radial-gradient(circle at 100% 0%, rgba(225,6,0,.16), transparent 55%), rgba(30,0,0,.4)',
    numSize: 'clamp(1.8rem, 4vw, 2.4rem)', numColor: '#efe7de',
  },
};
