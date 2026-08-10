// Static, public game data mirrored from the app's progression config.
// Kept separate from React hooks so the MCP bundle stays import-safe.

export const CHARACTERS = [
  { id: "boneclaw", name: "Boneclaw", nameRu: "Костевой", role: "starter", bonus: "none" },
  { id: "bonecub", name: "Bonecub", nameRu: "Костеныш", role: "companion", cost: 40, bonus: "+3 damage" },
  { id: "swiftwing", name: "Swiftwing", nameRu: "Быстрокрыл", role: "companion", cost: 50, bonus: "+1s before damage decay" },
  { id: "shieldspawn", name: "Shieldspawn", nameRu: "Щитоспор", role: "companion", cost: 60, bonus: "+25 max HP" },
  { id: "goldmite", name: "Goldmite", nameRu: "Златоклещ", role: "companion", cost: 80, bonus: "+30% coins per win" },
] as const;

export const ENEMIES = [
  { id: "shadow", name: "Shadowling", nameRu: "Теневик", fromLevel: 1 },
  { id: "gloom", name: "Gloomwalker", nameRu: "Мрачник", fromLevel: 3 },
  { id: "void", name: "Voidcrawler", nameRu: "Пустотник", fromLevel: 6 },
  { id: "absolute", name: "Absolute", nameRu: "Абсолют", fromLevel: 10 },
] as const;

export const SKINS = [
  { id: "default", name: "Default", cost: 0 },
  { id: "fire", name: "Fire", cost: 30 },
  { id: "ice", name: "Ice", cost: 30 },
  { id: "shadow", name: "Shadow", cost: 50 },
  { id: "golden", name: "Golden", cost: 80 },
] as const;

export const UPGRADES = [
  { key: "maxHp", name: "Health", effect: "+20 max HP per level", baseCost: 15, costScale: 10, maxLevel: 10 },
  { key: "bonusDmg", name: "Attack Power", effect: "+3 damage per level", baseCost: 20, costScale: 12, maxLevel: 10 },
  { key: "bonusTime", name: "Extra Time", effect: "+1s before damage decay", baseCost: 25, costScale: 15, maxLevel: 5 },
] as const;

export const SHOP_ITEMS = [
  { key: "healPotion", name: "Heal Potion", cost: 10, effect: "Restore 30 HP in battle" },
  { key: "shield", name: "Shield", cost: 15, effect: "Block next enemy attack" },
  { key: "doubleDmg", name: "Double Damage", cost: 20, effect: "×2 damage for 1 turn" },
  { key: "xpBoost", name: "XP Boost", cost: 12, effect: "+50% XP per battle" },
  { key: "coinBoost", name: "Coin Boost", cost: 12, effect: "+50% coins per battle" },
] as const;

export function enemyStatsForLevel(level: number) {
  const entry = [...ENEMIES].reverse().find((e) => level >= e.fromLevel) ?? ENEMIES[0];
  return {
    level,
    enemyName: entry.name,
    enemyNameRu: entry.nameRu,
    enemyHp: 60 + level * 15,
    enemyMinDamage: 4 + Math.floor(level / 3),
    enemyMaxDamage: Math.round(9 + level * 1.5),
    xpToNextLevel: 50 + level * 30,
  };
}

export type Operation = "multiply" | "add" | "subtract";

export function makeProblem(operation: Operation, level: number) {
  const span = Math.min(4 + level, 12);
  const rand = (max: number) => 1 + Math.floor(Math.random() * max);
  let a = rand(span);
  let b = rand(span);
  if (operation === "add") {
    a = rand(span * 3);
    b = rand(span * 3);
  }
  if (operation === "subtract") {
    a = rand(span * 3);
    b = rand(a);
  }
  const answer = operation === "multiply" ? a * b : operation === "add" ? a + b : a - b;
  const sign = operation === "multiply" ? "×" : operation === "add" ? "+" : "−";
  return { a, b, operation, expression: `${a} ${sign} ${b}`, answer };
}
