import { PlayerProgress } from "@/hooks/usePlayerProgress";
import { useI18n } from "@/hooks/useI18n";
import { motion } from "framer-motion";

interface PlayerHUDProps {
  progress: PlayerProgress;
  levelUp: boolean;
}

const PlayerHUD = ({ progress, levelUp }: PlayerHUDProps) => {
  const { t } = useI18n();
  const xpPercent = (progress.xp / progress.xpToNext) * 100;

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-border/40 shrink-0">
      <div className="flex items-center gap-2">
        <motion.span
          className="text-sm font-display font-bold text-accent"
          animate={levelUp ? { scale: [1, 1.3, 1] } : {}}
        >
          {t("menu.level")} {progress.level}
        </motion.span>
        <div className="flex flex-col gap-0.5">
          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              style={{ width: `${xpPercent}%` }}
              layout
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground leading-none">
            {progress.xp}/{progress.xpToNext} XP
          </span>
        </div>
      </div>

      <h1 className="font-display text-sm sm:text-base font-bold text-creature-bone tracking-wide truncate">
        Mathematic Battles
      </h1>

      <span className="text-sm font-mono text-accent shrink-0">
        🪙 {progress.coins}
      </span>
    </div>
  );
};

export default PlayerHUD;
