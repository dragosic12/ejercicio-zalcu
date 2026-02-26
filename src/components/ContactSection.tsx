import type { ContactContent, Locale, SocialLinks, UiLabels } from '../types/content';
import { SectionWrapper } from './SectionWrapper';
import { t } from '../content/i18n';

interface ContactSectionProps {
  locale: Locale;
  contact: ContactContent;
  social: SocialLinks;
  ui: UiLabels;
}

export function ContactSection({ locale, contact, social, ui }: ContactSectionProps) {
  return (
    <SectionWrapper id="contact" className="pt-12 sm:pt-20">
      <div className="section-header">
        <h2>{t(contact.title, locale)}</h2>
        <p>{t(contact.text, locale)}</p>
      </div>

      <div className="glass-panel mt-6 flex flex-wrap items-center gap-3 p-5 sm:p-6">
        <a
          href={`mailto:${social.email}`}
          className="rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-lime-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:opacity-90"
        >
          {t(contact.emailLabel, locale)}
        </a>

        {social.github ? (
          <a
            href={social.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[var(--line)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--title)] transition hover:border-[var(--accent)]"
          >
            {t(ui.social.github, locale)}
          </a>
        ) : null}

        {social.linkedin ? (
          <a
            href={social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[var(--line)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--title)] transition hover:border-[var(--accent)]"
          >
            {t(ui.social.linkedin, locale)}
          </a>
        ) : null}

        <a
          href={social.cv}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-[var(--line)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--title)] transition hover:border-[var(--accent)]"
        >
          {t(contact.cvLabel, locale)}
        </a>
      </div>
    </SectionWrapper>
  );
}

