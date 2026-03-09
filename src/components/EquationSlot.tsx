import { motion } from "framer-motion";

interface EquationSlotProps {
  value: number | null;
  label: string;
}

const EquationSlot = ({ value, label }: EquationSlotProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <motion.div
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-md border-2 flex items-center justify-center font-mono text-2xl font-bold transition-colors ${
          value !== null
            ? "border-player-energy bg-slot-filled text-player-energy glow-cyan"
            : "border-border bg-slot-empty text-muted-foreground"
        }`}
        animate={value !== null ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {value !== null ? value : "?"}
      </motion.div>
    </div>
  );
};

export default EquationSlot;
