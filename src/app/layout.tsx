import './globals.css';
import { ReactNode } from 'react';
import { AuthProvider } from '../components/AuthProvider';

export const metadata = {
  title: 'Trustify',
  description: 'Task & team manager'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
