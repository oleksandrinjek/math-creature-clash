import { motion } from "framer-motion";
import playerImg from "@/assets/creature-player.png";
import enemyImg from "@/assets/creature-enemy.png";
import HealthBar from "./HealthBar";

interface CreatureCardProps {
  name: string;
  health: number;
  maxHealth: number;
  side: "player" | "enemy";
  isActive: boolean;
  operation: string;
  skinHue?: string;
}

const CreatureCard = ({ name, health, maxHealth, side, isActive, operation, skinHue }: CreatureCardProps) => {
  const img = side === "player" ? playerImg : enemyImg;
  const hueFilter = side === "player" && skinHue && skinHue !== "0deg" ? `hue-rotate(${skinHue})` : undefined;

  return (
    <div className="flex flex-col items-center gap-1 min-h-0">
      <h3 className="font-display text-sm sm:text-base font-semibold text-creature-bone leading-tight">{name}</h3>
      <span className={`text-[10px] font-mono uppercase tracking-widest leading-none ${side === "player" ? "text-player-energy" : "text-enemy-energy"}`}>
        {operation}
      </span>
      <motion.div
        className={`relative w-20 h-20 sm:w-28 sm:h-28 ${isActive ? (side === "player" ? "animate-pulse-cyan" : "animate-pulse-magenta") : ""} rounded-lg`}
        animate={isActive ? { scale: [1, 1.03, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <img
          src={img}
          alt={name}
          className="w-full h-full object-contain drop-shadow-lg"
          style={hueFilter ? { filter: hueFilter } : undefined}
        />
      </motion.div>
      <div className="w-32 sm:w-40">
        <HealthBar current={health} max={maxHealth} side={side} />
      </div>
    </div>
  );
};

export default CreatureCard;
