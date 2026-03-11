import { motion } from "framer-motion";
import { Swords, Shield, Zap, Clock } from "lucide-react";
import { PlayerProgress, Upgrades, getUpgradeLevel, getUpgradeCost } from "@/hooks/usePlayerProgress";
import { useI18n, LANG_LABELS, Lang } from "@/hooks/useI18n";

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

const UPGRADE_KEYS = [
  { key: "maxHp" as const, icon: "maxHp" as const, labelKey: "upgrade.maxHp.label" as const, descKey: "upgrade.maxHp.desc" as const, maxLevel: 10, perLevel: 20 },
  { key: "bonusDmg" as const, icon: "bonusDmg" as const, labelKey: "upgrade.bonusDmg.label" as const, descKey: "upgrade.bonusDmg.desc" as const, maxLevel: 10, perLevel: 3 },
  { key: "bonusTime" as const, icon: "bonusTime" as const, labelKey: "upgrade.bonusTime.label" as const, descKey: "upgrade.bonusTime.desc" as const, maxLevel: 5, perLevel: 1 },
];

const MainMenu = ({ progress, onStartBattle, onBuyUpgrade }: MainMenuProps) => {
  const { t, lang, setLang } = useI18n();
  const langs: Lang[] = ["ru", "en", "pt"];

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-arena arena-grid">
      {/* Language switcher */}
      <div className="flex justify-end px-4 pt-3">
        <div className="flex gap-1 bg-card border border-border rounded-md p-1">
          {langs.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                lang === l
                  ? "bg-muted text-player-energy"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center pt-4 pb-4 gap-2">
        <motion.h1
          className="font-display text-4xl sm:text-5xl font-bold text-creature-bone tracking-wide"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Mathematic Battles
        </motion.h1>
        <div className="flex items-center gap-4 text-sm font-mono">
          <span className="text-accent">{t("menu.level")} {progress.level}</span>
          <span className="text-muted-foreground">
            {progress.xp}/{progress.xpToNext} XP
          </span>
          <span className="text-accent">🪙 {progress.coins}</span>
        </div>
      </div>

      {/* Upgrades */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4 min-h-0">
        <h2 className="font-display text-2xl font-bold text-foreground">{t("menu.upgrades")}</h2>
        <div className="grid gap-3 w-full max-w-md">
          {UPGRADE_KEYS.map((def) => {
            const Icon = ICONS[def.icon];
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
                    <span className="font-mono font-bold text-foreground">{t(def.labelKey)}</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {lvl}/{def.maxLevel}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{t(def.descKey)}</span>
                </div>
                <div className="text-right">
                  {maxed ? (
                    <span className="text-xs font-mono text-player-energy">{t("menu.maxed")}</span>
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
          <span>⚔️ +{progress.upgrades.bonusDmg} {t("menu.damage")}</span>
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
          {t("menu.fight")}
        </motion.button>
      </div>
    </div>
  );
};

export default MainMenu;
