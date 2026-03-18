import { useState, useCallback } from "react";
import { useI18n } from "@/hooks/useI18n";

export interface Upgrades {
  maxHp: number;
  bonusDmg: number;
  bonusTime: number;
}

export interface Inventory {
  healPotion: number;
  shield: number;
  doubleDmg: number;
  xpBoost: number;
  coinBoost: number;
}

export type SkinId = "default" | "fire" | "ice" | "shadow" | "golden";

export interface PlayerProgress {
  level: number;
  xp: number;
  xpToNext: number;
  coins: number;
  totalCoins: number;
  upgrades: Upgrades;
  inventory: Inventory;
  ownedSkins: SkinId[];
  activeSkin: SkinId;
}

const calcXpToNext = (level: number) => 50 + level * 30;

const initialProgress = (): PlayerProgress => ({
  level: 1,
  xp: 0,
  xpToNext: calcXpToNext(1),
  coins: 0,
  totalCoins: 0,
  upgrades: { maxHp: 0, bonusDmg: 0, bonusTime: 0 },
  inventory: { healPotion: 0, shield: 0, doubleDmg: 0, xpBoost: 0, coinBoost: 0 },
  ownedSkins: ["default"],
  activeSkin: "default",
});

export const UPGRADE_DEFS = [
  { key: "maxHp" as const, baseCost: 15, costScale: 10, perLevel: 20, maxLevel: 10 },
  { key: "bonusDmg" as const, baseCost: 20, costScale: 12, perLevel: 3, maxLevel: 10 },
  { key: "bonusTime" as const, baseCost: 25, costScale: 15, perLevel: 1, maxLevel: 5 },
] as const;

export interface ShopItemDef {
  key: keyof Inventory;
  cost: number;
}

export const SHOP_ITEMS: ShopItemDef[] = [
  { key: "healPotion", cost: 10 },
  { key: "shield", cost: 15 },
  { key: "doubleDmg", cost: 20 },
  { key: "xpBoost", cost: 12 },
  { key: "coinBoost", cost: 12 },
];

export interface SkinDef {
  id: SkinId;
  cost: number;
  hue: string; // CSS filter hue-rotate value
}

export const SKIN_DEFS: SkinDef[] = [
  { id: "default", cost: 0, hue: "0deg" },
  { id: "fire", cost: 30, hue: "330deg" },
  { id: "ice", cost: 30, hue: "180deg" },
  { id: "shadow", cost: 50, hue: "260deg" },
  { id: "golden", cost: 80, hue: "40deg" },
];

export const getUpgradeLevel = (upgrades: Upgrades, key: keyof Upgrades): number => {
  const def = UPGRADE_DEFS.find((d) => d.key === key)!;
  return upgrades[key] / def.perLevel;
};

export const getUpgradeCost = (upgrades: Upgrades, key: keyof Upgrades): number => {
  const def = UPGRADE_DEFS.find((d) => d.key === key)!;
  const lvl = getUpgradeLevel(upgrades, key);
  return def.baseCost + lvl * def.costScale;
};

export const usePlayerProgress = () => {
  const [progress, setProgress] = useState<PlayerProgress>(initialProgress);
  const [levelUp, setLevelUp] = useState(false);
  const { t } = useI18n();

  const addRewards = useCallback((xpGain: number, coinGain: number) => {
    setProgress((prev) => {
      let { level, xp, xpToNext, coins, totalCoins } = prev;
      xp += xpGain;
      coins += coinGain;
      totalCoins += coinGain;
      let didLevel = false;

      while (xp >= xpToNext) {
        xp -= xpToNext;
        level += 1;
        xpToNext = calcXpToNext(level);
        didLevel = true;
      }

      if (didLevel) {
        setTimeout(() => setLevelUp(false), 2000);
        setLevelUp(true);
      }

      return { ...prev, level, xp, xpToNext, coins, totalCoins };
    });
  }, []);

  const buyUpgrade = useCallback((key: keyof Upgrades) => {
    setProgress((prev) => {
      const def = UPGRADE_DEFS.find((d) => d.key === key)!;
      const lvl = getUpgradeLevel(prev.upgrades, key);
      if (lvl >= def.maxLevel) return prev;
      const cost = getUpgradeCost(prev.upgrades, key);
      if (prev.coins < cost) return prev;
      return {
        ...prev,
        coins: prev.coins - cost,
        upgrades: { ...prev.upgrades, [key]: prev.upgrades[key] + def.perLevel },
      };
    });
  }, []);

  const buyShopItem = useCallback((key: keyof Inventory) => {
    setProgress((prev) => {
      const def = SHOP_ITEMS.find((d) => d.key === key)!;
      if (prev.coins < def.cost) return prev;
      return {
        ...prev,
        coins: prev.coins - def.cost,
        inventory: { ...prev.inventory, [key]: prev.inventory[key] + 1 },
      };
    });
  }, []);

  const buySkin = useCallback((id: SkinId) => {
    setProgress((prev) => {
      if (prev.ownedSkins.includes(id)) return prev;
      const def = SKIN_DEFS.find((d) => d.id === id)!;
      if (prev.coins < def.cost) return prev;
      return {
        ...prev,
        coins: prev.coins - def.cost,
        ownedSkins: [...prev.ownedSkins, id],
      };
    });
  }, []);

  const equipSkin = useCallback((id: SkinId) => {
    setProgress((prev) => {
      if (!prev.ownedSkins.includes(id)) return prev;
      return { ...prev, activeSkin: id };
    });
  }, []);

  const getEnemyScale = useCallback((level: number) => {
    const nameKey = level < 3 ? "enemy.shadow" : level < 6 ? "enemy.gloom" : level < 10 ? "enemy.void" : "enemy.absolute";
    return {
      enemyHp: 60 + level * 15,
      enemyMinDmg: 4 + Math.floor(level / 3),
      enemyMaxDmg: 9 + level * 1.5,
      enemyName: t(nameKey as any),
    };
  }, [t]);

  return { progress, levelUp, addRewards, buyUpgrade, buyShopItem, buySkin, equipSkin, getEnemyScale };
};
