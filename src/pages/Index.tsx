import { useState } from "react";
import BattleArena from "@/components/BattleArena";
import MainMenu from "@/components/MainMenu";
import { usePlayerProgress } from "@/hooks/usePlayerProgress";
import { useMemo } from "react";

const Index = () => {
  const [screen, setScreen] = useState<"menu" | "battle">("menu");
  const { progress, levelUp, addRewards, buyUpgrade, getEnemyScale } = usePlayerProgress();
  const enemyConfig = useMemo(() => getEnemyScale(progress.level), [progress.level, getEnemyScale]);

  if (screen === "menu") {
    return (
      <MainMenu
        progress={progress}
        onStartBattle={() => setScreen("battle")}
        onBuyUpgrade={buyUpgrade}
      />
    );
  }

  return (
    <BattleArena
      progress={progress}
      levelUp={levelUp}
      addRewards={addRewards}
      enemyConfig={enemyConfig}
      onReturnToMenu={() => setScreen("menu")}
    />
  );
};

export default Index;
