import React from 'react';
import { RouteType } from '../types';

interface RouterProps {
  currentRoute: RouteType;
  children: React.ReactNode;
}

export function Router({ currentRoute, children }: RouterProps) {
  // Simple client-side routing
  React.useEffect(() => {
    const path = window.location.pathname;
    let newRoute: RouteType = 'login';
    
    if (path.startsWith('/admin')) {
      newRoute = 'admin';
    } else if (path.startsWith('/user')) {
      newRoute = 'user';
    }
    
    if (newRoute !== currentRoute) {
      // Update URL without page reload
      window.history.pushState({}, '', `/${newRoute === 'login' ? '' : newRoute}`);
    }
  }, [currentRoute]);

  return <>{children}</>;
}

export function useRouter() {
  const navigate = (route: RouteType) => {
    const path = route === 'login' ? '/' : `/${route}`;
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  };

  return { navigate };
}