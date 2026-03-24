import { useState, useMemo } from "react";
import BattleArena from "@/components/BattleArena";
import MainMenu from "@/components/MainMenu";
import { usePlayerProgress } from "@/hooks/usePlayerProgress";
import { MathOperation } from "@/hooks/useBattleState";

const Index = () => {
  const [screen, setScreen] = useState<"menu" | "battle">("menu");
  const [operation, setOperation] = useState<MathOperation>("multiply");
  const { progress, levelUp, addRewards, buyUpgrade, buyShopItem, buySkin, equipSkin, getEnemyScale } = usePlayerProgress();
  const enemyConfig = useMemo(() => getEnemyScale(progress.level), [progress.level, getEnemyScale]);

  if (screen === "menu") {
    return (
      <MainMenu
        progress={progress}
        onStartBattle={() => setScreen("battle")}
        onBuyUpgrade={buyUpgrade}
        onBuyShopItem={buyShopItem}
        onBuySkin={buySkin}
        onEquipSkin={equipSkin}
        operation={operation}
        onSetOperation={setOperation}
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
      operation={operation}
    />
  );
};

export default Index;
