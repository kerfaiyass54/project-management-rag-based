import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DevPage from './pages/DevPage';
import Navbar from './components/Navbar';
import { Box } from '@mui/material';
import AuthGuard from './components/AuthGuard';
import Forbidden from './pages/errors/403';
import NotFound from './pages/errors/404';

// Placeholder components for role-specific pages
const AdminPage = () => <div>Admin Page</div>;
const EngineerPage = () => <div>Engineer Page</div>;
const ManagerPage = () => <div>Manager Page</div>;
const TeamPage = () => <div>Team Page</div>;

const AppRouter: React.FC = () => {
  const links = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Dev', href: '/dev' },
  ];

  return (
    <Router>
      <Navbar links={links} />
      <main>
        <Box sx={{ pt: '84px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/dev" element={<DevPage />} />

            {/* Protected Routes */}
            <Route
              path="/admin"
              element={
                <AuthGuard roles={['admin']}>
                  <AdminPage />
                </AuthGuard>
              }
            />
            <Route
              path="/engineer"
              element={
                <AuthGuard roles={['engineer']}>
                  <EngineerPage />
                </AuthGuard>
              }
            />
            <Route
              path="/manager"
              element={
                <AuthGuard roles={['manager']}>
                  <ManagerPage />
                </AuthGuard>
              }
            />
            <Route
              path="/team"
              element={
                <AuthGuard roles={['team']}>
                  <TeamPage />
                </AuthGuard>
              }
            />

            {/* Error Pages */}
            <Route path="/403" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </main>
    </Router>
  );
};

export default AppRouter;