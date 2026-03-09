import { PlayerProgress } from "@/hooks/usePlayerProgress";
import { motion } from "framer-motion";

interface PlayerHUDProps {
  progress: PlayerProgress;
  levelUp: boolean;
}

const PlayerHUD = ({ progress, levelUp }: PlayerHUDProps) => {
  const xpPercent = (progress.xp / progress.xpToNext) * 100;

  return (
    <div className="flex items-center justify-between px-4 pt-3 pb-1">
      {/* Level & XP */}
      <div className="flex items-center gap-3">
        <motion.span
          className="text-lg font-display font-bold text-accent"
          animate={levelUp ? { scale: [1, 1.3, 1] } : {}}
        >
          Ур. {progress.level}
        </motion.span>
        <div className="flex flex-col gap-0.5">
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              style={{ width: `${xpPercent}%` }}
              layout
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">
            {progress.xp}/{progress.xpToNext} XP
          </span>
        </div>
      </div>

      {/* Title */}
      <h1 className="font-display text-xl sm:text-2xl font-bold text-creature-bone tracking-wide">
        Mathematic Battles
      </h1>

      {/* Coins */}
      <span className="text-sm font-mono text-accent">
        🪙 {progress.coins}
      </span>
    </div>
  );
};

export default PlayerHUD;
