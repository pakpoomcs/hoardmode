import { useEffect, useRef, useState } from 'react';
import type { Animus } from '@/types';

interface Props {
  animus: Animus;
  onClick?: (animus: Animus) => void;
  selected?: boolean;
  /** Show tier pin — hide in tier rows since tier is implied */
  showTier?: boolean;
}

const AFF_COLORS: Record<string, string> = {
  Reason:   'var(--c-reason)',
  Hollow:   'var(--c-hollow)',
  Odd:      'var(--c-odd)',
  Constant: 'var(--c-constant)',
  Disorder: 'var(--c-disorder)',
};

export function AnimusCard({ animus, onClick, selected, showTier = true }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: '150px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className={`animus-card${selected ? ' animus-card--selected' : ''}`}
      onClick={() => onClick?.(animus)}
      title={`${animus.name} · ${animus.affinity} · ${animus.baseSpeed} SPD`}
    >
      <img
        ref={imgRef}
        src={inView ? `/assets/animus/${animus.imageFile}` : ''}
        alt={animus.name}
        className={`animus-card__portrait ${loaded ? 'animus-card__portrait--loaded' : 'animus-card__portrait--loading'}`}
        onLoad={() => setLoaded(true)}
      />

      {/* Affinity dot — top right */}
      <div
        className="animus-card__aff-pin"
        style={{ background: AFF_COLORS[animus.affinity] }}
      />

      {/* Tier — top left (optional) */}
      {showTier && (
        <div className={`animus-card__tier-pin animus-card__tier-pin--${animus.tier}`}>
          {animus.tier}
        </div>
      )}

      {/* Shadow Print indicator */}
      {animus.isShadowPrintRequired && (
        <div className="animus-card__sp">SP</div>
      )}

      {/* Name overlay */}
      <div className="animus-card__overlay">
        <div className="animus-card__name">{animus.name}</div>
      </div>
    </div>
  );
}
