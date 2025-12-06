import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/toaster";
// Font imports
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sistema de Papelería - Gestión de Documentos",
  description: "Sistema de gestión de clientes y generación automática de documentos",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 bg-background">
              <div className="container mx-auto p-6">
                {children}
              </div>
            </main>
          </div>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
