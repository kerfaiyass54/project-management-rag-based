import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8181', // No /auth
  realm: 'pm-rag', // Your realm name
  clientId: 'pm-rag-front', // Your client ID
});

export default keycloak;