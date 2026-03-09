import { useState, useCallback } from "react";

export interface PlayerProgress {
  level: number;
  xp: number;
  xpToNext: number;
  coins: number;
  totalCoins: number;
}

const calcXpToNext = (level: number) => 50 + level * 30;

const initialProgress = (): PlayerProgress => ({
  level: 1,
  xp: 0,
  xpToNext: calcXpToNext(1),
  coins: 0,
  totalCoins: 0,
});

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

      return { level, xp, xpToNext, coins, totalCoins };
    });
  }, []);

  const getEnemyScale = useCallback((level: number) => {
    // Enemy HP and damage scale with player level
    return {
      enemyHp: 80 + level * 20,
      enemyMinDmg: 5 + Math.floor(level / 2),
      enemyMaxDmg: 12 + level * 2,
      enemyName: level < 3 ? "Теневик" : level < 6 ? "Мрачник" : level < 10 ? "Пустотник" : "Абсолют",
    };
  }, []);

  return { progress, levelUp, addRewards, getEnemyScale };
};
