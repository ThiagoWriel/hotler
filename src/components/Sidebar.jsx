"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="principal-title">
        <i className="material-icons" style={{ fontSize: "2.0rem" }}>
          holiday_village
        </i>
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
            Dashboard
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
          <Link
            href="/financeiro"
            className={pathname.startsWith("/financeiro") ? "active" : ""}
          >
            <i className="material-icons">attach_money</i>
            Financeiro
          </Link>
        </nav>
      </div>
    </aside>
  );
}
