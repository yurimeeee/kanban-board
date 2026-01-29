import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { AboutPage } from '@pages/about/AboutPage';
import { AppLayout } from '@components/layout/AppLayout';
import { HomePage } from '@pages/home/HomePage';
import MyPage from '@pages/my-page/MyPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'mypage',
        element: <MyPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
