"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Flame,
  Layers,
  Clock,
  Star,
  Users,
  Image as ImageIcon,
  Mail,
  LogOut,
  ChevronRight,
  Globe,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Hero", icon: Flame },
  { href: "/admin/quem-somos", label: "Quem Somos", icon: Layers },
  { href: "/admin/historia", label: "História", icon: Clock },
  { href: "/admin/identidade", label: "Identidade", icon: Star },
  { href: "/admin/diretoria", label: "Diretoria", icon: Users },
  { href: "/admin/galeria", label: "Galeria", icon: ImageIcon },
  { href: "/admin/contato", label: "Contato", icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__top">
        <Link href="/admin/dashboard" className="admin-brand">
          <div className="admin-brand__icon">P</div>
          <div className="admin-brand__text">
            <p className="admin-brand__title">
              PANTHE<span>RIUM</span>
            </p>
            <p className="admin-brand__subtitle">PAINEL ADMIN</p>
          </div>
        </Link>
      </div>

      <div className="admin-sidebar__nav-wrap">
        <p className="admin-sidebar__section-label">CONTEÚDO</p>

        <nav className="admin-sidebar__nav">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`admin-nav-link ${active ? "is-active" : ""}`}
              >
                <span className="admin-nav-link__left">
                  <Icon size={17} />
                  <span>{label}</span>
                </span>
                <ChevronRight size={15} className="admin-nav-link__arrow" />
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar__site-block">
          <p className="admin-sidebar__section-label">SITE</p>
          <Link href="/" target="_blank" className="admin-site-link">
            <Globe size={16} />
            <span>Ver site público</span>
          </Link>
        </div>
      </div>

      <div className="admin-sidebar__bottom">
        <div className="admin-user">
          <div className="admin-user__avatar">
            {(user?.email?.[0] || "E").toUpperCase()}
          </div>
          <div className="admin-user__info">
            <p className="admin-user__email">{user?.email || "Administrador"}</p>
            <p className="admin-user__role">Administrador</p>
          </div>
        </div>

        <button onClick={() => signOut()} className="admin-logout-btn">
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}