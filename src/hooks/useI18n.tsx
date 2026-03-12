import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type Lang = "ru" | "en" | "pt";

const translations = {
  // Main Menu
  "menu.level": { ru: "Ур.", en: "Lv.", pt: "Nv." },
  "menu.upgrades": { ru: "Улучшения", en: "Upgrades", pt: "Melhorias" },
  "menu.fight": { ru: "В бой!", en: "Fight!", pt: "Lutar!" },
  "menu.maxed": { ru: "МАКС", en: "MAX", pt: "MÁX" },
  "menu.damage": { ru: "урон", en: "damage", pt: "dano" },

  // Upgrades
  "upgrade.maxHp.label": { ru: "Здоровье", en: "Health", pt: "Vida" },
  "upgrade.maxHp.desc": { ru: "+20 макс. HP", en: "+20 max HP", pt: "+20 HP máx" },
  "upgrade.bonusDmg.label": { ru: "Сила удара", en: "Attack Power", pt: "Força de Ataque" },
  "upgrade.bonusDmg.desc": { ru: "+3 к урону", en: "+3 damage", pt: "+3 dano" },
  "upgrade.bonusTime.label": { ru: "Доп. время", en: "Extra Time", pt: "Tempo Extra" },
  "upgrade.bonusTime.desc": { ru: "+1с до снижения урона", en: "+1s before damage decay", pt: "+1s antes da redução" },

  // Battle
  "battle.start": { ru: "Бой начинается! Решай примеры быстрее!", en: "Battle begins! Solve problems fast!", pt: "A batalha começa! Resolva rápido!" },
  "battle.solve": { ru: "Решай!", en: "Solve!", pt: "Resolva!" },
  "battle.enemyTurn": { ru: "Атака врага...", en: "Enemy attacks...", pt: "Ataque inimigo..." },
  "battle.correct": { ru: "Верно!", en: "Correct!", pt: "Correto!" },
  "battle.miss": { ru: "Мимо!", en: "Miss!", pt: "Errou!" },
  "battle.victory": { ru: "Победа!", en: "Victory!", pt: "Vitória!" },
  "battle.defeat": { ru: "Поражение!", en: "Defeat!", pt: "Derrota!" },
  "battle.victoryBonus": { ru: "Бонус победы:", en: "Victory bonus:", pt: "Bônus de vitória:" },
  "battle.menu": { ru: "Меню", en: "Menu", pt: "Menu" },
  "battle.again": { ru: "Ещё бой", en: "Fight again", pt: "Lutar de novo" },
  "battle.damage": { ru: "Урон:", en: "Damage:", pt: "Dano:" },
  "battle.attacks": { ru: "атакует →", en: "attacks →", pt: "ataca →" },
  "battle.damageUnit": { ru: "урона!", en: "damage!", pt: "dano!" },
  "battle.in": { ru: "за", en: "in", pt: "em" },
  "battle.wrong": { ru: "Неправильно!", en: "Wrong!", pt: "Errado!" },
  "battle.skipTurn": { ru: "Пропуск хода.", en: "Turn skipped.", pt: "Turno perdido." },
  "battle.reviewMistakes": { ru: "Работа над ошибками", en: "Review mistakes", pt: "Revisão de erros" },

  // Enemies
  "enemy.shadow": { ru: "Теневик", en: "Shadowling", pt: "Sombrio" },
  "enemy.gloom": { ru: "Мрачник", en: "Gloomwalker", pt: "Obscuro" },
  "enemy.void": { ru: "Пустотник", en: "Voidcrawler", pt: "Vaziano" },
  "enemy.absolute": { ru: "Абсолют", en: "Absolute", pt: "Absoluto" },

  // Player
  "player.name": { ru: "Умножитель", en: "Multiplier", pt: "Multiplicador" },

  // HUD
  "hud.level": { ru: "Уровень", en: "Level", pt: "Nível" },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("ru");

  const t = useCallback((key: TranslationKey): string => {
    return translations[key]?.[lang] ?? key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};

export const LANG_LABELS: Record<Lang, string> = {
  ru: "🇷🇺 RU",
  en: "🇬🇧 EN",
  pt: "🇧🇷 PT",
};
