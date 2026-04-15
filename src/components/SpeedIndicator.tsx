import { getSpeedTier, rollsToNextTier } from '@/data/constants';

interface Props {
  speed: number;
  showGap?: boolean;
}

export function SpeedIndicator({ speed, showGap = false }: Props) {
  const tier = getSpeedTier(speed);
  const gap  = showGap ? rollsToNextTier(speed) : null;

  return (
    <span className={`speed-indicator ${tier.cssClass}`}>
      <span className="speed-indicator__value">{speed}</span>
      <span className="speed-indicator__tier">SPD · {tier.label}</span>
      {gap && (
        <span className="speed-indicator__gap">+{gap.rolls} rolls → {gap.target}</span>
      )}
    </span>
  );
}
