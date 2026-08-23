import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { PrivacyPolicyView } from './components/PrivacyPolicyView.tsx';
import './index.css';

function RootComponent() {
  const pathname = window.location.pathname.toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const isPrivacyRoute =
    pathname.includes('privacy') ||
    searchParams.get('page') === 'privacy' ||
    searchParams.get('view') === 'privacy' ||
    window.location.hash.includes('privacy');

  if (isPrivacyRoute) {
    return <PrivacyPolicyView />;
  }

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>,
);

