"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Heart, Instagram, Mail, Menu, Trophy, Users, X, Zap } from "lucide-react";
import { getAbout, getContact, getDirectors, getGallery, getHero, getIdentity, getTimeline } from "@/services/siteService";
import { defaultAbout, defaultContact, defaultHero, defaultIdentity, defaultTimeline } from "@/lib/defaults";
import type { AboutData, ContactData, Director, GalleryItem, HeroData, IdentityData, TimelineItem } from "@/types";

const assetRoot = "https://raw.githubusercontent.com/emersonbrandao058-dot/pantherium/main/images/galeria";
const heroFallback = `${assetRoot}/turma-bandeira.png`;
const pantherFallback = `${assetRoot}/mascote-pantera.png`;
const snakeFallback = `${assetRoot}/mascote-cobra.png`;

export default function PublicSite() {
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [about, setAbout] = useState<AboutData>(defaultAbout);
  const [timeline, setTimeline] = useState<TimelineItem[]>(defaultTimeline);
  const [identity, setIdentity] = useState<IdentityData>(defaultIdentity);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [contact, setContact] = useState<ContactData>(defaultContact);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    Promise.allSettled([getHero(), getAbout(), getTimeline(), getIdentity(), getDirectors(), getGallery(), getContact()])
      .then(([h, a, t, i, d, g, c]) => {
        if (h.status === "fulfilled" && h.value) setHero(h.value);
        if (a.status === "fulfilled" && a.value) setAbout(a.value);
        if (t.status === "fulfilled" && t.value?.length) setTimeline(t.value);
        if (i.status === "fulfilled" && i.value) setIdentity(i.value);
        if (d.status === "fulfilled" && d.value) setDirectors(d.value);
        if (g.status === "fulfilled" && g.value) setGallery(g.value);
        if (c.status === "fulfilled" && c.value) setContact(c.value);
      });
  }, []);

  const orderedDirectors = useMemo(() => [...directors].sort((a, b) => a.order - b.order), [directors]);
  const instagram = contact.instagram || "@atleticaenfaunef";
  const email = contact.email || "atleticapantherium@gmail.com";
  const closeMenu = () => setMenuOpen(false);

  return <>
    <nav className="arena-nav" aria-label="Navegação principal">
      <a className="arena-brand" href="#inicio" onClick={closeMenu}><b>P</b><span>PANTHE<span>RIUM</span><small>Atlética de Enfermagem · UNEF</small></span></a>
      <div className={`arena-links ${menuOpen ? "open" : ""}`}>
        <a href="#quem-somos" onClick={closeMenu}>Quem somos</a><a href="#historia" onClick={closeMenu}>História</a>
        <a href="#identidade" onClick={closeMenu}>Identidade</a><a href="#diretoria" onClick={closeMenu}>Diretoria</a>
        <a href="#galeria" onClick={closeMenu}>Galeria</a><a className="arena-nav-cta" href="#contato" onClick={closeMenu}>Faça parte</a>
      </div>
      <button className="arena-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>{menuOpen ? <X /> : <Menu />}</button>
    </nav>

    <main>
      <section id="inicio" className="arena-hero">
        <div className="arena-hero-photo"><SafeImage src="" fallback={heroFallback} alt="Torcida da Pantherium" fill priority /></div><div className="arena-hero-shade" />
        <div className="arena-hero-copy"><p className="arena-kicker">{hero.badge || "Atlética de Enfermagem da UNEF"}</p><h1>PANTHE<span>RIUM</span></h1><h2>Mais que uma atlética.<br/><strong>Uma identidade.</strong></h2><p>{hero.secondaryText || "Força, união e propósito dentro e fora da Enfermagem."}</p><div className="arena-actions"><a className="arena-btn primary" href="#quem-somos">Conheça a Pantherium</a><a className="arena-btn" href={`https://instagram.com/${instagram.replace("@", "")}`} target="_blank" rel="noreferrer"><Instagram size={18}/> Nosso Instagram</a></div></div>
        <div className="arena-panther-mark"><Image src={pantherFallback} alt="Pantera, símbolo da Pantherium" fill sizes="(max-width: 800px) 55vw, 32vw" /></div><div className="arena-stamp"><b>P</b><span>Desde 2023</span></div>
      </section>

      <section id="quem-somos" className="arena-mission arena-shell">
        <div className="arena-section-intro"><span>Nossa missão</span><h2>O ESPORTE QUE <em>NOS MOVE.</em></h2><p>{about.text1}</p><p>{about.text2}</p></div>
        <div className="arena-pillars"><Pillar icon={<Users/>} title="União" text="Criamos laços que vão além das quadras e pistas." /><Pillar icon={<Zap/>} title="Disciplina" text="Treinamos corpo e mente para superar desafios." /><Pillar icon={<Heart/>} title="Pertencimento" text="Aqui você encontra seu lugar, sua turma, sua família." /><Pillar icon={<Trophy/>} title="Excelência" text="Representamos a Enfermagem com garra e respeito." /></div>
      </section>

      <section id="historia" className="arena-history"><div className="arena-shell"><div className="arena-heading"><span>Nossa história</span><h2>NASCIDA PARA <em>REPRESENTAR.</em></h2></div><div className="arena-timeline">{timeline.map((item, index) => <article key={item.id}><b>{String(index + 1).padStart(2, "0")}</b><time>{item.year}</time><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></div></section>

      <section id="identidade" className="arena-identity"><IdentityPanel image={identity.pantherImageUrl} fallback={pantherFallback} eyebrow="Força" title={identity.pantherTitle || "A Pantera"} text={identity.pantherText} /><div className="arena-identity-center"><span>Dois símbolos</span><h2>UM <em>PROPÓSITO.</em></h2><p>{identity.unionText}</p><b>P</b></div><IdentityPanel image={identity.snakeImageUrl} fallback={snakeFallback} eyebrow="Sabedoria" title={identity.snakeTitle || "A Cobra"} text={identity.snakeText} /></section>

      <section id="diretoria" className="arena-directors arena-shell"><div className="arena-heading"><span>Gestão atual</span><h2>LIDERANÇAS QUE <em>INSPIRAM.</em></h2></div>{orderedDirectors.length ? <div className="arena-cast">{orderedDirectors.map(d => <article key={d.id}><div className="arena-person">{d.photoUrl ? <SafeImage src={d.photoUrl} fallback={pantherFallback} alt={d.name} fill /> : <span>{initials(d.name)}</span>}</div><small>{d.role}</small><h3>{d.name}</h3></article>)}</div> : <div className="arena-empty"><Users/><h3>A diretoria faz a Pantherium acontecer.</h3><p>As fotos e perfis voltam automaticamente assim que o banco estiver disponível.</p></div>}</section>

      <section id="galeria" className="arena-gallery arena-shell"><div className="arena-heading"><span>Nossos momentos</span><h2>MOMENTOS QUE <em>FICAM.</em></h2></div><div className="arena-gallery-grid">{gallery.length ? gallery.slice(0, 5).map((item, index) => <button key={item.id} className={`gallery-${index + 1}`} onClick={() => setLightbox(item)}><SafeImage src={item.imageUrl} fallback={heroFallback} alt={item.caption || "Momento Pantherium"} fill /></button>) : [1,2,3,4].map((n) => <div key={n} className={`gallery-${n}`}><Image src={n % 2 ? heroFallback : pantherFallback} alt="Identidade visual Pantherium" fill sizes="50vw" /></div>)}</div></section>

      <section id="contato" className="arena-contact"><div><span>Faça parte dessa história.</span><h2>PANTHERIUM É <em>FORÇA, UNIÃO E PROPÓSITO.</em></h2></div><div className="arena-actions"><a className="arena-btn primary" href={`https://instagram.com/${instagram.replace("@", "")}`} target="_blank" rel="noreferrer"><Instagram size={18}/> {contact.cta || "Seguir no Instagram"}</a><a className="arena-btn" href={`mailto:${email}`}><Mail size={18}/> Fale conosco</a></div></section>
    </main>

    <footer className="arena-footer"><a className="arena-brand" href="#inicio"><b>P</b><span>PANTHE<span>RIUM</span></span></a><p>Atlética de Enfermagem · UNEF · Desde 2023</p><a href="/admin">Admin</a></footer>
    {lightbox && <div className="arena-lightbox" onClick={() => setLightbox(null)}><button aria-label="Fechar"><X/></button><SafeImage src={lightbox.imageUrl} fallback={heroFallback} alt={lightbox.caption || "Imagem ampliada"} fill /></div>}
  </>;
}

function Pillar({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <article>{icon}<h3>{title}</h3><p>{text}</p></article>; }
function IdentityPanel({ image, fallback, eyebrow, title, text }: { image: string; fallback: string; eyebrow: string; title: string; text: string }) { return <article className="arena-symbol"><SafeImage src={image} fallback={fallback} alt={title} fill /><div><span>{eyebrow}</span><h3>{title}</h3><p>{text}</p></div></article>; }
function SafeImage({ src, fallback, alt, ...props }: { src?: string; fallback: string; alt: string; fill?: boolean; priority?: boolean }) { const [current, setCurrent] = useState(src || fallback); useEffect(() => setCurrent(src || fallback), [src, fallback]); return <Image src={current} alt={alt} unoptimized onError={() => setCurrent(fallback)} {...props} />; }
function initials(name: string) { return name.split(" ").filter(Boolean).slice(0, 2).map(p => p[0]).join("").toUpperCase(); }
