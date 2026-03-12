import { useState, useCallback, useRef } from "react";

export interface Creature {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
}

export interface MathProblem {
  a: number;
  b: number;
  answer: number;
}

export interface RoundReward {
  xp: number;
  coins: number;
}

export interface BattleState {
  playerCreature: Creature;
  enemyCreature: Creature;
  currentProblem: MathProblem | null;
  playerInput: string;
  isPlayerTurn: boolean;
  battleLog: string[];
  projectile: { value: number; target: "enemy" | "player" } | null;
  gameOver: boolean;
  winner: "player" | "enemy" | null;
  problemStartTime: number | null;
  feedback: { correct: boolean; damage: number } | null;
  round: number;
  pendingReward: RoundReward | null;
}

const generateProblem = (used: Set<string>): MathProblem => {
  const all: [number, number][] = [];
  for (let a = 1; a <= 10; a++) {
    for (let b = a; b <= 10; b++) {
      const key = `${a}x${b}`;
      if (!used.has(key)) all.push([a, b]);
    }
  }
  if (all.length === 0) used.clear();
  const pool = all.length > 0 ? all : [[1, 1] as [number, number]];
  const [x, y] = pool[Math.floor(Math.random() * pool.length)];
  const [a, b] = Math.random() < 0.5 ? [x, y] : [y, x];
  used.add(`${Math.min(a, b)}x${Math.max(a, b)}`);
  return { a, b, answer: a * b };
};

const calcDamage = (elapsedMs: number, correct: boolean, bonusDmg: number, bonusTime: number): number => {
  if (!correct) return 0;
  const seconds = Math.max(0, elapsedMs / 1000 - bonusTime);
  return Math.max(5, Math.round(25 + bonusDmg - seconds * 2.5));
};

interface EnemyConfig {
  enemyHp: number;
  enemyMinDmg: number;
  enemyMaxDmg: number;
  enemyName: string;
}

export const useBattleState = (enemyConfig: EnemyConfig, playerMaxHp: number = 100, playerLevel: number = 1) => {
  const timerRef = useRef<number | null>(null);
  const usedProblems = useRef<Set<string>>(new Set());

  const createInitialState = useCallback((): BattleState => {
    usedProblems.current.clear();
    const problem = generateProblem(usedProblems.current);
    return {
      playerCreature: { id: "player", name: "Умножитель", health: playerMaxHp, maxHealth: playerMaxHp },
      enemyCreature: { id: "enemy", name: enemyConfig.enemyName, health: enemyConfig.enemyHp, maxHealth: enemyConfig.enemyHp },
      currentProblem: problem,
      playerInput: "",
      isPlayerTurn: true,
      battleLog: ["Бой начинается! Решай примеры быстрее!"],
      projectile: null,
      gameOver: false,
      winner: null,
      problemStartTime: Date.now(),
      feedback: null,
      round: 1,
      pendingReward: null,
    };
  }, [enemyConfig, playerMaxHp]);

  const [state, setState] = useState<BattleState>(createInitialState);

  const setInput = useCallback((val: string) => {
    setState((prev) => {
      if (!prev.isPlayerTurn || prev.gameOver) return prev;
      if (val && !/^\d+$/.test(val)) return prev;
      return { ...prev, playerInput: val };
    });
  }, []);

  const submitAnswer = useCallback((bonusDmg: number = 0, bonusTime: number = 0) => {
    setState((prev) => {
      if (!prev.currentProblem || !prev.isPlayerTurn || prev.gameOver || !prev.playerInput) return prev;

      const elapsed = Date.now() - (prev.problemStartTime || Date.now());
      const playerAnswer = parseInt(prev.playerInput, 10);
      const correct = playerAnswer === prev.currentProblem.answer;
      const damage = calcDamage(elapsed, correct, bonusDmg, bonusTime);

      const newEnemyHealth = correct ? Math.max(0, prev.enemyCreature.health - damage) : prev.enemyCreature.health;
      const seconds = (elapsed / 1000).toFixed(1);

      const log = correct
        ? `✓ ${prev.currentProblem.a} × ${prev.currentProblem.b} = ${prev.currentProblem.answer} за ${seconds}с → ${damage} урона!`
        : `✗ Неправильно! ${prev.currentProblem.a} × ${prev.currentProblem.b} = ${prev.currentProblem.answer}. Пропуск хода.`;

      const gameOver = newEnemyHealth <= 0;

      const roundXp = correct ? Math.max(5, Math.round(15 - (elapsed / 1000))) : 0;

      return {
        ...prev,
        enemyCreature: { ...prev.enemyCreature, health: newEnemyHealth },
        playerInput: "",
        battleLog: [...prev.battleLog, log],
        projectile: correct ? { value: damage, target: "enemy" } : null,
        isPlayerTurn: false,
        feedback: { correct, damage },
        gameOver,
        winner: gameOver ? "player" : null,
        pendingReward: correct ? { xp: roundXp, coins: 0 } : null,
      };
    });

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      setState((prev) => {
        if (prev.gameOver) return { ...prev, projectile: null, feedback: null };

        const { enemyMinDmg, enemyMaxDmg } = enemyConfig;
        const enemyDamage = Math.floor(Math.random() * (enemyMaxDmg - enemyMinDmg + 1)) + enemyMinDmg;
        const newPlayerHealth = Math.max(0, prev.playerCreature.health - enemyDamage);
        const log = `${prev.enemyCreature.name} атакует → ${enemyDamage} урона!`;
        const gameOver = newPlayerHealth <= 0;
        const nextRound = prev.round + 1;
        const nextProblem = generateProblem(usedProblems.current);

        return {
          ...prev,
          playerCreature: { ...prev.playerCreature, health: newPlayerHealth },
          battleLog: [...prev.battleLog, log],
          projectile: { value: enemyDamage, target: "player" },
          isPlayerTurn: true,
          currentProblem: nextProblem,
          problemStartTime: Date.now() + 800,
          feedback: null,
          gameOver,
          winner: gameOver ? "enemy" : null,
          round: nextRound,
          pendingReward: null,
        };
      });

      setTimeout(() => {
        setState((prev) => ({ ...prev, projectile: null }));
      }, 800);
    }, 1000);

    setTimeout(() => {
      setState((prev) => ({ ...prev, projectile: null }));
    }, 700);
  }, [enemyConfig]);

  const resetBattle = useCallback(() => {
    setState(createInitialState());
  }, [createInitialState]);

  return { state, setInput, submitAnswer, resetBattle };
};
