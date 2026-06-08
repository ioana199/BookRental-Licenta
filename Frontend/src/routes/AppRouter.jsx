import { useKeycloak } from '@react-keycloak/web';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import UserLayout from '../components/layout/UserLayout';

// Librarian pages
import UserListPage from '../pages/librarian/UserListPage';
import PublishersPage from '../pages/librarian/PublishersPage';
import AuthorsPage from '../pages/librarian/AuthorsPage';
import BooksPage from '../pages/librarian/BooksPage';
import ExemplariesPage from '../pages/librarian/ExemplariesPage';
import ReservationsPage from '../pages/librarian/ReservationsPage';

// User pages
import ProfilePage from '../pages/user/ProfilePage';
import LibrariesPage from '../pages/user/LibrariesPage';
import UserBooksPage from '../pages/user/BooksPage';
import FavoritesPage from '../pages/user/FavoritesPage';
import ReviewsPage from '../pages/user/ReviewsPage';
import MyReservationsPage from '../pages/user/MyReservationsPage';

// Admin pages
import UsersManagementPage from '../pages/admin/UsersManagementPage';
import LibrariesManagementPage from '../pages/admin/LibrariesManagementPage';
import LibrariansManagementPage from '../pages/admin/LibrariansManagementPage';
import ExemplariesManagementPage from '../pages/admin/ExemplariesManagementPage';

import RegisterPage from '../pages/RegisterPage';
import { useLocation } from 'react-router-dom';
import HomePage from '../pages/HomePage';


function AppRouter() {
  const { keycloak } = useKeycloak();

  return (
    <BrowserRouter>
      <AppRouterInner keycloak={keycloak} />
    </BrowserRouter>
  );
}

function AppRouterInner({ keycloak }) {
  const location = useLocation();

  if (location.pathname === '/home') {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
}

  if (location.pathname === '/register') {
    return (
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    );
  }

  if (!keycloak.authenticated) {
    keycloak.login();
    return null;
  }

  const roles = keycloak.tokenParsed?.realm_access?.roles || [];
  const clientRoles = keycloak.tokenParsed?.resource_access?.book_rental?.roles || [];

  const isUser = roles.includes('user') || clientRoles.includes('user');
  const isLibrarian = roles.includes('librarian') || clientRoles.includes('librarian');
  const isAdmin = roles.includes('role_admin') || clientRoles.includes('role_admin');

  if (isUser) {
    return (
      <UserLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/user/books" />} />
          <Route path="/user/profile" element={<ProfilePage />} />
          <Route path="/user/libraries" element={<LibrariesPage />} />
          <Route path="/user/books" element={<UserBooksPage />} />
          <Route path="/user/favorites" element={<FavoritesPage />} />
          <Route path="/user/reviews" element={<ReviewsPage />} />
          <Route path="/user/reservations" element={<MyReservationsPage />} />
          <Route path="*" element={<Navigate to="/user/books" />} />
        </Routes>
      </UserLayout>
    );
  }

  if (isLibrarian) {
    return (
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/librarian/users" />} />
          <Route path="/librarian/users" element={<UserListPage />} />
          <Route path="/librarian/publishers" element={<PublishersPage />} />
          <Route path="/librarian/authors" element={<AuthorsPage />} />
          <Route path="/librarian/books" element={<BooksPage />} />
          <Route path="/librarian/exemplaries" element={<ExemplariesPage />} />
          <Route path="/librarian/reservations" element={<ReservationsPage />} />
          <Route path="*" element={<Navigate to="/librarian/users" />} />
        </Routes>
      </AppLayout>
    );
  }

  if (isAdmin) {
    return (
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/users" />} />
          <Route path="/librarian/users" element={<UserListPage />} />
          <Route path="/librarian/publishers" element={<PublishersPage />} />
          <Route path="/librarian/authors" element={<AuthorsPage />} />
          <Route path="/librarian/books" element={<BooksPage />} />
          <Route path="/librarian/exemplaries" element={<ExemplariesPage />} />
          <Route path="/librarian/reservations" element={<ReservationsPage />} />
          <Route path="/admin/users" element={<UsersManagementPage />} />
          <Route path="/admin/libraries" element={<LibrariesManagementPage />} />
          <Route path="/admin/librarians" element={<LibrariansManagementPage />} />
          <Route path="/admin/exemplaries" element={<ExemplariesManagementPage />} />
          <Route path="/admin/reservations" element={<ReservationsPage />} />
          <Route path="*" element={<Navigate to="/admin/users" />} />
        </Routes>
      </AppLayout>
    );
  }

  return <div>Rol necunoscut</div>;
}

export default AppRouter;