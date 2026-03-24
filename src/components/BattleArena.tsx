import { motion, AnimatePresence } from "framer-motion";
import { useBattleState, MathOperation } from "@/hooks/useBattleState";
import { PlayerProgress, SKIN_DEFS } from "@/hooks/usePlayerProgress";
import { useI18n } from "@/hooks/useI18n";
import CreatureCard from "./CreatureCard";
import Projectile from "./Projectile";
import PlayerHUD from "./PlayerHUD";
import { RotateCcw, Send, Home } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface EnemyConfig {
  enemyHp: number;
  enemyMinDmg: number;
  enemyMaxDmg: number;
  enemyName: string;
}

interface BattleArenaProps {
  progress: PlayerProgress;
  levelUp: boolean;
  addRewards: (xp: number, coins: number) => void;
  enemyConfig: EnemyConfig;
  onReturnToMenu: () => void;
  operation: MathOperation;
}

const OP_SYMBOLS: Record<MathOperation, string> = { multiply: "×", add: "+", subtract: "−" };

const BattleArena = ({ progress, levelUp, addRewards, enemyConfig, onReturnToMenu, operation }: BattleArenaProps) => {
  const { t } = useI18n();
  const playerMaxHp = 100 + progress.upgrades.maxHp;
  const bonusDmg = progress.upgrades.bonusDmg;
  const bonusTime = progress.upgrades.bonusTime;

  const { state, setInput, submitAnswer, resetBattle, resetTimer } = useBattleState(enemyConfig, playerMaxHp, progress.level, t, operation);
  const inputRef = useRef<HTMLInputElement>(null);
  const [elapsed, setElapsed] = useState(0);
  const [countdown, setCountdown] = useState(3);

  const countdownDoneTime = useRef<number | null>(null);

  useEffect(() => {
    if (countdown <= 0) {
      if (!countdownDoneTime.current) {
        countdownDoneTime.current = Date.now();
        resetTimer();
      }
      return;
    }
    countdownDoneTime.current = null;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, resetTimer]);

  useEffect(() => {
    if (state.pendingReward) {
      addRewards(state.pendingReward.xp, state.pendingReward.coins);
    }
  }, [state.pendingReward, addRewards]);

  useEffect(() => {
    if (state.isPlayerTurn && !state.gameOver) {
      inputRef.current?.focus();
    }
  }, [state.isPlayerTurn, state.gameOver, state.currentProblem]);

  useEffect(() => {
    if (!state.isPlayerTurn || state.gameOver || !state.problemStartTime) return;
    if (countdown > 0) { setElapsed(0); return; }
    const startTime = state.problemStartTime;
    const interval = setInterval(() => {
      setElapsed(Math.max(0, (Date.now() - startTime) / 1000));
    }, 100);
    return () => clearInterval(interval);
  }, [state.isPlayerTurn, state.gameOver, state.problemStartTime, countdown]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && state.playerInput) {
      submitAnswer(bonusDmg, bonusTime);
    }
  };

  const getDamagePreview = () => {
    if (!state.isPlayerTurn) return null;
    const adjustedElapsed = Math.max(0, elapsed - bonusTime);
    return Math.max(5, Math.round(25 + bonusDmg - adjustedElapsed * 2.5));
  };

  const damagePreview = getDamagePreview();

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-arena arena-grid">
      <PlayerHUD progress={progress} levelUp={levelUp} />

      <AnimatePresence>
        {countdown > 0 && (
          <motion.div
            key="countdown-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.span
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-8xl font-display font-bold text-player-energy text-glow-cyan"
            >
              {countdown}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex items-center justify-center relative min-h-0">
        <CreatureCard
          name={state.enemyCreature.name}
          health={state.enemyCreature.health}
          maxHealth={state.enemyCreature.maxHealth}
          side="enemy"
          isActive={!state.isPlayerTurn && !state.gameOver}
          operation={t("creature.shadow")}
        />
      </div>

      <div className="relative h-20 flex items-center justify-center">
        <AnimatePresence>
          {state.projectile && (
            <Projectile value={state.projectile.value} target={state.projectile.target} />
          )}
        </AnimatePresence>

        {state.feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <span className={`text-lg font-mono font-bold ${state.feedback.correct ? "text-player-energy text-glow-cyan" : "text-destructive"}`}>
              {state.feedback.correct ? `${t("battle.correct")} −${state.feedback.damage} HP` : t("battle.miss")}
            </span>
            {state.pendingReward && state.pendingReward.xp > 0 && (
              <span className="text-xs font-mono text-accent">
                +{state.pendingReward.xp} XP
              </span>
            )}
          </motion.div>
        )}

        {!state.feedback && !state.gameOver && (
          <span className={`text-sm font-mono uppercase tracking-widest ${state.isPlayerTurn ? "text-player-energy text-glow-cyan" : "text-enemy-energy text-glow-magenta"}`}>
            {state.isPlayerTurn ? t("battle.solve") : t("battle.enemyTurn")}
          </span>
        )}

        {state.gameOver && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <span className={`text-xl font-display font-bold ${state.winner === "player" ? "text-player-energy text-glow-cyan" : "text-enemy-energy text-glow-magenta"}`}>
              {state.winner === "player" ? t("battle.victory") : t("battle.defeat")}
            </span>
            {state.winner === "player" && (
              <span className="text-xs font-mono text-accent">{t("battle.victoryBonus")} +20 XP · +{15 + (progress.level - 1) * 2} 🪙</span>
            )}

            {state.mistakes.length > 0 && (
              <div className="mt-1 px-4 py-2 rounded-md bg-muted/80 border border-border max-w-xs w-full">
                <p className="text-xs font-mono text-muted-foreground mb-1">{t("battle.reviewMistakes")}:</p>
                <div className="space-y-0.5">
                  {state.mistakes.map((m, i) => (
                    <p key={i} className="text-xs font-mono">
                      <span className="text-destructive line-through">{m.a} × {m.b} = {m.playerAnswer}</span>
                      <span className="text-player-energy ml-2">→ {m.correctAnswer}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (state.winner === "player") addRewards(20, 15 + (progress.level - 1) * 2);
                  onReturnToMenu();
                }}
                className="flex items-center gap-2 text-sm font-mono text-foreground bg-muted hover:bg-border px-4 py-2 rounded-md transition-colors"
              >
                <Home size={14} />
                {t("battle.menu")}
              </button>
              <button
                onClick={() => {
                  if (state.winner === "player") addRewards(20, 15 + (progress.level - 1) * 2);
                  resetBattle();
                  setCountdown(3);
                }}
                className="flex items-center gap-2 text-sm font-mono text-foreground bg-muted hover:bg-border px-4 py-2 rounded-md transition-colors"
              >
                <RotateCcw size={14} />
                {t("battle.again")}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center min-h-0">
        <CreatureCard
          name={state.playerCreature.name}
          health={state.playerCreature.health}
          maxHealth={state.playerCreature.maxHealth}
          side="player"
          isActive={state.isPlayerTurn && !state.gameOver}
          operation={t("creature.multiplication")}
          skinHue={SKIN_DEFS.find((s) => s.id === progress.activeSkin)?.hue}
        />
      </div>

      <div className="border-t border-border bg-card px-4 py-4 space-y-3">
        {state.currentProblem && !state.gameOver && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-muted-foreground">⏱ {elapsed.toFixed(1)}s</span>
              {damagePreview && (
                <span className={`${damagePreview > 15 ? "text-player-energy" : damagePreview > 8 ? "text-creature-bone" : "text-health-low"}`}>
                  {t("battle.damage")} ~{damagePreview}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl font-mono font-bold text-player-energy text-glow-cyan">
                {state.currentProblem.a}
              </span>
              <span className="text-3xl sm:text-4xl font-mono text-creature-bone">{state.currentProblem ? OP_SYMBOLS[state.currentProblem.op] : "×"}</span>
              <span className="text-4xl sm:text-5xl font-mono font-bold text-player-energy text-glow-cyan">
                {state.currentProblem.b}
              </span>
              <span className="text-3xl sm:text-4xl font-mono text-creature-bone">=</span>

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
                onClick={() => submitAnswer(bonusDmg, bonusTime)}
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

        <div className="max-h-14 overflow-y-auto text-xs font-mono text-muted-foreground space-y-0.5">
          {state.battleLog.slice(-3).map((log, i) => (
            <p key={i}>{log}</p>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {levelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="text-4xl font-display font-bold text-accent text-glow-cyan"
            >
              {t("hud.level")} {progress.level}!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BattleArena;
