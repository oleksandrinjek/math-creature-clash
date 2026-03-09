import { motion, AnimatePresence } from "framer-motion";
import { useBattleState } from "@/hooks/useBattleState";
import CreatureCard from "./CreatureCard";
import Projectile from "./Projectile";
import { RotateCcw, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const BattleArena = () => {
  const { state, setInput, submitAnswer, resetBattle } = useBattleState();
  const inputRef = useRef<HTMLInputElement>(null);
  const [elapsed, setElapsed] = useState(0);

  // Auto-focus input
  useEffect(() => {
    if (state.isPlayerTurn && !state.gameOver) {
      inputRef.current?.focus();
    }
  }, [state.isPlayerTurn, state.gameOver, state.currentProblem]);

  // Timer
  useEffect(() => {
    if (!state.isPlayerTurn || state.gameOver || !state.problemStartTime) return;
    const interval = setInterval(() => {
      setElapsed(Math.max(0, (Date.now() - state.problemStartTime!) / 1000));
    }, 100);
    return () => clearInterval(interval);
  }, [state.isPlayerTurn, state.gameOver, state.problemStartTime]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && state.playerInput) {
      submitAnswer();
    }
  };

  // Damage indicator based on time
  const getDamagePreview = () => {
    if (!state.isPlayerTurn) return null;
    const dmg = Math.max(5, Math.round(25 - elapsed * 2.5));
    return dmg;
  };

  const damagePreview = getDamagePreview();

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-arena arena-grid">
      {/* Title */}
      <div className="text-center pt-3 pb-1">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-creature-bone tracking-wide">
          Mathematic Battles
        </h1>
        <p className="text-xs font-mono text-muted-foreground">Раунд {state.round}</p>
      </div>

      {/* Enemy Zone */}
      <div className="flex-1 flex items-center justify-center relative min-h-0">
        <CreatureCard
          name={state.enemyCreature.name}
          health={state.enemyCreature.health}
          maxHealth={state.enemyCreature.maxHealth}
          side="enemy"
          isActive={!state.isPlayerTurn && !state.gameOver}
          operation="Тень"
        />
      </div>

      {/* Arena Center */}
      <div className="relative h-20 flex items-center justify-center">
        <AnimatePresence>
          {state.projectile && (
            <Projectile value={state.projectile.value} target={state.projectile.target} />
          )}
        </AnimatePresence>

        {state.feedback && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-lg font-mono font-bold ${state.feedback.correct ? "text-player-energy text-glow-cyan" : "text-destructive"}`}
          >
            {state.feedback.correct ? `Верно! −${state.feedback.damage} HP` : "Мимо!"}
          </motion.span>
        )}

        {!state.feedback && !state.gameOver && (
          <span className={`text-sm font-mono uppercase tracking-widest ${state.isPlayerTurn ? "text-player-energy text-glow-cyan" : "text-enemy-energy text-glow-magenta"}`}>
            {state.isPlayerTurn ? "Решай!" : "Атака врага..."}
          </span>
        )}

        {state.gameOver && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <span className={`text-xl font-display font-bold ${state.winner === "player" ? "text-player-energy text-glow-cyan" : "text-enemy-energy text-glow-magenta"}`}>
              {state.winner === "player" ? "Победа!" : "Поражение!"}
            </span>
            <button
              onClick={resetBattle}
              className="flex items-center gap-2 text-sm font-mono text-foreground bg-muted hover:bg-border px-4 py-2 rounded-md transition-colors"
            >
              <RotateCcw size={14} />
              Новый бой
            </button>
          </motion.div>
        )}
      </div>

      {/* Player Zone */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <CreatureCard
          name={state.playerCreature.name}
          health={state.playerCreature.health}
          maxHealth={state.playerCreature.maxHealth}
          side="player"
          isActive={state.isPlayerTurn && !state.gameOver}
          operation="Умножение"
        />
      </div>

      {/* Workstation */}
      <div className="border-t border-border bg-card px-4 py-4 space-y-3">
        {/* Problem Display */}
        {state.currentProblem && !state.gameOver && (
          <div className="flex flex-col items-center gap-3">
            {/* Timer & damage preview */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-muted-foreground">⏱ {elapsed.toFixed(1)}с</span>
              {damagePreview && (
                <span className={`${damagePreview > 15 ? "text-player-energy" : damagePreview > 8 ? "text-creature-bone" : "text-health-low"}`}>
                  Урон: ~{damagePreview}
                </span>
              )}
            </div>

            {/* The problem */}
            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl font-mono font-bold text-player-energy text-glow-cyan">
                {state.currentProblem.a}
              </span>
              <span className="text-3xl sm:text-4xl font-mono text-creature-bone">×</span>
              <span className="text-4xl sm:text-5xl font-mono font-bold text-player-energy text-glow-cyan">
                {state.currentProblem.b}
              </span>
              <span className="text-3xl sm:text-4xl font-mono text-creature-bone">=</span>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={state.playerInput}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!state.isPlayerTurn || state.gameOver}
                placeholder="?"
                className="w-20 sm:w-24 h-14 sm:h-16 text-center text-3xl sm:text-4xl font-mono font-bold rounded-md border-2 border-border bg-slot-empty text-foreground placeholder:text-muted-foreground focus:border-player-energy focus:outline-none focus:ring-0 transition-colors disabled:opacity-30"
                autoComplete="off"
              />

              <motion.button
                onClick={submitAnswer}
                disabled={!state.isPlayerTurn || !state.playerInput || state.gameOver}
                className="w-14 h-14 sm:h-16 rounded-md border border-player-energy bg-muted text-player-energy flex items-center justify-center disabled:opacity-20 disabled:border-border disabled:text-muted-foreground transition-all"
                whileHover={state.playerInput ? { boxShadow: "0 0 20px hsl(180 100% 50% / 0.5)" } : {}}
                whileTap={state.playerInput ? { scale: 0.95 } : {}}
              >
                <Send size={20} />
              </motion.button>
            </div>
          </div>
        )}

        {/* Battle Log */}
        <div className="max-h-14 overflow-y-auto text-xs font-mono text-muted-foreground space-y-0.5">
          {state.battleLog.slice(-3).map((log, i) => (
            <p key={i}>{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleArena;
