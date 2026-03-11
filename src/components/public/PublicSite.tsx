"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  getHero,
  getAbout,
  getTimeline,
  getIdentity,
  getDirectors,
  getGallery,
  getContact,
} from "@/services/siteService";
import {
  defaultHero,
  defaultAbout,
  defaultTimeline,
  defaultIdentity,
  defaultContact,
} from "@/lib/defaults";
import type {
  HeroData,
  AboutData,
  TimelineItem,
  IdentityData,
  Director,
  GalleryItem,
  ContactData,
} from "@/types";

export default function PublicSite() {
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [about, setAbout] = useState<AboutData>(defaultAbout);
  const [timeline, setTimeline] = useState<TimelineItem[]>(defaultTimeline);
  const [identity, setIdentity] = useState<IdentityData>(defaultIdentity);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [contact, setContact] = useState<ContactData>(defaultContact);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    Promise.allSettled([
      getHero(),
      getAbout(),
      getTimeline(),
      getIdentity(),
      getDirectors(),
      getGallery(),
      getContact(),
    ]).then(([h, a, t, id, dir, gal, c]) => {
      if (h.status === "fulfilled" && h.value) setHero(h.value);
      if (a.status === "fulfilled" && a.value) setAbout(a.value);
      if (t.status === "fulfilled" && t.value) setTimeline(t.value);
      if (id.status === "fulfilled" && id.value) setIdentity(id.value);
      if (dir.status === "fulfilled" && dir.value) setDirectors(dir.value);
      if (gal.status === "fulfilled" && gal.value) setGallery(gal.value);
      if (c.status === "fulfilled" && c.value) setContact(c.value);
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const featuredDirectors = useMemo(
    () => directors.filter((d) => d.featured),
    [directors]
  );

  const regularDirectors = useMemo(
    () => directors.filter((d) => !d.featured),
    [directors]
  );

  const heroTitle = hero?.title || "PANTHERIUM";
  const heroTitleSplit =
    heroTitle.toUpperCase().includes("RIUM") && heroTitle.toUpperCase().indexOf("RIUM") > 0
      ? {
          first: heroTitle.slice(0, heroTitle.toUpperCase().indexOf("RIUM")),
          second: heroTitle.slice(heroTitle.toUpperCase().indexOf("RIUM")),
        }
      : {
          first: heroTitle.slice(0, Math.max(4, Math.ceil(heroTitle.length / 2))),
          second: heroTitle.slice(Math.max(4, Math.ceil(heroTitle.length / 2))),
        };

  const heroSubtitle =
    getValue(hero, ["subtitle", "subTitle"], "Atlética de Enfermagem") || "Atlética de Enfermagem";

  const heroTagline =
    getValue(hero, ["tagline"], "Mais que uma atlética. Uma identidade.") ||
    "Mais que uma atlética. Uma identidade.";

  const heroSub =
    getValue(hero, ["secondaryText", "sub", "subtext"], "Força, união e propósito dentro e fora da Enfermagem.") ||
    "Força, união e propósito dentro e fora da Enfermagem.";

  const heroBadge =
    getValue(hero, ["badge"], "Atlética Universitária · Enfermagem · UNEF") ||
    "Atlética Universitária · Enfermagem · UNEF";

  const heroLogoUrl =
    getValue(hero, ["logoUrl", "imageUrl"], "") || "";

  const aboutTitle =
    getValue(about, ["title"], "O QUE É UMA ATLÉTICA") || "O QUE É UMA ATLÉTICA";

  const aboutText1 =
    getValue(
      about,
      ["text1"],
      "Uma Atlética é uma organização formada por estudantes universitários com foco principal na integração esportiva, social e cultural dos alunos do curso. É um espaço de construção coletiva, identidade e representatividade."
    ) || "";

  const aboutText2 =
    getValue(
      about,
      ["text2"],
      "A Pantherium nasceu do desejo de criar pertencimento dentro da Enfermagem — um curso que exige muito de seus alunos e que merecia uma força de união à sua altura. Somos atlética, mas somos também comunidade, família e movimento."
    ) || "";

  const panteraTitle =
    getValue(identity, ["pantherTitle", "panteraTitle"], "A PANTERA") || "A PANTERA";

  const panteraRole =
    getValue(identity, ["pantherRole", "panteraRole"], "Símbolo da Atlética") || "Símbolo da Atlética";

  const panteraDesc =
    getValue(
      identity,
      ["pantherText", "panteraDesc", "panteraText"],
      "A pantera negra é o coração da Pantherium. Ela representa a essência do espírito esportivo da atlética — a agilidade, a força inabalável e a coragem de quem nunca recua."
    ) || "";

  const panteraImage =
    getValue(identity, ["pantherImageUrl", "panteraImageUrl"], "") || "";

  const cobraTitle =
    getValue(identity, ["snakeTitle", "cobraTitle"], "A COBRA") || "A COBRA";

  const cobraRole =
    getValue(identity, ["snakeRole", "cobraRole"], "Símbolo da Enfermagem") || "Símbolo da Enfermagem";

  const cobraDesc =
    getValue(
      identity,
      ["snakeText", "cobraDesc", "cobraText"],
      "A cobra verde é a alma da Enfermagem dentro da Pantherium."
    ) || "";

  const cobraImage =
    getValue(identity, ["snakeImageUrl", "cobraImageUrl"], "") || "";

  const centerArt =
    getValue(identity, ["centerArtUrl", "arteImageUrl"], "") || "";

  const unionText =
    getValue(
      identity,
      ["unionText", "unityText"],
      "A pantera traz a garra. A cobra traz o conhecimento. Juntas, representam o equilíbrio perfeito entre força e propósito."
    ) || "";

  const instagram =
    getValue(contact, ["instagram"], "@atleticaenfaunef") || "@atleticaenfaunef";

  const email =
    getValue(contact, ["email"], "atleticapantherium@gmail.com") || "atleticapantherium@gmail.com";

  const contactTagline =
    getValue(contact, ["cta", "tagline"], "FAÇA PARTE DESSA CONSTRUÇÃO") || "FAÇA PARTE DESSA CONSTRUÇÃO";

  const contactText =
    getValue(
      contact,
      ["finalText", "subtext"],
      "Ser Pantherium é fazer parte de algo maior — de uma identidade, de uma comunidade e de uma história que está sendo escrita agora. Venha fazer parte."
    ) || "";

  const contactButton =
    getValue(contact, ["callToAction"], "Seguir no Instagram") || "Seguir no Instagram";

  return (
    <>
      {/* NAVBAR */}
      <nav id="navbar" className={scrolled ? "scrolled" : ""}>
        <a href="#hero" className="nav-logo">
          <div className="nav-logo-icon">P</div>
          <span className="nav-logo-text">
            PANTHE<span>RIUM</span>
          </span>
        </a>

        <ul className="nav-links">
          <li><a href="#quem-somos">Quem Somos</a></li>
          <li><a href="#historia">História</a></li>
          <li><a href="#mascotes">Identidade</a></li>
          <li><a href="#diretoria">Diretoria</a></li>
          <li><a href="#galeria">Galeria</a></li>
          <li><a href="#contato" className="nav-cta">Contato</a></li>
        </ul>

        <div
          className={`hamburger ${mobileOpen ? "open" : ""}`}
          id="hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span></span><span></span><span></span>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`} id="mobileMenu">
        <a href="#quem-somos" onClick={() => setMobileOpen(false)}>Quem Somos</a>
        <a href="#historia" onClick={() => setMobileOpen(false)}>História</a>
        <a href="#mascotes" onClick={() => setMobileOpen(false)}>Identidade</a>
        <a href="#diretoria" onClick={() => setMobileOpen(false)}>Diretoria</a>
        <a href="#galeria" onClick={() => setMobileOpen(false)}>Galeria</a>
        <a href="#contato" onClick={() => setMobileOpen(false)}>Contato</a>
      </div>

      {/* HERO */}
      <section id="hero">
        <div className="hero-bg-grid"></div>
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>

        <div className="hero-content">
          <div className="hero-badge">{heroBadge}</div>

          <div className="hero-logo-img">
            <div className="logo-svg-wrapper">
              {heroLogoUrl ? (
                <Image
                  src={heroLogoUrl}
                  alt="Logo Pantherium"
                  width={110}
                  height={110}
                  unoptimized
                />
              ) : (
                <span className="logo-placeholder-text">⚡</span>
              )}
            </div>
          </div>

          <h1 className="hero-title">
            {heroTitleSplit.first}
            <span>{heroTitleSplit.second}</span>
          </h1>

          <p className="hero-subtitle-main">{heroSubtitle}</p>

          <p
            className="hero-tagline"
            dangerouslySetInnerHTML={{
              __html: formatTagline(heroTagline),
            }}
          />

          <p className="hero-sub">{heroSub}</p>

          <div className="hero-buttons">
            <a href="#historia" className="btn-primary">Conheça nossa história</a>
            <a href="#diretoria" className="btn-outline">Ver diretoria</a>
            <a href="#contato" className="btn-outline">Fale conosco</a>
          </div>
        </div>

        <div className="hero-scroll">
          <span>SCROLL</span>
          <div className="hero-scroll-line"></div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar fade-in visible">
        <div className="stat-item">
          <span className="stat-number">{getValue(hero, ["founded", "year"], "2023") || "2023"}</span>
          <span className="stat-label">Fundação</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{getValue(hero, ["members"], "+10") || "+10"}</span>
          <span className="stat-label">Membros</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{String(directors.length || 12)}</span>
          <span className="stat-label">Diretores</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">100%</span>
          <span className="stat-label">Enfermagem</span>
        </div>
      </div>

      {/* QUEM SOMOS */}
      <section id="quem-somos">
        <div className="section-label">Nossa missão</div>
        <h2 className="section-title">
          {renderSectionTitle(aboutTitle)}
        </h2>

        <div className="qs-grid">
          <div className="qs-text fade-in visible">
            <h3>Muito mais que esporte.</h3>
            <p>{aboutText1}</p>
            <p>{aboutText2}</p>
            <a
              href="#historia"
              className="btn-primary"
              style={{ marginTop: 24, display: "inline-block" }}
            >
              Conheça nossa trajetória
            </a>
          </div>

          <div className="qs-cards fade-in fade-in-delay-2 visible">
            <div className="qs-card">
              <div className="qs-card-icon">🏆</div>
              <h4>Esportes</h4>
              <p>Organizamos e treinamos times esportivos, representando a Enfermagem em competições universitárias.</p>
            </div>
            <div className="qs-card">
              <div className="qs-card-icon">🎉</div>
              <h4>Eventos</h4>
              <p>Promovemos eventos, festas e ações sociais que fortalecem os laços entre os estudantes.</p>
            </div>
            <div className="qs-card">
              <div className="qs-card-icon">🤝</div>
              <h4>Integração</h4>
              <p>Criamos momentos de conexão que vão além da sala de aula, aproximando calouros e veteranos.</p>
            </div>
            <div className="qs-card">
              <div className="qs-card-icon">💚</div>
              <h4>Pertencimento</h4>
              <p>Fortalecemos a identidade acadêmica e o orgulho de ser estudante de Enfermagem.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HISTÓRIA */}
      <section id="historia">
        <div className="historia-bg"></div>
        <div className="section-label">Desde 2023</div>
        <h2 className="section-title">
          NOSSA <span>HISTÓRIA</span>
        </h2>
        <p className="section-desc">
          Uma trajetória marcada por coragem, superação e a construção de uma identidade que veio para ficar.
        </p>

        <div className="timeline">
          {timeline.map((item) => (
            <div key={item.id} className="timeline-item visible">
              <div className="timeline-dot"></div>
              <div className="timeline-year">{item.year}</div>
              <div className="timeline-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MASCOTES E IDENTIDADE */}
      <section id="mascotes">
        <div className="section-label">Símbolos</div>
        <h2 className="section-title">
          MASCOTES E <span>IDENTIDADE</span>
        </h2>
        <p className="section-desc">
          Dois símbolos poderosos que juntos contam a história de quem somos: força de atleta, sabedoria de cuidador.
        </p>

        <div className="mascotes-grid fade-in visible">
          <div className="mascote-card">
            {panteraImage ? (
              <Image
                src={panteraImage}
                alt="Pantera"
                className="mascote-img"
                width={120}
                height={120}
                unoptimized
              />
            ) : (
              <div className="mascote-emoji">🐆</div>
            )}
            <h3>{panteraTitle}</h3>
            <p className="mascote-role">{panteraRole}</p>
            <p>{panteraDesc}</p>
            <div className="mascote-tags">
              <span className="mascote-tag">Força</span>
              <span className="mascote-tag">Coragem</span>
              <span className="mascote-tag">Liderança</span>
              <span className="mascote-tag">Determinação</span>
            </div>
          </div>

          <div className="mascote-card">
            {cobraImage ? (
              <Image
                src={cobraImage}
                alt="Cobra"
                className="mascote-img"
                width={120}
                height={120}
                unoptimized
              />
            ) : (
              <div className="mascote-emoji">🐍</div>
            )}
            <h3>{cobraTitle}</h3>
            <p className="mascote-role">{cobraRole}</p>
            <p>{cobraDesc}</p>
            <div className="mascote-tags">
              <span className="mascote-tag">Saúde</span>
              <span className="mascote-tag">Sabedoria</span>
              <span className="mascote-tag">Renovação</span>
              <span className="mascote-tag">Cuidado</span>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
            background: "var(--dark3)",
            border: "1px solid rgba(57,255,20,0.15)",
            borderRadius: 16,
            padding: 36,
            textAlign: "center",
          }}
          className="fade-in visible"
        >
          {centerArt ? (
            <Image
              src={centerArt}
              alt="Arte Pantherium"
              width={400}
              height={240}
              unoptimized
              style={{
                maxWidth: "400px",
                width: "100%",
                margin: "0 auto 24px",
                display: "block",
                borderRadius: "12px",
                objectFit: "contain",
              }}
            />
          ) : (
            <div style={{ fontSize: 80, marginBottom: 16 }}>🐆⚡🐍</div>
          )}

          <h3
            style={{
              fontFamily: "var(--font-title)",
              fontSize: 28,
              letterSpacing: 3,
              color: "var(--white)",
              marginBottom: 12,
            }}
          >
            JUNTAS, SOMOS PANTHERIUM
          </h3>

          <p
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 15,
              color: "var(--muted)",
              maxWidth: 500,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            {unionText}
          </p>
        </div>
      </section>

      {/* PROPÓSITO */}
      <section id="proposito">
        <div className="section-label">Atuação</div>
        <h2 className="section-title">
          NOSSO <span>PROPÓSITO</span>
        </h2>
        <p className="section-desc">
          A Pantherium atua em múltiplas frentes para garantir que cada estudante de Enfermagem tenha uma experiência universitária completa e inesquecível.
        </p>

        <div className="proposito-grid">
          <div className="prop-card fade-in visible">
            <div className="prop-icon">⚽</div>
            <h3>ESPORTES</h3>
            <p>Organizamos e treinamos times em diversas modalidades esportivas, levando a bandeira da Enfermagem para competições universitárias com garra e determinação.</p>
          </div>
          <div className="prop-card fade-in fade-in-delay-1 visible">
            <div className="prop-icon">🎪</div>
            <h3>EVENTOS</h3>
            <p>Criamos experiências memoráveis através de festas, eventos sociais e encontros que fortalecem os laços entre os estudantes do curso.</p>
          </div>
          <div className="prop-card fade-in fade-in-delay-2 visible">
            <div className="prop-icon">📚</div>
            <h3>INTEGRAÇÃO ACADÊMICA</h3>
            <p>Promovemos ações que aproximam calouros e veteranos, criando uma rede de apoio que vai além da sala de aula e facilita a jornada universitária.</p>
          </div>
          <div className="prop-card fade-in visible">
            <div className="prop-icon">❤️</div>
            <h3>AÇÃO SOCIAL</h3>
            <p>Realizamos ações sociais que refletem o espírito da Enfermagem: cuidar, servir e impactar positivamente a comunidade ao redor.</p>
          </div>
          <div className="prop-card fade-in fade-in-delay-1 visible">
            <div className="prop-icon">📢</div>
            <h3>REPRESENTATIVIDADE</h3>
            <p>Damos voz ao estudante de Enfermagem, representando o curso com orgulho e demonstrando que a área da saúde tem força, presença e identidade.</p>
          </div>
          <div className="prop-card fade-in fade-in-delay-2 visible">
            <div className="prop-icon">🏅</div>
            <h3>IDENTIDADE ESTUDANTIL</h3>
            <p>Cultivamos o sentimento de pertencimento e o orgulho de ser estudante de Enfermagem, criando memórias e conexões que duram para sempre.</p>
          </div>
        </div>
      </section>

      {/* DIRETORIA */}
      <section id="diretoria">
        <div className="section-label">Gestão 2025</div>
        <h2 className="section-title">
          NOSSA <span>DIRETORIA</span>
        </h2>
        <p className="section-desc">
          As pessoas que fazem a Pantherium acontecer todos os dias — com dedicação, liderança e amor pelo que fazem.
        </p>

        {featuredDirectors.length > 0 && (
          <div className="dir-highlight">
            {featuredDirectors.map((director) => (
              <div key={director.id} className="dir-card-highlight fade-in visible">
                <div className="dir-photo">
                  {director.photoUrl ? (
                    <Image
                      src={director.photoUrl}
                      alt={director.name}
                      width={80}
                      height={80}
                      unoptimized
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    getInitials(director.name)
                  )}
                </div>

                <div className="dir-info">
                  <h4>{director.name}</h4>
                  <div className="dir-cargo">{director.role}</div>
                  {director.bio && (
                    <p
                      style={{
                        fontFamily: "var(--font-text)",
                        fontSize: 13,
                        color: "var(--muted)",
                        marginTop: 8,
                        lineHeight: 1.6,
                      }}
                    >
                      {director.bio}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {regularDirectors.length > 0 && (
          <div className="dir-grid">
            {regularDirectors.map((director) => (
              <div key={director.id} className="dir-card fade-in visible">
                <div className="dir-photo-sm">
                  {director.photoUrl ? (
                    <Image
                      src={director.photoUrl}
                      alt={director.name}
                      width={64}
                      height={64}
                      unoptimized
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    getInitials(director.name)
                  )}
                </div>
                <h4>{director.name}</h4>
                <div className="dir-cargo-sm">{director.role}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* GALERIA */}
      <section id="galeria">
        <div className="section-label">Momentos</div>
        <h2 className="section-title">
          NOSSA <span>GALERIA</span>
        </h2>
        <p className="section-desc">
          Registros reais da Pantherium — união, presença e vivência acadêmica.
        </p>

        {gallery.length > 0 && (
          <div className="galeria-grid galeria-fotos">
            {gallery.slice(0, 2).map((item, index) => (
              <div
                key={item.id}
                className={`galeria-item ${index === 0 ? "galeria-principal" : ""}`}
                onClick={() => setLightbox(item)}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.caption || `Imagem ${index + 1}`}
                  fill
                  unoptimized
                  style={{ objectFit: "cover" }}
                />
                <div className="galeria-overlay"><span>🔍</span></div>
              </div>
            ))}
          </div>
        )}

        {!gallery.length && (
          <div className="galeria-grid galeria-fotos">
            <div className="galeria-item galeria-principal">
              <div className="galeria-placeholder">📸</div>
            </div>
            <div className="galeria-item">
              <div className="galeria-placeholder">📸</div>
            </div>
          </div>
        )}
      </section>

      {/* LIGHTBOX */}
      <div
        className={`lightbox ${lightbox ? "active" : ""}`}
        id="lightbox"
        onClick={() => setLightbox(null)}
      >
        <button
          className="lightbox-close"
          onClick={(e) => {
            e.stopPropagation();
            setLightbox(null);
          }}
        >
          ✕
        </button>

        {lightbox && (
          <Image
            src={lightbox.imageUrl}
            alt={lightbox.caption || "Imagem ampliada"}
            width={1200}
            height={900}
            unoptimized
            id="lightboxImg"
          />
        )}
      </div>

      {/* CONTATO */}
      <section id="contato">
        <div className="contato-inner">
          <div className="section-label">Conecte-se</div>

          <h2
            className="contato-tagline"
            dangerouslySetInnerHTML={{
              __html: formatContactTitle(contactTagline),
            }}
          />

          <p className="contato-sub">{contactText}</p>

          <div className="contato-links">
            <a
              href={`https://instagram.com/${instagram.replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
              className="contato-link"
            >
              <span className="contato-link-icon">📷</span>
              <div className="contato-link-text">
                <span className="contato-link-label">Instagram</span>
                <span className="contato-link-value">{instagram}</span>
              </div>
            </a>

            <a href={`mailto:${email}`} className="contato-link">
              <span className="contato-link-icon">✉️</span>
              <div className="contato-link-text">
                <span className="contato-link-label">E-mail</span>
                <span className="contato-link-value">{email}</span>
              </div>
            </a>
          </div>

          <a
            href={`https://instagram.com/${instagram.replace("@", "")}`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            {contactButton}
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>
              PANTHE<span>RIUM</span>
            </h3>
            <p>
              Atlética de Enfermagem do Centro Universitário UNEF. Força, união e propósito dentro e fora da Enfermagem.
            </p>
            <div className="footer-socials">
              <a
                href={`https://instagram.com/${instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="footer-social"
              >
                📷
              </a>
              <a href={`mailto:${email}`} className="footer-social">✉️</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navegação</h4>
            <ul>
              <li><a href="#quem-somos">Quem Somos</a></li>
              <li><a href="#historia">Nossa História</a></li>
              <li><a href="#mascotes">Mascotes</a></li>
              <li><a href="#proposito">Propósito</a></li>
              <li><a href="#diretoria">Diretoria</a></li>
              <li><a href="#galeria">Galeria</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contato</h4>
            <ul>
              <li>
                <a
                  href={`https://instagram.com/${instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {instagram}
                </a>
              </li>
              <li><a href={`mailto:${email}`}>{email}</a></li>
              <li><a href="/admin">Admin</a></li>
            </ul>

            <div style={{ marginTop: 24 }}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Fundação
              </div>

              <div
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: 28,
                  color: "var(--neon)",
                  letterSpacing: 2,
                }}
              >
                2023
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2025 <span className="footer-neon">Pantherium</span> — Atlética de Enfermagem UNEF. Todos os direitos reservados.
          </p>
          <p style={{ fontSize: 11 }}>🐆 Força · 🐍 Sabedoria · 💚 Enfermagem</p>
        </div>
      </footer>
    </>
  );
}

function getValue<T extends object>(
  obj: T | null | undefined,
  keys: string[],
  fallback = ""
): string {
  if (!obj) return fallback;
  for (const key of keys) {
    const value = (obj as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return fallback;
}

function getInitials(name?: string) {
  if (!name) return "P";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

function renderSectionTitle(title: string) {
  if (title.toUpperCase().includes("ATLÉTICA")) {
    const idx = title.toUpperCase().indexOf("ATLÉTICA");
    const first = title.slice(0, idx);
    const second = title.slice(idx, idx + "ATLÉTICA".length);
    const last = title.slice(idx + "ATLÉTICA".length);

    return (
      <>
        {first}
        <span>{second}</span>
        {last}
      </>
    );
  }

  return title;
}

function formatTagline(text: string) {
  const normalized = text || "Mais que uma atlética. Uma identidade.";
  const regex = /(Uma identidade\.?)/i;

  if (regex.test(normalized)) {
    return normalized.replace(regex, "<br><strong>$1</strong>");
  }

  return normalized;
}

function formatContactTitle(text: string) {
  const normalized = text || "FAÇA PARTE DESSA CONSTRUÇÃO";
  if (normalized.toUpperCase().includes("CONSTRUÇÃO")) {
    return normalized.replace(/CONSTRUÇÃO/i, "<br><span>CONSTRUÇÃO</span>");
  }
  return normalized;
}