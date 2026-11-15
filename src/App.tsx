import { useEffect, useState } from 'react'
import DownloadDialog, { type DownloadDialogKind } from './components/DownloadDialog'
import './App.css'

type IconName = 'arrow' | 'spark' | 'plate' | 'target' | 'people' | 'heart' | 'camera' | 'leaf' | 'menu' | 'close' | 'check' | 'up' | 'moon' | 'sun'
type ThemeMode = 'light' | 'dark'

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const shared = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }

  switch (name) {
    case 'arrow': return <svg {...shared}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
    case 'spark': return <svg {...shared}><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" /></svg>
    case 'plate': return <svg {...shared}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="5" /><path d="M3 4v6M1.5 7h3M21 4v7M21 11v9" /></svg>
    case 'target': return <svg {...shared}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5.5" /><circle cx="12" cy="12" r="2" /><path d="m14 10 6-6" /></svg>
    case 'people': return <svg {...shared}><path d="M16 21v-1.6a3.4 3.4 0 0 0-3.4-3.4H7.4A3.4 3.4 0 0 0 4 19.4V21" /><circle cx="10" cy="8" r="3.5" /><path d="M20 21v-1.6a3.4 3.4 0 0 0-2.6-3.3M16 4.7a3.5 3.5 0 0 1 0 6.6" /></svg>
    case 'heart': return <svg {...shared}><path d="M20.2 8.8c0 4.4-8.2 10-8.2 10s-8.2-5.6-8.2-10A4.2 4.2 0 0 1 12 6.1a4.2 4.2 0 0 1 8.2 2.7Z" /></svg>
    case 'camera': return <svg {...shared}><path d="M4 7.5h3l1.6-2h6.8l1.6 2h3A1.5 1.5 0 0 1 21.5 9v9a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 18V9A1.5 1.5 0 0 1 4 7.5Z" /><circle cx="12" cy="13" r="3.5" /></svg>
    case 'leaf': return <svg {...shared}><path d="M20 4c-8.4 0-14 3.4-14 9.3A5.7 5.7 0 0 0 11.7 19C17.5 19 20 11.8 20 4Z" /><path d="M4 21c2.5-5.5 6.1-8.5 11-11" /></svg>
    case 'menu': return <svg {...shared}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
    case 'close': return <svg {...shared}><path d="m6 6 12 12M18 6 6 18" /></svg>
    case 'check': return <svg {...shared}><path d="m5 12 4 4L19 6" /></svg>
    case 'up': return <svg {...shared}><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    case 'moon': return <svg {...shared}><path d="M20.4 14.4A8.2 8.2 0 0 1 9.6 3.6 8.4 8.4 0 1 0 20.4 14.4Z" /></svg>
    case 'sun': return <svg {...shared}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
  }
}

