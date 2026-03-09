import { useState, useCallback } from "react";

export type MathOperation = "add" | "subtract" | "multiply" | "divide";

export interface Creature {
  id: string;
  name: string;
  operation: MathOperation;
  health: number;
  maxHealth: number;
  image: string;
}

export interface BattleState {
  playerCreature: Creature;
  enemyCreature: Creature;
  availableNumbers: number[];
  slot1: number | null;
  slot2: number | null;
  isPlayerTurn: boolean;
  battleLog: string[];
  projectile: { value: number; target: "enemy" | "player" } | null;
  gameOver: boolean;
  winner: "player" | "enemy" | null;
}

const generateNumbers = (): number[] => {
  const nums: number[] = [];
  for (let i = 0; i < 6; i++) {
    nums.push(Math.floor(Math.random() * 9) + 1);
  }
  return nums;
};

const calcResult = (a: number, b: number, op: MathOperation): number => {
  switch (op) {
    case "add": return a + b;
    case "subtract": return Math.abs(a - b);
    case "multiply": return a * b;
    case "divide": return b !== 0 ? Math.round((a / b) * 100) / 100 : 0;
  }
};

const opSymbol = (op: MathOperation): string => {
  switch (op) {
    case "add": return "+";
    case "subtract": return "−";
    case "multiply": return "×";
    case "divide": return "÷";
  }
};

const opName = (op: MathOperation): string => {
  switch (op) {
    case "add": return "Суммонер";
    case "subtract": return "Вычитатель";
    case "multiply": return "Умножитель";
    case "divide": return "Делитель";
  }
};

export const useBattleState = () => {
  const [state, setState] = useState<BattleState>({
    playerCreature: {
      id: "player",
      name: "Умножитель",
      operation: "multiply",
      health: 100,
      maxHealth: 100,
      image: "player",
    },
    enemyCreature: {
      id: "enemy",
      name: "Вычитатель",
      operation: "subtract",
      health: 100,
      maxHealth: 100,
      image: "enemy",
    },
    availableNumbers: generateNumbers(),
    slot1: null,
    slot2: null,
    isPlayerTurn: true,
    battleLog: ["Бой начинается!"],
    projectile: null,
    gameOver: false,
    winner: null,
  });

  const placeNumber = useCallback((num: number, index: number) => {
    setState((prev) => {
      if (!prev.isPlayerTurn || prev.gameOver) return prev;
      
      if (prev.slot1 === null) {
        const newNums = [...prev.availableNumbers];
        newNums.splice(index, 1);
        return { ...prev, slot1: num, availableNumbers: newNums };
      } else if (prev.slot2 === null) {
        const newNums = [...prev.availableNumbers];
        newNums.splice(index, 1);
        return { ...prev, slot2: num, availableNumbers: newNums };
      }
      return prev;
    });
  }, []);

  const clearSlots = useCallback(() => {
    setState((prev) => {
      const restored = [...prev.availableNumbers];
      if (prev.slot1 !== null) restored.push(prev.slot1);
      if (prev.slot2 !== null) restored.push(prev.slot2);
      return { ...prev, slot1: null, slot2: null, availableNumbers: restored };
    });
  }, []);

  const fireAttack = useCallback(() => {
    setState((prev) => {
      if (prev.slot1 === null || prev.slot2 === null || !prev.isPlayerTurn || prev.gameOver) return prev;

      const result = calcResult(prev.slot1, prev.slot2, prev.playerCreature.operation);
      const damage = Math.max(1, Math.round(result));
      const newEnemyHealth = Math.max(0, prev.enemyCreature.health - damage);
      const sym = opSymbol(prev.playerCreature.operation);
      const log = `${prev.playerCreature.name}: ${prev.slot1} ${sym} ${prev.slot2} = ${result} → ${damage} урона!`;

      const gameOver = newEnemyHealth <= 0;

      return {
        ...prev,
        slot1: null,
        slot2: null,
        enemyCreature: { ...prev.enemyCreature, health: newEnemyHealth },
        battleLog: [...prev.battleLog, log],
        projectile: { value: damage, target: "enemy" },
        isPlayerTurn: false,
        gameOver,
        winner: gameOver ? "player" : null,
      };
    });

    // Enemy turn after delay
    setTimeout(() => {
      setState((prev) => {
        if (prev.gameOver) return { ...prev, projectile: null };

        // Enemy picks two random numbers
        const a = Math.floor(Math.random() * 8) + 1;
        const b = Math.floor(Math.random() * 8) + 1;
        const result = calcResult(a, b, prev.enemyCreature.operation);
        const damage = Math.max(1, Math.round(result));
        const newPlayerHealth = Math.max(0, prev.playerCreature.health - damage);
        const sym = opSymbol(prev.enemyCreature.operation);
        const log = `${prev.enemyCreature.name}: ${a} ${sym} ${b} = ${result} → ${damage} урона!`;
        const gameOver = newPlayerHealth <= 0;

        return {
          ...prev,
          playerCreature: { ...prev.playerCreature, health: newPlayerHealth },
          battleLog: [...prev.battleLog, log],
          projectile: { value: damage, target: "player" },
          isPlayerTurn: true,
          availableNumbers: generateNumbers(),
          gameOver,
          winner: gameOver ? "enemy" : null,
        };
      });

      // Clear projectile
      setTimeout(() => {
        setState((prev) => ({ ...prev, projectile: null }));
      }, 800);
    }, 1200);

    // Clear player projectile
    setTimeout(() => {
      setState((prev) => ({ ...prev, projectile: null }));
    }, 800);
  }, []);

  const resetBattle = useCallback(() => {
    setState({
      playerCreature: {
        id: "player",
        name: "Умножитель",
        operation: "multiply",
        health: 100,
        maxHealth: 100,
        image: "player",
      },
      enemyCreature: {
        id: "enemy",
        name: "Вычитатель",
        operation: "subtract",
        health: 100,
        maxHealth: 100,
        image: "enemy",
      },
      availableNumbers: generateNumbers(),
      slot1: null,
      slot2: null,
      isPlayerTurn: true,
      battleLog: ["Бой начинается!"],
      projectile: null,
      gameOver: false,
      winner: null,
    });
  }, []);

  return { state, placeNumber, clearSlots, fireAttack, resetBattle, opSymbol: opSymbol(state.playerCreature.operation) };
};
