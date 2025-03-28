import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useIncrementalGame } from '../lib/stores/useIncrementalGame';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Building from '../components/games/incremental/Building';
import UpgradeButton from '../components/games/incremental/UpgradeButton';
import { toast } from 'sonner';
import { useAudio } from '../lib/stores/useAudio';

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const IncrementalGame = () => {
  const {
    cookies,
    totalCookies,
    cookiesPerClick,
    cookiesPerSecond,
    buildings,
    upgrades,
    clickCookie,
    buyBuilding,
    upgradeClickMultiplier,
    upgradeProductionMultiplier,
    reset,
    tick
  } = useIncrementalGame();
  
  const { playSuccess, playHit } = useAudio();
  const [animatingClick, setAnimatingClick] = useState(false);
  
  // Load sound effects
  useEffect(() => {
    const hitSound = new Audio('/sounds/hit.mp3');
    const successSound = new Audio('/sounds/success.mp3');
    
    useAudio.setState({
      hitSound,
      successSound,
      isMuted: false
    });
    
    return () => {
      hitSound.pause();
      successSound.pause();
    };
  }, []);
  
  // Game loop for passive income
  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 100); // Update 10 times per second for smooth increments
    
    return () => clearInterval(interval);
  }, [tick]);
  
  const handleCookieClick = () => {
    clickCookie();
    playHit();
    
    // Animate the cookie click
    setAnimatingClick(true);
    setTimeout(() => setAnimatingClick(false), 100);
  };
  
  const handleBuyBuilding = (id: string) => {
    const previousCookies = cookies;
    buyBuilding(id);
    if (cookies < previousCookies) {
      playSuccess();
      toast.success(`Purchased a new building!`);
    }
  };
  
  const handleUpgradeClick = () => {
    if (upgradeClickMultiplier()) {
      playSuccess();
      toast.success(`Upgraded click power!`);
    } else {
      toast.error("Not enough cookies for this upgrade!");
    }
  };
  
  const handleUpgradeProduction = () => {
    if (upgradeProductionMultiplier()) {
      playSuccess();
      toast.success(`Upgraded production rate!`);
    } else {
      toast.error("Not enough cookies for this upgrade!");
    }
  };
  
  const handleReset = () => {
    if (confirm("Are you sure you want to reset your progress?")) {
      reset();
      toast.info("Game has been reset");
    }
  };
  
  // Only show unlocked buildings
  const unlockedBuildings = buildings.filter(building => building.unlocked);
  
  return (
    <>
      <Helmet>
        <title>Clicker Empire | maths.k.com</title>
      </Helmet>
      
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Clicker Empire</h1>
          <p className="text-muted-foreground mb-4">
            Click the cookie to earn more cookies and build your empire!
          </p>
          
          <div className="stats flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Card className="flex-1">
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatter.format(cookies)}</p>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Per Click</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatter.format(cookiesPerClick)}</p>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Per Second</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatter.format(cookiesPerSecond)}</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center">
            <button
              onClick={handleCookieClick}
              className={`cookie-button w-48 h-48 rounded-full bg-amber-200 hover:bg-amber-300 flex items-center justify-center shadow-lg transition-all ${
                animatingClick ? 'scale-95' : 'scale-100'
              }`}
              aria-label="Click cookie"
            >
              <div className="w-40 h-40 rounded-full bg-amber-300 flex items-center justify-center">
                <div className="w-36 h-36 rounded-full bg-amber-400 flex items-center justify-center text-amber-800 font-bold text-xl">
                  COOKIE
                </div>
              </div>
            </button>
            
            <div className="mt-8 w-full space-y-4">
              <UpgradeButton
                name="Upgrade Click Power"
                description={`Increase cookies per click by ${upgrades.clickMultiplier}`}
                cost={100 * Math.pow(3, upgrades.clickMultiplier)}
                onClick={handleUpgradeClick}
                canAfford={cookies >= 100 * Math.pow(3, upgrades.clickMultiplier)}
              />
              
              <UpgradeButton
                name="Upgrade Production"
                description={`Multiply all production by ${upgrades.productionMultiplier + 1}x`}
                cost={500 * Math.pow(5, upgrades.productionMultiplier)}
                onClick={handleUpgradeProduction}
                canAfford={cookies >= 500 * Math.pow(5, upgrades.productionMultiplier)}
              />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <Tabs defaultValue="buildings">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="buildings">Buildings</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="buildings" className="border rounded-md p-4">
                <h2 className="text-xl font-bold mb-4">Buildings</h2>
                <div className="space-y-3">
                  {unlockedBuildings.map((building) => (
                    <Building
                      key={building.id}
                      building={building}
                      cookies={cookies}
                      onBuy={() => handleBuyBuilding(building.id)}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="stats" className="border rounded-md p-4">
                <h2 className="text-xl font-bold mb-4">Statistics</h2>
                <ul className="space-y-2">
                  <li><span className="font-semibold">Total cookies earned:</span> {formatter.format(totalCookies)}</li>
                  <li><span className="font-semibold">Cookies per click:</span> {formatter.format(cookiesPerClick)}</li>
                  <li><span className="font-semibold">Cookies per second:</span> {formatter.format(cookiesPerSecond)}</li>
                  <li><span className="font-semibold">Buildings owned:</span> {buildings.reduce((acc, b) => acc + b.owned, 0)}</li>
                  <li><span className="font-semibold">Click upgrade level:</span> {upgrades.clickMultiplier}</li>
                  <li><span className="font-semibold">Production multiplier:</span> {upgrades.productionMultiplier}x</li>
                </ul>
                
                <div className="mt-6">
                  <Button variant="destructive" onClick={handleReset}>Reset Game</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default IncrementalGame;
