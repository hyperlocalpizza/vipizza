import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VIPizza",
  description: "Ordina la tua pizza preferita."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
