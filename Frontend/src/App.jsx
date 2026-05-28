import { useKeycloak } from '@react-keycloak/web';
import AppRouter from './routes/AppRouter';

function App() {
  const { initialized } = useKeycloak();

  if (!initialized) {
    return <div>Se încarcă...</div>;
  }

  return <AppRouter />;
}

export default App;