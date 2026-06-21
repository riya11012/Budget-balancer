import type { Metadata } from "next";
import "./globals.css";
import { NotificationBell } from "../components/notification-bell";
import { AppSidebar } from "../components/app-sidebar";
import { AIAssistantButton } from "../components/ai-assistant-button";


import { ThemeProvider } from "../components/theme-provider";
import { ThemeToggle } from "../components/theme-toggle";

export const metadata: Metadata = {
  title: "Budget Balancer",
  description: "AI-powered personal finance app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body>
        <ThemeProvider>
          <AppSidebar />

          <main className="min-h-screen bg-slate-50 dark:bg-black md:ml-64">
            {children}
          </main>

          <NotificationBell />
          <ThemeToggle />
          <AIAssistantButton />
        </ThemeProvider>
      </body>
    </html>
  );
}