import { Button } from '../../ui/button';

interface UpgradeButtonProps {
  name: string;
  description: string;
  cost: number;
  onClick: () => void;
  canAfford: boolean;
}

const UpgradeButton = ({ name, description, cost, onClick, canAfford }: UpgradeButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      disabled={!canAfford}
      variant={canAfford ? "default" : "outline"}
      className="w-full py-6 h-auto flex flex-col"
    >
      <span className="text-lg font-semibold">{name}</span>
      <span className="text-sm opacity-80">{description}</span>
      <span className="mt-2 font-bold">{Math.floor(cost)} 🍪</span>
    </Button>
  );
};

export default UpgradeButton;
