import { motion, AnimatePresence } from "framer-motion";
import { useBattleState } from "@/hooks/useBattleState";
import CreatureCard from "./CreatureCard";
import NumberResource from "./NumberResource";
import EquationSlot from "./EquationSlot";
import Projectile from "./Projectile";
import { RotateCcw } from "lucide-react";

const BattleArena = () => {
  const { state, placeNumber, clearSlots, fireAttack, resetBattle, opSymbol } = useBattleState();
  const canFire = state.slot1 !== null && state.slot2 !== null && state.isPlayerTurn && !state.gameOver;

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-arena arena-grid">
      {/* Title */}
      <div className="text-center pt-3 pb-1">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-creature-bone tracking-wide">
          Mathematic Battles
        </h1>
      </div>

      {/* Enemy Zone */}
      <div className="flex-1 flex items-center justify-center relative">
        <CreatureCard
          name={state.enemyCreature.name}
          health={state.enemyCreature.health}
          maxHealth={state.enemyCreature.maxHealth}
          side="enemy"
          isActive={!state.isPlayerTurn && !state.gameOver}
          operation="Вычитание"
        />
      </div>

      {/* Arena Center - Projectiles & Status */}
      <div className="relative h-20 flex items-center justify-center">
        <AnimatePresence>
          {state.projectile && (
            <Projectile value={state.projectile.value} target={state.projectile.target} />
          )}
        </AnimatePresence>

        {!state.gameOver && (
          <span className={`text-sm font-mono uppercase tracking-widest ${state.isPlayerTurn ? "text-player-energy text-glow-cyan" : "text-enemy-energy text-glow-magenta"}`}>
            {state.isPlayerTurn ? "Ваш ход" : "Ход противника..."}
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
      <div className="flex-1 flex items-center justify-center">
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
        {/* Equation Assembly */}
        <div className="flex items-center justify-center gap-3">
          <EquationSlot value={state.slot1} label="Арг. 1" />
          <span className="text-2xl font-mono text-player-energy text-glow-cyan mt-4">{opSymbol}</span>
          <EquationSlot value={state.slot2} label="Арг. 2" />
          <div className="flex flex-col gap-1 mt-4">
            <motion.button
              onClick={fireAttack}
              disabled={!canFire}
              className="px-4 py-2 rounded-md font-mono text-sm font-bold bg-muted text-player-energy border border-player-energy disabled:opacity-20 disabled:border-border disabled:text-muted-foreground transition-all"
              whileHover={canFire ? { boxShadow: "0 0 20px hsl(180 100% 50% / 0.5)" } : {}}
              whileTap={canFire ? { scale: 0.95 } : {}}
            >
              Огонь!
            </motion.button>
            <button
              onClick={clearSlots}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
            >
              Сброс
            </button>
          </div>
        </div>

        {/* Number Resources */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {state.availableNumbers.map((num, i) => (
            <NumberResource
              key={`${i}-${num}`}
              value={num}
              index={i}
              onPlace={placeNumber}
              disabled={!state.isPlayerTurn || state.gameOver || (state.slot1 !== null && state.slot2 !== null)}
            />
          ))}
        </div>

        {/* Battle Log */}
        <div className="max-h-16 overflow-y-auto text-xs font-mono text-muted-foreground space-y-0.5 scrollbar-thin">
          {state.battleLog.slice(-3).map((log, i) => (
            <p key={i}>{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleArena;
