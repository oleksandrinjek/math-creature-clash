import { motion } from "framer-motion";
import { Swords, Shield, Zap, Clock, ShoppingBag, Palette } from "lucide-react";
import { PlayerProgress, Upgrades, Inventory, SkinId, getUpgradeLevel, getUpgradeCost, SHOP_ITEMS, SKIN_DEFS } from "@/hooks/usePlayerProgress";
import { useI18n, LANG_LABELS, Lang } from "@/hooks/useI18n";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface MainMenuProps {
  progress: PlayerProgress;
  onStartBattle: () => void;
  onBuyUpgrade: (key: keyof Upgrades) => void;
  onBuyShopItem: (key: keyof Inventory) => void;
  onBuySkin: (id: SkinId) => void;
  onEquipSkin: (id: SkinId) => void;
}

const UPGRADE_ICONS = { maxHp: Shield, bonusDmg: Zap, bonusTime: Clock };

const UPGRADE_KEYS = [
  { key: "maxHp" as const, icon: "maxHp" as const, labelKey: "upgrade.maxHp.label" as const, descKey: "upgrade.maxHp.desc" as const, maxLevel: 10, perLevel: 20 },
  { key: "bonusDmg" as const, icon: "bonusDmg" as const, labelKey: "upgrade.bonusDmg.label" as const, descKey: "upgrade.bonusDmg.desc" as const, maxLevel: 10, perLevel: 3 },
  { key: "bonusTime" as const, icon: "bonusTime" as const, labelKey: "upgrade.bonusTime.label" as const, descKey: "upgrade.bonusTime.desc" as const, maxLevel: 5, perLevel: 1 },
];

const SHOP_ICONS: Record<keyof Inventory, string> = {
  healPotion: "❤️‍🩹",
  shield: "🛡️",
  doubleDmg: "⚔️",
  xpBoost: "✨",
  coinBoost: "💰",
};

const SKIN_COLORS: Record<SkinId, string> = {
  default: "bg-player-energy/20 border-player-energy",
  fire: "bg-destructive/20 border-destructive",
  ice: "bg-primary/20 border-primary",
  shadow: "bg-secondary/20 border-secondary",
  golden: "bg-accent/20 border-accent",
};

