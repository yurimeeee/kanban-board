// src/App.tsx
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// import { AboutPage } from '@/pages/AboutPage';
import { AppLayout } from '@components/layout/AppLayout';
import { HomePage } from '@pages/home/HomePage';

// import { HomePage } from '@/pages/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />, // 부모 레이아웃
    children: [
      {
        path: '', // "/" 경로일 때
        element: <HomePage />,
      },
      // {
      //   path: 'about', // "/about" 경로일 때
      //   element: <AboutPage />,
      // },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
