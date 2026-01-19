import { Github, Menu } from 'lucide-react';

import { Button } from '@components/ui/button';
import { Link } from 'react-router-dom';
import ThemeToggleButton from '@components/common/ThemeToggleButton';
import styled from '@emotion/styled';

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
          <ThemeToggleButton />
          <Button variant="default" size="sm" className="hidden md:flex">
            Login
          </Button>
        </div>
      </NavContainer>
    </Nav>
  );
}
