import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@components/ui/button';
import { Link } from 'react-router-dom';
import { LoginModal } from '@components/feature/home/login/LoginModal';
import { TaskCreateModal } from '@components/feature/task/TaskCreateModal';
import ThemeToggleButton from '@components/common/ThemeToggleButton';
import { auth } from '@lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import styled from '@emotion/styled';
import { useUserStore } from '@store/userSlice';

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
  const [loginModal, setLoginModal] = useState<boolean>(false);
  const [taskCreateModal, setTaskCreateModal] = useState<boolean>(false);
  const user = useUserStore((state) => state.user);
  console.log(user);

  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {
    // 파이어베이스 인증 상태 감시 (구독)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // 로그인된 유저가 있으면 스토어 저장
      } else {
        clearUser(); // 없으면 스토어 비움
      }
    });

    return () => unsubscribe(); // 언마운트 시 구독 해제
  }, [setUser, clearUser]);
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
          <Button variant="default" size="sm" className="hidden md:flex" onClick={() => setTaskCreateModal(true)}>
            New Tesk
          </Button>
          <ThemeToggleButton />
          {user ? (
            user?.displayName
          ) : (
            <Button variant="default" size="sm" className="hidden md:flex" onClick={() => setLoginModal(true)}>
              Login
            </Button>
          )}
        </div>
      </NavContainer>
      <LoginModal isOpen={loginModal} onClose={() => setLoginModal(false)} />
      <TaskCreateModal isOpen={taskCreateModal} onClose={() => setTaskCreateModal(false)} />
    </Nav>
  );
}
