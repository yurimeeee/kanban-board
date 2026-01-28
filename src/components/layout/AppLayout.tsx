import { Header } from '@components/layout/Header';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@components/ui/sonner';
import styled from '@emotion/styled';

const Main = styled.main`
  flex: 1;
  padding: 24px 32px;
`;

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Main>
          <Outlet />
        </Main>
        <Toaster />
      </div>
    </div>
  );
}