const publicPath = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const photo = (id: string) => publicPath(`assets/${id}.webp`)

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  try {
    const saved = window.localStorage.getItem('nutria-theme')
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    // Storage may be unavailable in a restricted browser context.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [liked, setLiked] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme)
  const [downloadKind, setDownloadKind] = useState<DownloadDialogKind>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#15171b' : '#fffaf4')
    try {
      window.localStorage.setItem('nutria-theme', theme)
    } catch {
      // The selected theme still works for the current page if storage is unavailable.
    }
  }, [theme])

  useEffect(() => {
    const updateBackToTop = () => setShowBackToTop(window.scrollY > 420)
    updateBackToTop()
    window.addEventListener('scroll', updateBackToTop, { passive: true })
    return () => window.removeEventListener('scroll', updateBackToTop)
  }, [])

  const handleDownload = () => {
    const userAgent = navigator.userAgent
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    if (isIOS) {
      setDownloadKind('ios')
      return
    }

    if (/Android/i.test(userAgent)) {
      const link = document.createElement('a')
      link.href = '/downloads/nutria-placeholder.txt'
      link.download = 'nutria-preview.txt'
      document.body.appendChild(link)
      link.click()
      link.remove()
      setDownloadKind('apk-demo')
      return
    }

    setDownloadKind('qr')
  }

  return (
    <>
      <header className="site-header">
        <div className="nav-wrap">
          <a className="brand" href="#inicio" aria-label="Nutria — início" onClick={closeMenu}><img src="/assets/7-7.svg" alt="Nutria — Alimentando uma vida melhor" /></a>
          <nav id="main-navigation" className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Navegação principal">
            <a href="#como-funciona" onClick={closeMenu}>Como funciona</a><a href="#metas" onClick={closeMenu}>No seu ritmo</a><a href="#comunidade" onClick={closeMenu}>Comunidade</a>
            <button className="button button-small nav-cta" type="button" aria-haspopup="dialog" onClick={() => { closeMenu(); handleDownload() }}>Baixar o app <Icon name="arrow" size={16} /></button>
          </nav>
          <div className="nav-controls">
            <button className="theme-toggle" type="button" aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'} aria-pressed={theme === 'dark'} title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'} onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} /></button>
            <button className="menu-toggle" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen((open) => !open)} type="button"><Icon name={menuOpen ? 'close' : 'menu'} size={22} /></button>
          </div>
        </div>
      </header>
      <main>
        <section className="hero" id="inicio">
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
          <div className="hero-inner page-width">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-dot" /> Uma rede social que faz bem</div>
              <h1>Comer melhor começa <span>no seu dia a dia.</span></h1>
              <p className="hero-lead">O Nutria transforma cada refeição em uma escolha mais leve — com comunidade, metas que fazem sentido e espaço para a vida real.</p>
              <div className="hero-actions"><button className="button button-primary" type="button" aria-haspopup="dialog" onClick={handleDownload}>Baixar o app <Icon name="arrow" size={18} /></button><a className="text-link" href="#comunidade">Veja a comunidade <span className="link-circle"><Icon name="arrow" size={15} /></span></a></div>
              <div className="hero-note"><div className="mini-avatars" aria-hidden="true"><img src={photo('2-45')} alt="" /><img src={photo('2-47')} alt="" /><img src={photo('2-44')} alt="" /></div><span>Comida de verdade.<br /><strong>Sem perfeição, sem pressão.</strong></span></div>
            </div>
            <div className="hero-art" aria-label="Prévia do feed e do registro nutricional no aplicativo Nutria">
              <div className="hero-backdrop" />
              <div className="hero-sticker sticker-top"><span className="sticker-icon"><Icon name="spark" size={18} /></span><span><strong>Feito para você</strong><small>e para a sua rotina</small></span></div>
              <article className="phone-preview">
                <div className="phone-topline"><span className="phone-camera" /><span>9:41</span><span className="phone-status">● ● ▰</span></div>
                <div className="phone-header"><img src="/assets/7-11.svg" alt="Nutria" /><span className="icon-button" aria-hidden="true">♡</span></div>
                <div className="story-row" aria-label="Pessoas da sua comunidade"><div className="story story-add"><span>+</span><small>Seu dia</small></div><div className="story"><img src={photo('2-45')} alt="" /><small>ana.c</small></div><div className="story"><img src={photo('2-47')} alt="" /><small>luiza.m</small></div><div className="story"><img src={photo('2-44')} alt="" /><small>gui.r</small></div></div>
                <div className="feed-post"><div className="post-author"><img src={photo('2-45')} alt="" /><span><strong>ana.costa</strong><small>Almoço no escritório</small></span><span className="more-dots">···</span></div><div className="post-photo"><img src={photo('2-46')} alt="Uma refeição leve durante o expediente" /><span className="photo-tag"><Icon name="leaf" size={13} /> refeição equilibrada</span></div><div className="post-reactions"><button type="button" className={`reaction-hearts like-button${liked ? ' is-liked' : ''}`} aria-label={liked ? 'Descurtir publicação' : 'Curtir publicação'} aria-pressed={liked} onClick={() => setLiked((active) => !active)}><Icon name="heart" size={17} /> <strong>{liked ? 25 : 24}</strong></button><span>um prato de cada vez</span><span className="bookmark">⌑</span></div><div className="post-caption"><strong>ana.costa</strong> Pausa gostosa entre reuniões. <span>#almoçoreal</span></div></div>
                <div className="nutrition-strip"><div><small>Seu prato</small><strong>Uma escolha <em>de cada vez</em></strong></div><span className="strip-leaf"><Icon name="leaf" size={18} /></span></div>
              </article>
              <div className="hero-sticker sticker-bottom"><span className="calorie-mark"><Icon name="target" size={19} /></span><span><small>Seu objetivo,</small><strong>no seu ritmo.</strong></span><span className="tiny-check"><Icon name="check" size={14} /></span></div>
              <div className="floating-seed seed-a" /><div className="floating-seed seed-b" /><div className="floating-seed seed-c" />
            </div>
          </div>
          <div className="hero-bottom page-width"><span>UM JEITO MAIS HUMANO DE SE ALIMENTAR</span><a href="#como-funciona" aria-label="Role para saber como funciona"><span className="scroll-mark"><Icon name="arrow" size={16} /></span></a><span>DESLIZE PARA DESCOBRIR</span></div>
        </section>
        <section className="intro-section section-pad" id="como-funciona"><div className="page-width">
          <div className="section-heading intro-heading"><div><span className="section-kicker">O QUE É O NUTRIA</span><h2>Uma rede social para<br /><span>alimentar bons hábitos.</span></h2></div><p>Um lugar para compartilhar pratos, acompanhar o que importa para você e encontrar inspiração em quem também está tentando fazer o melhor possível.</p></div>
          <div className="feature-row">
            <article className="feature-card feature-orange"><div className="feature-icon"><Icon name="camera" size={23} /></div><span className="feature-number">01</span><h3>Compartilhe<br />o que está no prato.</h3><p>Fotos, ideias e refeições reais em um feed feito para inspirar — não para comparar.</p><a href="#rotina" className="feature-link" aria-label="Descubra como compartilhar pratos"><Icon name="arrow" size={18} /></a></article>
            <article className="feature-card feature-green"><div className="feature-icon"><Icon name="target" size={23} /></div><span className="feature-number">02</span><h3>Entenda o que<br />faz sentido para você.</h3><p>Registre seus macros manualmente ou deixe a IA ajudar a estimar o que tem no prato.</p><a href="#metas" className="feature-link" aria-label="Saiba como acompanhar macros"><Icon name="arrow" size={18} /></a></article>
            <article className="feature-card feature-purple"><div className="feature-icon"><Icon name="people" size={23} /></div><span className="feature-number">03</span><h3>Encontre gente<br />que entende você.</h3><p>Grupos e comunidades para dividir objetivos, rotina e pequenas vitórias.</p><a href="#comunidade" className="feature-link" aria-label="Conheça as comunidades"><Icon name="arrow" size={18} /></a></article>
          </div>
        </div></section>
        <section className="nutrition-section" id="metas"><div className="nutrition-inner page-width">
          <div className="nutrition-copy"><span className="section-kicker kicker-light"><span className="kicker-dot" /> NUTRIÇÃO SEM COMPLICAÇÃO</span><h2>Mais clareza.<br /><span>Menos conta de cabeça.</span></h2><p>Defina metas e limites de acordo com o seu objetivo corporal. Registre macros manualmente ou use a IA para estimar a refeição e entender como ela se encaixa no seu dia.</p><a className="button button-light" href="#como-funciona">Veja como funciona <Icon name="arrow" size={17} /></a><div className="nutrition-annotation"><span className="annotation-star">✳</span><span>Metas que acompanham<br /><strong>a sua realidade.</strong></span></div></div>
          <div className="nutrition-art"><div className="nutrition-ring ring-large" /><div className="nutrition-ring ring-small" /><div className="nutrition-sprout"><Icon name="leaf" size={28} /></div>
            <div className="meal-card"><div className="meal-card-heading"><div><span>SEU REGISTRO</span><strong>Um almoço possível</strong></div><span className="meal-date">HOJE</span></div><img src={photo('2-44')} alt="Uma refeição compartilhada por alguém da comunidade Nutria" /><div className="meal-card-foot"><span><Icon name="spark" size={15} /> Estimativa por IA</span><span>Ver macros <Icon name="arrow" size={14} /></span></div><div className="macro-grid"><div><span className="macro-dot macro-orange" /><strong>28g</strong><small>proteínas</small></div><div><span className="macro-dot macro-green" /><strong>42g</strong><small>carboidratos</small></div><div><span className="macro-dot macro-yellow" /><strong>16g</strong><small>gorduras</small></div></div><div className="goal-progress"><div className="goal-label"><span>Progresso do dia</span><strong>62%</strong></div><div className="progress-track"><span /></div><small>Um passo de cada vez.</small></div></div>
            <div className="ai-bubble"><span className="ai-bubble-icon"><Icon name="spark" size={19} /></span><span><small>LEITURA DO PRATO</small><strong>Uma estimativa, não uma regra.</strong></span></div>
          </div>
        </div></section>
        <section className="day-section section-pad" id="rotina"><div className="page-width day-grid">
          <div className="day-photo-wrap"><div className="day-photo"><img src={photo('2-46')} alt="Uma pessoa faz uma pausa para comer entre tarefas do trabalho" /></div><div className="photo-caption"><span className="caption-mark"><Icon name="leaf" size={20} /></span><span><small>UM ALMOÇO DE VERDADE</small><strong>Mesmo nos dias cheios.</strong></span></div><div className="day-orbit" /><span className="photo-number">01 — 03</span></div>
          <div className="day-copy"><span className="section-kicker">PARA A VIDA COMO ELA É</span><h2>Entre uma reunião<br />e outra, <span>cuide de você.</span></h2><p>Nem todo dia tem tempo para planejar, cozinhar ou seguir tudo à risca. O Nutria nasceu para caber na agenda de quem trabalha, corre de um compromisso para outro e ainda quer se sentir bem.</p><ul className="day-list"><li><span><Icon name="check" size={15} /></span> Refeições reais, sem cardápio perfeito</li><li><span><Icon name="check" size={15} /></span> Metas construídas ao seu redor</li><li><span><Icon name="check" size={15} /></span> Pequenos passos que contam</li></ul><a className="text-link day-link" href="#como-funciona">Um jeito mais leve de começar <span className="link-circle"><Icon name="arrow" size={15} /></span></a></div>
        </div></section>
        <section className="community-section section-pad" id="comunidade"><div className="page-width community-grid">
          <div className="community-copy"><span className="section-kicker">COMER JUNTO É DIFERENTE</span><h2>O incentivo também<br />pode estar <span>na mesa.</span></h2><p>Conheça pessoas com objetivos parecidos, descubra novas ideias e compartilhe aquela vitória que parece pequena — mas não é.</p><div className="community-tags"><span>Rotina de escritório</span><span>Mais energia</span><span>Comer com equilíbrio</span><span>Novos hábitos</span></div><a className="button button-outline" href="#como-funciona">Explore as possibilidades <Icon name="arrow" size={17} /></a></div>
          <div className="community-art"><div className="community-main-photo"><img src={photo('2-45')} alt="Colegas de trabalho compartilham uma refeição" /></div><div className="community-small-photo"><img src={photo('2-47')} alt="Uma refeição compartilhada com outras pessoas" /></div><div className="community-badge"><span className="badge-icon"><Icon name="people" size={22} /></span><strong>Um espaço<br />para cada rotina.</strong><small>O seu jeito também cabe aqui.</small></div><div className="community-doodle">nutrir<br /><span>é compartilhar</span><b>↗</b></div></div>
        </div></section>

      </main>
      <footer className="site-footer" id="contato">
        <div className="page-width footer-top">
          <a className="footer-logo" href="#inicio" aria-label="Nutria — voltar ao início"><img src="/assets/7-7.svg" alt="Nutria" /></a>
          <span className="footer-tagline">Alimentando uma vida melhor.</span>
          <nav className="footer-nav" aria-label="Navegação do rodapé">
            <a href="#como-funciona">O aplicativo</a><a href="#metas">Nutrição</a><a href="#comunidade">Comunidade</a><a href="#como-funciona">Sobre o Nutria</a><a href="mailto:contato@nutria.app">Contato</a>
          </nav>
        </div>
        <div className="page-width footer-bottom"><span>© 2026 Nutria. Uma refeição de cada vez.</span></div>
      </footer>
      <DownloadDialog kind={downloadKind} onClose={() => setDownloadKind(null)} />
      {showBackToTop && <button className="back-to-top" type="button" aria-label="Voltar ao topo" title="Voltar ao topo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><Icon name="up" size={20} /></button>}
    </>
  )
}

export default App
