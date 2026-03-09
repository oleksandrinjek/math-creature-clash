import { motion } from "framer-motion";

interface NumberResourceProps {
  value: number;
  index: number;
  onPlace: (value: number, index: number) => void;
  disabled: boolean;
}

const NumberResource = ({ value, index, onPlace, disabled }: NumberResourceProps) => {
  return (
    <motion.button
      onClick={() => !disabled && onPlace(value, index)}
      className="w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-muted border border-border font-mono text-xl font-bold text-number-resource flex items-center justify-center hover:border-player-energy transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      whileHover={!disabled ? { scale: 1.1, boxShadow: "0 0 15px hsl(180 100% 50% / 0.4)" } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      disabled={disabled}
    >
      {value}
    </motion.button>
  );
};

export default NumberResource;
