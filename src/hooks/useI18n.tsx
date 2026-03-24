import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type Lang = "ru" | "en" | "pt";

const translations = {
  // Main Menu
  "menu.level": { ru: "Ур.", en: "Lv.", pt: "Nv." },
  "menu.upgrades": { ru: "Улучшения", en: "Upgrades", pt: "Melhorias" },
  "menu.shop": { ru: "Магазин", en: "Shop", pt: "Loja" },
  "menu.skins": { ru: "Скины", en: "Skins", pt: "Skins" },
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

  // Shop items
  "shop.healPotion.label": { ru: "Зелье лечения", en: "Heal Potion", pt: "Poção de Cura" },
  "shop.healPotion.desc": { ru: "Восстановить 30 HP в бою", en: "Restore 30 HP in battle", pt: "Restaurar 30 HP na batalha" },
  "shop.shield.label": { ru: "Щит", en: "Shield", pt: "Escudo" },
  "shop.shield.desc": { ru: "Блокировать следующую атаку", en: "Block next enemy attack", pt: "Bloquear próximo ataque" },
  "shop.doubleDmg.label": { ru: "Двойной урон", en: "Double Damage", pt: "Dano Duplo" },
  "shop.doubleDmg.desc": { ru: "×2 урон на 1 ход", en: "×2 damage for 1 turn", pt: "×2 dano por 1 turno" },
  "shop.xpBoost.label": { ru: "Бустер XP", en: "XP Boost", pt: "Boost de XP" },
  "shop.xpBoost.desc": { ru: "+50% XP за бой", en: "+50% XP per battle", pt: "+50% XP por batalha" },
  "shop.coinBoost.label": { ru: "Бустер монет", en: "Coin Boost", pt: "Boost de Moedas" },
  "shop.coinBoost.desc": { ru: "+50% монет за бой", en: "+50% coins per battle", pt: "+50% moedas por batalha" },

  // Skins
  "skin.default": { ru: "Стандартный", en: "Default", pt: "Padrão" },
  "skin.fire": { ru: "Огненный", en: "Fire", pt: "Fogo" },
  "skin.ice": { ru: "Ледяной", en: "Ice", pt: "Gelo" },
  "skin.shadow": { ru: "Теневой", en: "Shadow", pt: "Sombra" },
  "skin.golden": { ru: "Золотой", en: "Golden", pt: "Dourado" },
  "skin.equipped": { ru: "Надето", en: "Equipped", pt: "Equipado" },
  "skin.equip": { ru: "Надеть", en: "Equip", pt: "Equipar" },

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

  // Battle log templates
  "battle.logCorrect": { ru: "✓ {a} × {b} = {ans} за {t}с → {dmg} урона!", en: "✓ {a} × {b} = {ans} in {t}s → {dmg} damage!", pt: "✓ {a} × {b} = {ans} em {t}s → {dmg} dano!" },
  "battle.logWrong": { ru: "✗ Неправильно! {a} × {b} = {ans}. Пропуск хода.", en: "✗ Wrong! {a} × {b} = {ans}. Turn skipped.", pt: "✗ Errado! {a} × {b} = {ans}. Turno perdido." },
  "battle.logEnemyAttack": { ru: "{name} атакует → {dmg} урона!", en: "{name} attacks → {dmg} damage!", pt: "{name} ataca → {dmg} dano!" },

  // Creature operations
  "creature.shadow": { ru: "Тень", en: "Shadow", pt: "Sombra" },
  "creature.multiplication": { ru: "Умножение", en: "Multiplication", pt: "Multiplicação" },

  // Time suffix
  "battle.timeSuffix": { ru: "с", en: "s", pt: "s" },
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

  const t = useCallback((key: TranslationKey, params?: Record<string, string | number>): string => {
    let result: string = translations[key]?.[lang] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        result = result.replace(`{${k}}`, String(v));
      });
    }
    return result;
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
