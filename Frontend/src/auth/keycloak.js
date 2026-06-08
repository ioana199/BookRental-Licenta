import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:9090',
  realm: 'book_rental',
  clientId: 'book_rental',
});

export default keycloak;