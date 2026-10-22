import { createRoot } from 'react-dom/client'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import './index.css'

import App from './App.tsx'
import keycloak from './keycloak'
import Loading from './components/Loading'

createRoot(document.getElementById('root')!).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{ onLoad: 'login-required' }}
    LoadingComponent={<Loading />}
  >
    <App />
  </ReactKeycloakProvider>,
)