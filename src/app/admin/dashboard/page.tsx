"use client";

import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Flame, Layers, Clock, Star, Users, Image as ImageIcon, Mail, ExternalLink
} from "lucide-react";

const sections = [
  { href: "/admin/hero", label: "Hero", desc: "Badge, título, logo principal", icon: Flame },
  { href: "/admin/quem-somos", label: "Quem Somos", desc: "Textos da seção de apresentação", icon: Layers },
  { href: "/admin/historia", label: "História", desc: "Timeline da trajetória", icon: Clock },
  { href: "/admin/identidade", label: "Identidade", desc: "Pantera, cobra e mascotes", icon: Star },
  { href: "/admin/diretoria", label: "Diretoria", desc: "Membros e fotos da gestão", icon: Users },
  { href: "/admin/galeria", label: "Galeria", desc: "Fotos e eventos", icon: ImageIcon },
  { href: "/admin/contato", label: "Contato", desc: "Instagram, e-mail e CTA", icon: Mail },
];

export default function DashboardPage() {
  return (
    <div>
      <AdminHeader
        title="Dashboard"
        description="Gerencie o conteúdo do site Pantherium"
        action={
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-all"
          >
            <ExternalLink size={14} />
            Ver site
          </Link>
        }
      />

      {/* Status card */}
      <div
        className="rounded-xl p-5 mb-8 flex items-center gap-4"
        style={{
          background: "rgba(0,255,136,0.04)",
          border: "1px solid rgba(0,255,136,0.15)",
        }}
      >
        <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
        <div>
          <p className="text-[#00ff88] text-sm font-semibold">Sistema online</p>
          <p className="text-white/40 text-xs">
            Firebase conectado · Todas as seções editáveis
          </p>
        </div>
      </div>

      {/* Grid de seções */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(({ href, label, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "#111",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="p-2.5 rounded-lg transition-all duration-200 group-hover:bg-[rgba(0,255,136,0.1)]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                <Icon size={18} className="group-hover:text-[#00ff88] transition-colors" />
              </div>
              <span className="text-white/10 group-hover:text-[#00ff88]/40 transition-colors text-lg">
                →
              </span>
            </div>
            <h3 className="font-semibold text-white mb-1 group-hover:text-[#00ff88] transition-colors">
              {label}
            </h3>
            <p className="text-white/35 text-sm">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
