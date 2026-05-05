import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const storageKey = 'ai-supply-chain-theme';

type ThemeMode = 'light' | 'dark';

function applyTheme(mode: ThemeMode): void {
  document.documentElement.classList.toggle('dark', mode === 'dark');
}

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  return window.localStorage.getItem(storageKey) === 'dark' ? 'dark' : 'light';
}

export function ThemeToggle(): JSX.Element {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(storageKey, theme);
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="grid h-10 w-10 place-items-center rounded-md border border-border bg-surface text-muted-foreground transition hover:border-accent/45 hover:text-accent"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
