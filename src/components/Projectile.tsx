import { motion } from "framer-motion";

interface ProjectileProps {
  value: number;
  target: "enemy" | "player";
}

const Projectile = ({ value, target }: ProjectileProps) => {
  return (
    <motion.div
      className={`absolute z-20 font-mono text-3xl font-bold ${
        target === "enemy" ? "text-player-energy text-glow-cyan" : "text-enemy-energy text-glow-magenta"
      }`}
      initial={{
        x: target === "enemy" ? -60 : 60,
        y: target === "enemy" ? 40 : -40,
        opacity: 1,
        scale: 0.5,
      }}
      animate={{
        x: target === "enemy" ? 60 : -60,
        y: target === "enemy" ? -40 : 40,
        opacity: [1, 1, 0],
        scale: [0.5, 1.5, 0.8],
      }}
      transition={{ duration: 0.7, ease: "easeIn" }}
    >
      {value}
    </motion.div>
  );
};

export default Projectile;
