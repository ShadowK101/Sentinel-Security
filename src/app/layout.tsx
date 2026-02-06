
import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata: Metadata = {
  title: 'Sentinel | Professional Password Manager',
  description: 'Military-grade password generation and secure encrypted vault.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="google-site-verification" content="aJppyP_kgrYobOFgec4u4SG7JZL7rwi_CtwABKUwMhs" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <TooltipProvider delayDuration={300}>
            {children}
          </TooltipProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
