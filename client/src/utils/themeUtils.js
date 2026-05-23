export const THEME_KEY = 'site-theme';

export function applyTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  document.documentElement.classList.toggle('light-mode', saved === 'light');
  return saved;
}

export function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light-mode');
  localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
  return isLight ? 'light' : 'dark';
}