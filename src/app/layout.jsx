import { createClient } from "../lib/supabase/server";
import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "Hotler",
  description: "Hotel Management System",
};

export default async function RootLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="main-layout">
          {user && <Sidebar />}
          <main className="main-content">
            <div className="page">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
