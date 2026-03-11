import { useState, useCallback } from "react";

export interface Upgrades {
  maxHp: number;       // bonus HP
  bonusDmg: number;    // bonus damage
  bonusTime: number;   // bonus seconds before decay
}

export interface PlayerProgress {
  level: number;
  xp: number;
  xpToNext: number;
  coins: number;
  totalCoins: number;
  upgrades: Upgrades;
}

const calcXpToNext = (level: number) => 50 + level * 30;

const initialProgress = (): PlayerProgress => ({
  level: 1,
  xp: 0,
  xpToNext: calcXpToNext(1),
  coins: 0,
  totalCoins: 0,
  upgrades: { maxHp: 0, bonusDmg: 0, bonusTime: 0 },
});

export const UPGRADE_DEFS = [
  {
    key: "maxHp" as const,
    label: "Здоровье",
    icon: "❤️",
    desc: "+20 макс. HP",
    baseCost: 15,
    costScale: 10,
    perLevel: 20,
    maxLevel: 10,
  },
  {
    key: "bonusDmg" as const,
    label: "Сила удара",
    icon: "⚔️",
    desc: "+3 к урону",
    baseCost: 20,
    costScale: 12,
    perLevel: 3,
    maxLevel: 10,
  },
  {
    key: "bonusTime" as const,
    label: "Доп. время",
    icon: "⏱",
    desc: "+1с до снижения урона",
    baseCost: 25,
    costScale: 15,
    perLevel: 1,
    maxLevel: 5,
  },
] as const;

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

  const getEnemyScale = useCallback((level: number) => {
    return {
      enemyHp: 80 + level * 20,
      enemyMinDmg: 5 + Math.floor(level / 2),
      enemyMaxDmg: 12 + level * 2,
      enemyName: level < 3 ? "Теневик" : level < 6 ? "Мрачник" : level < 10 ? "Пустотник" : "Абсолют",
    };
  }, []);

  return { progress, levelUp, addRewards, buyUpgrade, getEnemyScale };
};
