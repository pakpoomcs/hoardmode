import { useEffect, useRef, useState } from 'react';
import type { Animus } from '@/types';
import { AffinityBadge } from './AffinityBadge';
import { SpeedIndicator } from './SpeedIndicator';

interface Props {
  animus: Animus;
  onClick?: (animus: Animus) => void;
  selected?: boolean;
}

export function AnimusCard({ animus, onClick, selected }: Props) {
  const imgRef  = useRef<HTMLImageElement>(null);
  const [inView, setInView]   = useState(false);
  const [loaded, setLoaded]   = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: '120px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`animus-card${selected ? ' animus-card--selected' : ''}`}
      onClick={() => onClick?.(animus)}
      style={selected ? { borderColor: 'var(--accent)' } : undefined}
    >
      <img
        ref={imgRef}
        src={inView ? `/assets/animus/${animus.imageFile}` : ''}
        alt={animus.name}
        className={`animus-card__portrait ${loaded ? 'animus-card__portrait--loaded' : 'animus-card__portrait--loading'}`}
        onLoad={() => setLoaded(true)}
      />
      <div className="animus-card__body">
        <div className="animus-card__name" title={animus.name}>{animus.name}</div>
        <div className="animus-card__meta">
          <span className={`tier-badge tier-badge--${animus.tier}`}>{animus.tier}</span>
          <AffinityBadge affinity={animus.affinity} showIcon={false} />
        </div>
        <div className="animus-card__footer">
          <SpeedIndicator speed={animus.baseSpeed} />
          {animus.isShadowPrintRequired && (
            <span className="shadow-print-badge">★ SP</span>
          )}
        </div>
        <div className="animus-card__role">{animus.primaryRole}</div>
      </div>
    </div>
  );
}
