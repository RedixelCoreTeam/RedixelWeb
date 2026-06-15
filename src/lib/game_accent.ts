import type { CSSProperties } from 'react';

type GameAccentCssVars = CSSProperties &
  Record<
    '--game-accent' | '--game-accent-bright' | '--game-accent-soft' | '--game-accent-muted' | '--game-shadow',
    string
  >;

function hashString(value: string): number {
  let hash = 0;

  for (const char of value) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }

  return Math.abs(hash);
}

export interface GameAccent {
  cssVars: GameAccentCssVars;
  glowBackground: string;
  blurBackground: string;
}

export function getGameAccent(id: string): GameAccent {
  const hash = hashString(id);
  const hue = hash % 360;
  const hue2 = (hue + 28 + (hash % 32)) % 360;

  const accent = `hsl(${hue} 36% 40%)`;
  const accentBright = `hsl(${hue} 40% 54%)`;
  const accentSoft = `hsl(${hue} 26% 18%)`;
  const accentMuted = `hsl(${hue} 22% 12%)`;
  const shadow = `hsla(${hue}, 38%, 32%, 0.22)`;

  return {
    cssVars: {
      '--game-accent': accent,
      '--game-accent-bright': accentBright,
      '--game-accent-soft': accentSoft,
      '--game-accent-muted': accentMuted,
      '--game-shadow': shadow,
    },
    glowBackground: `linear-gradient(to bottom right, hsl(${hue} 26% 16% / 0.85), hsl(${hue} 20% 10% / 0.4), transparent)`,
    blurBackground: `linear-gradient(to right, hsl(${hue} 28% 26%), hsl(${hue2} 24% 20%))`,
  };
}
