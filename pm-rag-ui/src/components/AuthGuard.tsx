import { useKeycloak } from '@react-keycloak/web';
import { Navigate, useLocation } from 'react-router-dom';

const AuthGuard = ({ children, roles }) => {
  const { keycloak, initialized } = useKeycloak();
  const location = useLocation();

  if (!initialized) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!keycloak.authenticated) {
    // Redirect to Keycloak login page
    keycloak.login();
    return <div>Redirecting to login...</div>;
  }

  const hasRequiredRole = roles.some((role) => keycloak.hasRealmRole(role));

  if (!hasRequiredRole) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default AuthGuard;