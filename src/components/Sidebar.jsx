"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "../utils/actions";
import useUserRole from "../hooks/useRole";

export default function Sidebar() {
  const pathname = usePathname();
  const { role } = useUserRole();
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    // Buscar usuário atual
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Não renderizar a sidebar em rotas de autenticação
  if (!user || pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <aside className="sidebar">
      <div className="principal-title">
        <img
          src="/logo.ico"
          alt="Hotler Logo"
          width="32"
          height="32"
          style={{ borderRadius: "3px" }}
        />
        <Link href="/dashboard">
          <h1>Hotler</h1>
        </Link>
      </div>
      <div className="links">
        <nav>
          <Link
            href="/dashboard"
            className={pathname === "/dashboard" ? "active" : ""}
          >
            <i className="material-icons">dashboard</i>
            Início
          </Link>
          <Link
            href="/quartos"
            className={pathname.startsWith("/quartos") ? "active" : ""}
          >
            <i className="material-icons">hotel</i>
            Quartos
          </Link>
          <Link
            href="/clientes"
            className={pathname.startsWith("/clientes") ? "active" : ""}
          >
            <i className="material-icons">people</i>
            Clientes
          </Link>
          <Link
            href="/reservas"
            className={pathname.startsWith("/reservas") ? "active" : ""}
          >
            <i className="material-icons">event_note</i>
            Reservas
          </Link>
          {role === "admin" && (
            <Link
              href="/financeiro"
              className={pathname.startsWith("/financeiro") ? "active" : ""}
            >
              <i className="material-icons">attach_money</i>
              Financeiro
            </Link>
          )}
        </nav>
      </div>

      <div className="sidebar-profile">
        <div className="profile-info">
          <div className="profile-avatar">
            <i className="material-icons">person</i>
          </div>
          <span className="profile-email" title={user?.email}>
            {user?.email}
          </span>
        </div>
        <form action={signOut}>
          <button type="submit" className="logout-button">
            <i className="material-icons">logout</i>
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
