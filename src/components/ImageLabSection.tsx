import { useEffect, useMemo, useState } from 'react';
import type { ImageLabContent, Locale } from '../types/content';
import { t } from '../content/i18n';
import { SectionWrapper } from './SectionWrapper';

const HF_TOKEN_STORAGE_KEY = 'dragos.hf_token';
const HF_MODEL_URL = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev';

interface ImageLabSectionProps {
  locale: Locale;
  imageLab: ImageLabContent;
}

export function ImageLabSection({ locale, imageLab }: ImageLabSectionProps) {
  const [token, setToken] = useState<string>(() => window.localStorage.getItem(HF_TOKEN_STORAGE_KEY) ?? '');
  const [rememberToken, setRememberToken] = useState<boolean>(() => Boolean(window.localStorage.getItem(HF_TOKEN_STORAGE_KEY)));
  const [showToken, setShowToken] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState(imageLab.styleOptions[0]?.value ?? 'realistic');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [downloadName, setDownloadName] = useState('dragos-ai-image.png');

  const quickPrompts = useMemo(() => imageLab.quickPrompts.map((item) => t(item, locale)), [imageLab.quickPrompts, locale]);

  useEffect(() => {
    if (rememberToken && token.trim()) {
      window.localStorage.setItem(HF_TOKEN_STORAGE_KEY, token.trim());
    } else {
      window.localStorage.removeItem(HF_TOKEN_STORAGE_KEY);
    }
  }, [rememberToken, token]);

  useEffect(
    () => () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    },
    [imageUrl]
  );

  async function handleGenerate() {
    const cleanToken = token.trim();
    if (!cleanToken) {
      setError(t(imageLab.missingTokenError, locale));
      return;
    }

    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) {
      setError(t(imageLab.missingPromptError, locale));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(HF_MODEL_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `${cleanPrompt}, style: ${style}`,
        }),
      });

      if (!response.ok) {
        const details = (await response.text()).trim();
        throw new Error(details || `${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) {
        const details = await blob.text();
        throw new Error(details || 'Invalid API response');
      }

      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }

      const nextUrl = URL.createObjectURL(blob);
      setImageUrl(nextUrl);
      setDownloadName(`dragos-ai-${Date.now()}.png`);

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Image ready', {
          body: locale === 'es' ? 'Tu imagen está lista para descargar.' : 'Your image is ready to download.',
        });
      }
    } catch (caughtError) {
      const details = caughtError instanceof Error ? caughtError.message : String(caughtError);
      setError(`${t(imageLab.apiErrorPrefix, locale)}: ${details}`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleClear() {
    setPrompt('');
    setError('');
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl('');
  }

  return (
    <SectionWrapper id="image-lab" className="pt-12 sm:pt-20">
      <div className="section-header">
        <h2>{t(imageLab.title, locale)}</h2>
        <p>{t(imageLab.intro, locale)}</p>
      </div>

      <div className="generator-grid mt-8">
        <article className="glass-panel p-5 sm:p-6">
          <label htmlFor="hf-token" className="generator-label">
            {t(imageLab.tokenLabel, locale)}
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="hf-token"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              type={showToken ? 'text' : 'password'}
              className="generator-input"
              placeholder="hf_xxxxxxxxxxxxxxxxx"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowToken((previous) => !previous)}
              className="generator-secondary-button sm:w-auto"
            >
              {showToken ? t(imageLab.hideTokenLabel, locale) : t(imageLab.showTokenLabel, locale)}
            </button>
          </div>
          <p className="generator-hint mt-2">{t(imageLab.tokenHint, locale)}</p>

          <label className="mt-3 inline-flex items-center gap-2 font-mono text-xs text-[var(--muted)]">
            <input
              type="checkbox"
              checked={rememberToken}
              onChange={(event) => setRememberToken(event.target.checked)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            <span>{t(imageLab.rememberTokenLabel, locale)}</span>
          </label>

          <label htmlFor="prompt" className="generator-label mt-5">
            {t(imageLab.promptLabel, locale)}
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="generator-input mt-2 min-h-28"
            placeholder={t(imageLab.promptPlaceholder, locale)}
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {quickPrompts.map((quickPrompt) => (
              <button
                key={quickPrompt}
                type="button"
                className="chip text-left"
                onClick={() => setPrompt(quickPrompt)}
              >
                {quickPrompt}
              </button>
            ))}
          </div>

          <label htmlFor="style" className="generator-label mt-5">
            {t(imageLab.styleLabel, locale)}
          </label>
          <select id="style" value={style} onChange={(event) => setStyle(event.target.value)} className="generator-input mt-2">
            {imageLab.styleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label, locale)}
              </option>
            ))}
          </select>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={handleGenerate} disabled={isLoading} className="generator-primary-button">
              {isLoading ? t(imageLab.generatingLabel, locale) : t(imageLab.generateLabel, locale)}
            </button>
            <button type="button" onClick={handleClear} disabled={isLoading} className="generator-secondary-button">
              {t(imageLab.clearLabel, locale)}
            </button>
          </div>

          {error ? (
            <p role="alert" className="mt-3 rounded-xl border border-rose-400/45 bg-rose-300/10 p-3 text-sm text-rose-300">
              {error}
            </p>
          ) : null}

          <p className="generator-hint mt-3">{t(imageLab.note, locale)}</p>
        </article>

        <article className="glass-panel p-5 sm:p-6">
          <p className="generator-label">{t(imageLab.previewTitle, locale)}</p>
          <div className="preview-area mt-3">
            {imageUrl ? (
              <img src={imageUrl} alt="Generated with Hugging Face" className="h-full w-full object-contain" />
            ) : (
              <p className="px-4 text-center text-sm text-[var(--muted)]">{t(imageLab.emptyPreviewText, locale)}</p>
            )}
          </div>

          {imageUrl ? (
            <a href={imageUrl} download={downloadName} className="generator-primary-button mt-4 inline-flex">
              {t(imageLab.downloadLabel, locale)}
            </a>
          ) : null}
        </article>
      </div>
    </SectionWrapper>
  );
}

