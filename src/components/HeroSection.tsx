import type { Locale, ProfileContent, UiLabels } from '../types/content';
import { t } from '../content/i18n';
import { SectionWrapper } from './SectionWrapper';

interface HeroSectionProps {
  locale: Locale;
  profile: ProfileContent;
  ui: UiLabels;
  cvUrl: string;
}

export function HeroSection({ locale, profile, ui, cvUrl }: HeroSectionProps) {
  return (
    <SectionWrapper id="home" className="pt-10 sm:pt-16">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            {profile.role[locale]} · {profile.location[locale]}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-[var(--title)] sm:text-5xl md:text-6xl">
            {profile.headline[locale]}
          </h1>
          <p className="mt-4 max-w-2xl font-mono text-sm text-[var(--muted)] sm:text-base">{profile.subheadline[locale]}</p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text)] sm:text-lg">{profile.shortBio[locale]}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-lime-300 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-900/20 transition hover:opacity-90"
            >
              {t(ui.ctas.viewProjects, locale)}
            </a>
            <a
              href={cvUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[var(--line)] bg-[var(--card)] px-5 py-3 text-sm font-semibold text-[var(--title)] transition hover:border-[var(--accent)]"
            >
              {t(ui.ctas.downloadCv, locale)}
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="terminal-window">
            <div className="terminal-bar">
              <span className="dot red" />
              <span className="dot amber" />
              <span className="dot green" />
              <span className="terminal-title">/portfolio/runtime</span>
            </div>
            <ol className="terminal-lines" aria-label="Technical profile summary">
              {profile.terminalLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
          </div>

          <div className="glass-panel flex items-center gap-4 p-4">
            <img
              src={profile.photo}
              alt={profile.name}
              className="h-24 w-24 rounded-2xl border border-[var(--line)] object-cover shadow-glow"
              loading="eager"
            />
            <div>
              <p className="font-display text-lg font-semibold text-[var(--title)]">{profile.name}</p>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{profile.role[locale]}</p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

