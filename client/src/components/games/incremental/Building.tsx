import { Button } from '../../ui/button';

interface BuildingProps {
  building: {
    id: string;
    name: string;
    basePrice: number;
    baseProduction: number;
    owned: number;
  };
  cookies: number;
  onBuy: () => void;
}

// Calculate the price based on how many are owned
const calculatePrice = (basePrice: number, owned: number) => {
  return Math.floor(basePrice * Math.pow(1.15, owned));
};

const Building = ({ building, cookies, onBuy }: BuildingProps) => {
  const price = calculatePrice(building.basePrice, building.owned);
  const canAfford = cookies >= price;
  
  return (
    <div className="flex items-center justify-between border p-3 rounded-md bg-card hover:bg-accent/10 transition-colors">
      <div className="flex-1">
        <h3 className="font-medium">{building.name}</h3>
        <div className="flex justify-between gap-x-4 text-sm">
          <span>Owned: {building.owned}</span>
          <span>+{building.baseProduction.toFixed(1)}/sec each</span>
        </div>
      </div>
      
      <Button
        onClick={onBuy}
        disabled={!canAfford}
        variant={canAfford ? "default" : "outline"}
        className="min-w-[100px]"
      >
        {price} 🍪
      </Button>
    </div>
  );
};

export default Building;
