import { Moon, Sun } from 'lucide-react';

import { Button } from '@components/ui/button';
import { useThemeStore } from '@store/themeSlice';

const ThemeToggleButton = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === 'light' ? <Moon size={20} className="transition-all" /> : <Sun size={20} color="#ffcf40" className="transition-all" />}
    </Button>
  );
};

export default ThemeToggleButton;
