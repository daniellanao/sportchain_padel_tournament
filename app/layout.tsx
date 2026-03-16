import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Sportchain Padel Tournament",
  description: "Padel tournament",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <Navbar tournamentSlug={process.env.NEXT_PUBLIC_TOURNAMENT_SLUG} />
        {children}
      </body>
    </html>
  );
}
