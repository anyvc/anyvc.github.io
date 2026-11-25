// Both modes must define exactly these keys. A missing key is a type error and the contrast script also checks it.
export type Tokens = {
  color: {
    bg: string; surface: string; text: string; muted: string; border: string; line: string;
    accent: string;      // decorative and large text only
    accentText: string;  // small accent text (>= 4.5:1 on bg and surface)
    onAccent: string;    // text on an accent fill. Watcher: large/bold text only (3:1); small text must not sit on red
    tint: string;
    warn: string;
    danger: string;
  };
  font: { display: string; body: string; serif: string; mono: string; displayWeight: string; numWeight: string };
  status: { d: string; m: string; f: string; n: string; eyeFill: string; slash: string }; // coverage eye icons: graphics need >= 3:1 on surface
  deco: { heroGlow: string; heroMid: string; sectionTint: string; bandOne: string; bandText: string; stripe: string }; // decorative backgrounds
  shape: { radius: string; cardBorder: string; cardTop: string; cardBg: string; numSize: string; numColor: string };
};
