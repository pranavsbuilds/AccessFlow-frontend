import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smart Interviewer — AI-Powered Mock Interviews',
  description:
    'Pressure-test your knowledge with an AI interviewer. Real questions, real scoring, real feedback.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
