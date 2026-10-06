import "./globals.css";
import AppShell from "@/components/AppShell";
import { DataProvider } from "@/components/DataProvider";

export const metadata = {
  title: "PILI INFO",
  description: "Kontrola poslovanja PILI marketa"
};

export default function RootLayout({children}) {
  return (
    <html lang="sr">
      <body>
        <DataProvider>
          <AppShell>{children}</AppShell>
        </DataProvider>
      </body>
    </html>
  );
}
