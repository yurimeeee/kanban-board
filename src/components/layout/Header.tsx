import { Github, Menu, Moon, Sun } from 'lucide-react';

import { Button } from '@components/ui/button';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useThemeMode } from '@styles/ThemeContext';

const Nav = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  border-bottom: 1px solid hsl(var(--border));
  background-color: hsla(var(--background), 0.95);
  backdrop-filter: blur(8px);
`;

const NavContainer = styled.div`
  display: flex;
  height: 3.5rem; /* h-14 */
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;
const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;

  /* Emotion 테마 변수 활용 (Tailwind 변수와 연동됨) */
  background-color: var(--color-primary);
  color: var(--color-primary-foreground);
  border: none;

  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }
`;

export function ThemeToggleButton() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {mode === 'light' ? <Moon size={20} /> : <Sun size={20} color="#ffcf40" />}
    </Button>
  );
}

export function Header() {
  return (
    <Nav>
      <NavContainer>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <a href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <span>KANBAN TASK</span>
          </a>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/about" className="hover:text-primary transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Github className="h-5 w-5" />
          </Button>

          <ThemeToggleButton />
          <Button variant="ghost" size="icon">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="default" size="sm" className="hidden md:flex">
            Login
          </Button>
        </div>
      </NavContainer>
    </Nav>
  );
}
