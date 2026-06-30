/**
 * SmartShelfX — Global Design System
 * Single source of truth for colors, typography, shadows, radii, spacing
 */

export const colors = {
  // Brand
  primary:       '#6366f1',   // Indigo
  primaryDark:   '#4f46e5',
  primaryLight:  '#a5b4fc',
  secondary:     '#0ea5e9',   // Sky blue
  accent:        '#f59e0b',   // Amber

  // Semantic
  success:       '#10b981',
  successLight:  'rgba(16,185,129,0.12)',
  warning:       '#f59e0b',
  warningLight:  'rgba(245,158,11,0.12)',
  error:         '#ef4444',
  errorLight:    'rgba(239,68,68,0.12)',
  info:          '#0ea5e9',
  infoLight:     'rgba(14,165,233,0.12)',

  // Neutrals
  bg:            '#f8fafc',
  bgCard:        'rgba(255,255,255,0.85)',
  bgGlass:       'rgba(255,255,255,0.65)',
  surface:       '#ffffff',
  border:        'rgba(99,102,241,0.12)',
  borderStrong:  'rgba(99,102,241,0.28)',

  // Text hierarchy
  textPrimary:   '#0f172a',
  textSecondary: '#475569',
  textTertiary:  '#94a3b8',
  textInverse:   '#ffffff',

  // Dark panel
  dark1:         '#0f172a',
  dark2:         '#1e293b',
  dark3:         '#334155',
};

export const gradients = {
  brand:    'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
  hero:     'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
  card:     'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(14,165,233,0.04) 100%)',
  success:  'linear-gradient(135deg, #10b981, #059669)',
  warning:  'linear-gradient(135deg, #f59e0b, #d97706)',
  error:    'linear-gradient(135deg, #ef4444, #dc2626)',
  page:     'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e8edf5 100%)',
  sidebar:  'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
};

export const shadows = {
  sm:   '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  md:   '0 4px 16px rgba(0,0,0,0.07), 0 2px 6px rgba(0,0,0,0.04)',
  lg:   '0 8px 32px rgba(0,0,0,0.09), 0 4px 12px rgba(0,0,0,0.05)',
  xl:   '0 16px 48px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.06)',
  glow: '0 0 24px rgba(99,102,241,0.25)',
  card: '0 4px 24px rgba(99,102,241,0.08), 0 1px 4px rgba(0,0,0,0.04)',
};

export const radii = {
  sm:   '8px',
  md:   '12px',
  lg:   '16px',
  xl:   '20px',
  '2xl':'24px',
  full: '9999px',
};

export const fonts = {
  sans: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};

export const transitions = {
  fast:   'all 0.15s ease',
  normal: 'all 0.25s ease',
  slow:   'all 0.4s ease',
};
