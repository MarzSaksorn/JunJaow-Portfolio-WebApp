import type { Metadata } from "next";
import { Providers } from "./providers";
import "./styles.css";

export const metadata: Metadata = {
  title: "Jj Portfolio Manager",
  description: "Private portfolio and certificate management for Jj.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Mali:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">ไปยังเนื้อหา</a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
