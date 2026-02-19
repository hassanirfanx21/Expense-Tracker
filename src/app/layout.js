import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'ExpenseFlow - Smart Expense Tracker',
  description: 'Track your expenses intelligently with beautiful analytics and insights',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-900 text-foreground antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a2e',
              color: '#e2e8f0',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#1a1a2e',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#1a1a2e',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
