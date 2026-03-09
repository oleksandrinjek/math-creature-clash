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
}

const generateProblem = (round: number): MathProblem => {
  const maxNum = Math.min(4 + Math.floor(round / 3), 12);
  const a = Math.floor(Math.random() * maxNum) + 2;
  const b = Math.floor(Math.random() * maxNum) + 2;
  return { a, b, answer: a * b };
};

const calcDamage = (elapsedMs: number, correct: boolean): number => {
  if (!correct) return 0;
  // Max damage 25 at instant, min 5 after 10s
  const seconds = elapsedMs / 1000;
  return Math.max(5, Math.round(25 - seconds * 2.5));
};

export const useBattleState = () => {
  const timerRef = useRef<number | null>(null);

  const [state, setState] = useState<BattleState>(() => {
    const problem = generateProblem(1);
    return {
      playerCreature: { id: "player", name: "Умножитель", health: 100, maxHealth: 100 },
      enemyCreature: { id: "enemy", name: "Теневик", health: 100, maxHealth: 100 },
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
    };
  });

  const setInput = useCallback((val: string) => {
    setState((prev) => {
      if (!prev.isPlayerTurn || prev.gameOver) return prev;
      // Only allow digits
      if (val && !/^\d+$/.test(val)) return prev;
      return { ...prev, playerInput: val };
    });
  }, []);

  const submitAnswer = useCallback(() => {
    setState((prev) => {
      if (!prev.currentProblem || !prev.isPlayerTurn || prev.gameOver || !prev.playerInput) return prev;

      const elapsed = Date.now() - (prev.problemStartTime || Date.now());
      const playerAnswer = parseInt(prev.playerInput, 10);
      const correct = playerAnswer === prev.currentProblem.answer;
      const damage = calcDamage(elapsed, correct);

      const newEnemyHealth = correct ? Math.max(0, prev.enemyCreature.health - damage) : prev.enemyCreature.health;
      const seconds = (elapsed / 1000).toFixed(1);

      const log = correct
        ? `✓ ${prev.currentProblem.a} × ${prev.currentProblem.b} = ${prev.currentProblem.answer} за ${seconds}с → ${damage} урона!`
        : `✗ Неправильно! ${prev.currentProblem.a} × ${prev.currentProblem.b} = ${prev.currentProblem.answer}. Пропуск хода.`;

      const gameOver = newEnemyHealth <= 0;

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
      };
    });

    // Clear projectile & enemy attacks after delay
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      setState((prev) => {
        if (prev.gameOver) return { ...prev, projectile: null, feedback: null };

        // Enemy turn - random damage 5-15
        const enemyDamage = Math.floor(Math.random() * 11) + 5;
        const newPlayerHealth = Math.max(0, prev.playerCreature.health - enemyDamage);
        const log = `Теневик атакует → ${enemyDamage} урона!`;
        const gameOver = newPlayerHealth <= 0;
        const nextRound = prev.round + 1;
        const nextProblem = generateProblem(nextRound);

        return {
          ...prev,
          playerCreature: { ...prev.playerCreature, health: newPlayerHealth },
          battleLog: [...prev.battleLog, log],
          projectile: { value: enemyDamage, target: "player" },
          isPlayerTurn: true,
          currentProblem: nextProblem,
          problemStartTime: Date.now() + 800, // account for animation
          feedback: null,
          gameOver,
          winner: gameOver ? "enemy" : null,
          round: nextRound,
        };
      });

      // Clear enemy projectile
      setTimeout(() => {
        setState((prev) => ({ ...prev, projectile: null }));
      }, 800);
    }, 1000);

    // Clear player projectile
    setTimeout(() => {
      setState((prev) => ({ ...prev, projectile: null }));
    }, 700);
  }, []);

  const resetBattle = useCallback(() => {
    const problem = generateProblem(1);
    setState({
      playerCreature: { id: "player", name: "Умножитель", health: 100, maxHealth: 100 },
      enemyCreature: { id: "enemy", name: "Теневик", health: 100, maxHealth: 100 },
      currentProblem: problem,
      playerInput: "",
      isPlayerTurn: true,
      battleLog: ["Новый бой! Решай примеры быстрее!"],
      projectile: null,
      gameOver: false,
      winner: null,
      problemStartTime: Date.now(),
      feedback: null,
      round: 1,
    });
  }, []);

  return { state, setInput, submitAnswer, resetBattle };
};
