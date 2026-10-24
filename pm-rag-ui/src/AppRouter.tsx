import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DevPage from './pages/DevPage';
import Navbar from './components/Navbar';
import { Box } from '@mui/material';
import AuthGuard from './components/AuthGuard';
import Forbidden from './pages/errors/403';
import NotFound from './pages/errors/404';
import AdminHomePage from './pages/admin/AdminHomePage';
import EngineersPage from './pages/admin/EngineersPage';
import SkillsPage from './pages/admin/SkillsPage';
import AddSkillPage from './pages/admin/AddSkillPage';
import AddEngineerPage from './pages/admin/AddEngineerPage';
import type { NavLink } from './components/Navbar';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';

const AppRouter: React.FC = () => {
  const { keycloak } = useKeycloak();

  const isAdmin = Boolean(keycloak?.hasRealmRole('admin'));
  let links: NavLink[];

  if (isAdmin) {
    links = [
      { label: 'Dashboard', href: '/admin', icon: DashboardRoundedIcon },
      { label: 'Engineers', href: '/admin/engineers', icon: GroupsRoundedIcon },
      { label: 'Skills', href: '/admin/skills', icon: BuildRoundedIcon },
    ];
  } else {
    links = [
      { label: 'Home', href: '/', icon: HomeIcon },
      { label: 'About', href: '/about', icon: InfoIcon },
      { label: 'Contact', href: '/contact', icon: ContactMailIcon },
      { label: 'Dev', href: '/dev', icon: DeveloperModeIcon },
    ];
  }

  return (
    <Router>
      <Navbar links={links} logoHref={isAdmin ? '/admin' : '/'} />
      <main>
        <Box sx={{ pt: '84px' }}>
          <Routes>
            <Route path="/" element={isAdmin ? <Navigate to="/admin" replace /> : <HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/dev" element={<DevPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AuthGuard roles={['admin']}>
                  <AdminHomePage />
                </AuthGuard>
              }
            />
            <Route
              path="/admin/engineers"
              element={
                <AuthGuard roles={['admin']}>
                  <EngineersPage />
                </AuthGuard>
              }
            />
            <Route
              path="/admin/engineers/add"
              element={
                <AuthGuard roles={['admin']}>
                  <AddEngineerPage />
                </AuthGuard>
              }
            />
            <Route
              path="/admin/skills"
              element={
                <AuthGuard roles={['admin']}>
                  <SkillsPage />
                </AuthGuard>
              }
            />

            <Route
              path="/admin/skills/add"
              element={
                <AuthGuard roles={['admin']}>
                  <AddSkillPage />
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