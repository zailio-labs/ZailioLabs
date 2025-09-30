// src/app/layout.jsx
import './globals.css';

export const metadata = {
  title: 'Zailio Labs - Modern Tech Solutions',
  description: 'Zailio Labs provides cutting-edge web development, mobile apps, and IT consultation services.',
  keywords: 'tech, development, consulting, web, mobile, software',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
