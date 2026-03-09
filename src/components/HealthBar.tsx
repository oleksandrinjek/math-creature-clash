import { motion } from "framer-motion";

interface HealthBarProps {
  current: number;
  max: number;
  side: "player" | "enemy";
}

const HealthBar = ({ current, max, side }: HealthBarProps) => {
  const pct = (current / max) * 100;
  const isLow = pct < 30;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1 font-mono">
        <span className={side === "player" ? "text-player-energy" : "text-enemy-energy"}>HP</span>
        <span className="text-foreground">{current}/{max}</span>
      </div>
      <div className="h-3 rounded-sm bg-muted overflow-hidden border border-border">
        <motion.div
          className={`h-full rounded-sm ${isLow ? "bg-health-low" : side === "player" ? "bg-player-energy" : "bg-enemy-energy"}`}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default HealthBar;
