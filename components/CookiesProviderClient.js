'use client'

import { CookiesProvider } from 'react-cookie';

export default function CookiesProviderClient({ children }) {
  return <CookiesProvider>{children}</CookiesProvider>;
}
