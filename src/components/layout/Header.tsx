import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { ChevronDown, LogOut, Menu, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@components/ui/dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '@lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { Button } from '@components/ui/button';
import { LoginModal } from '@components/feature/home/login/LoginModal';
import { TaskCreateModal } from '@components/feature/task/TaskCreateModal';
import ThemeToggleButton from '@components/common/ThemeToggleButton';
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
  const navigate = useNavigate();

  // 스토어에서 유저 및 프로필 정보 가져오기
  const user = useUserStore((state) => state.user);
  const profile = useUserStore((state) => state.profile);
  const setUser = useUserStore((state) => state.setUser);
  const setProfile = useUserStore((state) => state.setProfile);
  const clearUser = useUserStore((state) => state.clearUser);

  // Google 사용자 여부 확인
  const isGoogleUser = user?.providerData?.some((provider) => provider.providerId === 'google.com');

  // 프로필 사진 및 이름 (스토어 또는 Firebase Auth에서)
  const profilePhoto = isGoogleUser ? user?.photoURL : profile?.photoURL || user?.photoURL;
  const displayName = isGoogleUser ? user?.displayName : profile?.displayName || user?.displayName;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        clearUser();
      }
    });

    return () => unsubscribe();
  }, [setUser, clearUser]);

  // 로그인 시 Firestore에서 프로필 정보 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;

      // Google 사용자는 Firebase Auth 정보 사용 (Firestore 조회 불필요)
      if (isGoogleUser) {
        setProfile({
          displayName: user.displayName || null,
          phoneNumber: null,
          photoURL: user.photoURL || null,
          email: user.email || null,
        });
        return;
      }

      // 스토어에 이미 프로필이 있으면 스킵
      if (profile?.photoURL || profile?.displayName) return;

      // 이메일 사용자는 Firestore에서 정보 가져오기
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            displayName: data.displayName || null,
            phoneNumber: data.phoneNumber || null,
            photoURL: data.photoURL || null,
            email: user.email || null,
          });
        }
      } catch (error) {
        console.error('프로필 정보 로드 실패:', error);
      }
    };

    fetchProfile();
  }, [user, isGoogleUser, profile?.photoURL, profile?.displayName, setProfile]);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearUser();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

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
          {user && (
            <Button variant="default" size="sm" className="hidden md:flex" onClick={() => setTaskCreateModal(true)}>
              New Task
            </Button>
          )}
          <ThemeToggleButton />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={profilePhoto || ''} alt={displayName || user.email || ''} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline max-w-[120px] truncate">{displayName || user.email}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm text-muted-foreground truncate">{user.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/mypage')}>
                  <User className="w-4 h-4 mr-2" />
                  마이페이지
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