const MainMenu = ({ progress, onStartBattle, onBuyUpgrade, onBuyShopItem, onBuySkin, onEquipSkin }: MainMenuProps) => {
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
                lang === l ? "bg-muted text-player-energy" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center pt-4 pb-2 gap-2">
        <motion.h1
          className="font-display text-4xl sm:text-5xl font-bold text-creature-bone tracking-wide"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Mathematic Battles
        </motion.h1>
        <div className="flex items-center gap-4 text-sm font-mono">
          <span className="text-accent">{t("menu.level")} {progress.level}</span>
          <span className="text-muted-foreground">{progress.xp}/{progress.xpToNext} XP</span>
          <span className="text-accent">🪙 {progress.coins}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 flex flex-col items-center px-4 min-h-0 overflow-hidden">
        <Tabs defaultValue="upgrades" className="w-full max-w-md flex flex-col flex-1 min-h-0">
          <TabsList className="w-full grid grid-cols-3 bg-card border border-border">
            <TabsTrigger value="upgrades" className="font-mono text-xs data-[state=active]:text-player-energy">
              <Zap size={14} className="mr-1" />
              {t("menu.upgrades")}
            </TabsTrigger>
            <TabsTrigger value="shop" className="font-mono text-xs data-[state=active]:text-player-energy">
              <ShoppingBag size={14} className="mr-1" />
              {t("menu.shop")}
            </TabsTrigger>
            <TabsTrigger value="skins" className="font-mono text-xs data-[state=active]:text-player-energy">
              <Palette size={14} className="mr-1" />
              {t("menu.skins")}
            </TabsTrigger>
          </TabsList>

          {/* Upgrades tab */}
          <TabsContent value="upgrades" className="flex-1 overflow-y-auto min-h-0 mt-3">
            <div className="grid gap-3">
              {UPGRADE_KEYS.map((def) => {
                const Icon = UPGRADE_ICONS[def.icon];
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
                        <span className="text-xs font-mono text-muted-foreground">{lvl}/{def.maxLevel}</span>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">{t(def.descKey)}</span>
                    </div>
                    <div className="text-right">
                      {maxed ? (
                        <span className="text-xs font-mono text-player-energy">{t("menu.maxed")}</span>
                      ) : (
                        <span className={`text-sm font-mono font-bold ${canAfford ? "text-accent" : "text-muted-foreground"}`}>🪙 {cost}</span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
            <div className="flex gap-6 text-xs font-mono text-muted-foreground mt-3 justify-center">
              <span>❤️ {100 + progress.upgrades.maxHp} HP</span>
              <span>⚔️ +{progress.upgrades.bonusDmg} {t("menu.damage")}</span>
              <span>⏱ +{progress.upgrades.bonusTime}{t("battle.timeSuffix")}</span>
            </div>
          </TabsContent>

          {/* Shop tab */}
          <TabsContent value="shop" className="flex-1 overflow-y-auto min-h-0 mt-3">
            <div className="grid gap-3">
              {SHOP_ITEMS.map((item) => {
                const canAfford = progress.coins >= item.cost;
                const count = progress.inventory[item.key];
                return (
                  <motion.button
                    key={item.key}
                    onClick={() => onBuyShopItem(item.key)}
                    disabled={!canAfford}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    whileHover={canAfford ? { scale: 1.02 } : {}}
                    whileTap={canAfford ? { scale: 0.98 } : {}}
                  >
                    <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-2xl">
                      {SHOP_ICONS[item.key]}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground">{t(`shop.${item.key}.label` as any)}</span>
                        {count > 0 && (
                          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted text-player-energy">×{count}</span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">{t(`shop.${item.key}.desc` as any)}</span>
                    </div>
                    <span className={`text-sm font-mono font-bold ${canAfford ? "text-accent" : "text-muted-foreground"}`}>🪙 {item.cost}</span>
                  </motion.button>
                );
              })}
            </div>
          </TabsContent>

          {/* Skins tab */}
          <TabsContent value="skins" className="flex-1 overflow-y-auto min-h-0 mt-3">
            <div className="grid gap-3">
              {SKIN_DEFS.map((skin) => {
                const owned = progress.ownedSkins.includes(skin.id);
                const active = progress.activeSkin === skin.id;
                const canAfford = progress.coins >= skin.cost;
                const colorClass = SKIN_COLORS[skin.id];

                return (
                  <motion.button
                    key={skin.id}
                    onClick={() => owned ? onEquipSkin(skin.id) : onBuySkin(skin.id)}
                    disabled={active || (!owned && !canAfford)}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors disabled:cursor-not-allowed ${
                      active
                        ? `${colorClass} border-2`
                        : "border-border bg-card hover:bg-muted disabled:opacity-40"
                    }`}
                    whileHover={!active ? { scale: 1.02 } : {}}
                    whileTap={!active ? { scale: 0.98 } : {}}
                  >
                    <div className={`w-10 h-10 rounded-full border-2 ${colorClass} flex items-center justify-center`}>
                      <img
                        src="/src/assets/creature-player.png"
                        alt={skin.id}
                        className="w-7 h-7 object-contain"
                        style={{ filter: `hue-rotate(${skin.hue})` }}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-mono font-bold text-foreground">{t(`skin.${skin.id}` as any)}</span>
                    </div>
                    <div className="text-right">
                      {active ? (
                        <span className="text-xs font-mono text-player-energy">{t("skin.equipped")}</span>
                      ) : owned ? (
                        <span className="text-xs font-mono text-muted-foreground">{t("skin.equip")}</span>
                      ) : (
                        <span className={`text-sm font-mono font-bold ${canAfford ? "text-accent" : "text-muted-foreground"}`}>🪙 {skin.cost}</span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Battle button */}
      <div className="flex justify-center py-6">
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
