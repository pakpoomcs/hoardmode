import type { Affinity } from '@/types';

interface Props {
  affinity: Affinity;
  showIcon?: boolean;
}

export function AffinityBadge({ affinity, showIcon = true }: Props) {
  return (
    <span className={`affinity-badge affinity-badge--${affinity}`}>
      {showIcon && (
        <img
          src={`/assets/affinities/${affinity.toUpperCase()}.webp`}
          alt={affinity}
          className="affinity-badge__icon"
        />
      )}
      {affinity}
    </span>
  );
}
