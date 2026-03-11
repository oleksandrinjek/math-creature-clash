import { motion } from "framer-motion";
import { Swords, Shield, Zap, Clock } from "lucide-react";
import { PlayerProgress, Upgrades, UPGRADE_DEFS, getUpgradeLevel, getUpgradeCost } from "@/hooks/usePlayerProgress";

interface MainMenuProps {
  progress: PlayerProgress;
  onStartBattle: () => void;
  onBuyUpgrade: (key: keyof Upgrades) => void;
}

const ICONS = {
  maxHp: Shield,
  bonusDmg: Zap,
  bonusTime: Clock,
};

const MainMenu = ({ progress, onStartBattle, onBuyUpgrade }: MainMenuProps) => {
  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-arena arena-grid">
      {/* Header */}
      <div className="flex flex-col items-center pt-10 pb-4 gap-2">
        <motion.h1
          className="font-display text-4xl sm:text-5xl font-bold text-creature-bone tracking-wide"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Mathematic Battles
        </motion.h1>
        <div className="flex items-center gap-4 text-sm font-mono">
          <span className="text-accent">Ур. {progress.level}</span>
          <span className="text-muted-foreground">
            {progress.xp}/{progress.xpToNext} XP
          </span>
          <span className="text-accent">🪙 {progress.coins}</span>
        </div>
      </div>

      {/* Upgrades */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4 min-h-0">
        <h2 className="font-display text-2xl font-bold text-foreground">Улучшения</h2>
        <div className="grid gap-3 w-full max-w-md">
          {UPGRADE_DEFS.map((def) => {
            const Icon = ICONS[def.key];
            const lvl = getUpgradeLevel(progress.upgrades, def.key);
            const cost = getUpgradeCost(progress.upgrades, def.key);
            const maxed = lvl >= def.maxLevel;
            const canAfford = progress.coins >= cost;

            return (
              <motion.button
                key={def.key}
                onClick={() => onBuyUpgrade(def.key)}
                disabled={maxed || !canAfford}
                className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                whileHover={!maxed && canAfford ? { scale: 1.02 } : {}}
                whileTap={!maxed && canAfford ? { scale: 0.98 } : {}}
              >
                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-player-energy">
                  <Icon size={22} />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground">{def.label}</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {lvl}/{def.maxLevel}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{def.desc}</span>
                </div>
                <div className="text-right">
                  {maxed ? (
                    <span className="text-xs font-mono text-player-energy">МАКС</span>
                  ) : (
                    <span className={`text-sm font-mono font-bold ${canAfford ? "text-accent" : "text-muted-foreground"}`}>
                      🪙 {cost}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Stats summary */}
        <div className="flex gap-6 text-xs font-mono text-muted-foreground mt-2">
          <span>❤️ {100 + progress.upgrades.maxHp} HP</span>
          <span>⚔️ +{progress.upgrades.bonusDmg} урон</span>
          <span>⏱ +{progress.upgrades.bonusTime}с</span>
        </div>
      </div>

      {/* Battle button */}
      <div className="flex justify-center pb-10">
        <motion.button
          onClick={onStartBattle}
          className="flex items-center gap-3 px-8 py-4 rounded-lg bg-muted border-2 border-player-energy text-player-energy font-mono font-bold text-lg transition-colors hover:bg-card"
          whileHover={{ boxShadow: "0 0 30px hsl(180 100% 50% / 0.5)" }}
          whileTap={{ scale: 0.95 }}
        >
          <Swords size={24} />
          В бой!
        </motion.button>
      </div>
    </div>
  );
};

export default MainMenu;
