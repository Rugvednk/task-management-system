import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { UserProvider } from "./components/UserProvider";

export const metadata: Metadata = {
  title: "Pyramid - Task Management System",
  description: "Assessment Task Management System built with Next.js & NestJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
