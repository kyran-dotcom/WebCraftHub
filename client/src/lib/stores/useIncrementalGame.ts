import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLocalStorage, setLocalStorage } from '../utils';

interface Building {
  id: string;
  name: string;
  basePrice: number;
  baseProduction: number;
  owned: number;
  unlocked: boolean;
}

interface UpgradeState {
  clickMultiplier: number;
  productionMultiplier: number;
}

interface IncrementalGameState {
  cookies: number;
  totalCookies: number;
  cookiesPerClick: number;
  cookiesPerSecond: number;
  buildings: Building[];
  upgrades: UpgradeState;
  lastUpdate: number;
  
  // Actions
  addCookies: (amount: number) => void;
  clickCookie: () => void;
  buyBuilding: (buildingId: string) => void;
  upgradeClickMultiplier: () => boolean;
  upgradeProductionMultiplier: () => boolean;
  calculateCPS: () => number;
  reset: () => void;
  tick: () => void;
}

// Initialize the buildings
const initialBuildings: Building[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    basePrice: 15,
    baseProduction: 0.1,
    owned: 0,
    unlocked: true
  },
  {
    id: 'grandma',
    name: 'Grandma',
    basePrice: 100,
    baseProduction: 1,
    owned: 0,
    unlocked: true
  },
  {
    id: 'farm',
    name: 'Farm',
    basePrice: 1100,
    baseProduction: 8,
    owned: 0,
    unlocked: false
  },
  {
    id: 'mine',
    name: 'Mine',
    basePrice: 12000,
    baseProduction: 47,
    owned: 0,
    unlocked: false
  },
  {
    id: 'factory',
    name: 'Factory',
    basePrice: 130000,
    baseProduction: 260,
    owned: 0,
    unlocked: false
  }
];

// Function to calculate price of next building based on how many are owned
const calculateBuildingPrice = (basePrice: number, owned: number) => {
  return Math.floor(basePrice * Math.pow(1.15, owned));
};

// Create the store
export const useIncrementalGame = create<IncrementalGameState>()(
  persist(
    (set, get) => ({
      cookies: 0,
      totalCookies: 0,
      cookiesPerClick: 1,
      cookiesPerSecond: 0,
      buildings: initialBuildings,
      upgrades: {
        clickMultiplier: 1,
        productionMultiplier: 1
      },
      lastUpdate: Date.now(),
      
      addCookies: (amount) => {
        set((state) => ({
          cookies: state.cookies + amount,
          totalCookies: state.totalCookies + amount
        }));
      },
      
      clickCookie: () => {
        const { cookiesPerClick, addCookies } = get();
        addCookies(cookiesPerClick);
        
        // Check if we should unlock new buildings
        set((state) => {
          const updatedBuildings = state.buildings.map(building => {
            if (!building.unlocked) {
              if (
                (building.id === 'farm' && state.totalCookies >= 500) ||
                (building.id === 'mine' && state.totalCookies >= 5000) ||
                (building.id === 'factory' && state.totalCookies >= 50000)
              ) {
                return { ...building, unlocked: true };
              }
            }
            return building;
          });
          
          return { buildings: updatedBuildings };
        });
      },
      
      buyBuilding: (buildingId) => {
        const state = get();
        const buildingIndex = state.buildings.findIndex(b => b.id === buildingId);
        
        if (buildingIndex === -1) return;
        
        const building = state.buildings[buildingIndex];
        const price = calculateBuildingPrice(building.basePrice, building.owned);
        
        if (state.cookies < price) return;
        
        set((state) => {
          const updatedBuildings = [...state.buildings];
          updatedBuildings[buildingIndex] = {
            ...building,
            owned: building.owned + 1
          };
          
          return {
            cookies: state.cookies - price,
            buildings: updatedBuildings,
            cookiesPerSecond: get().calculateCPS()
          };
        });
      },
      
      upgradeClickMultiplier: () => {
        const state = get();
        const currentMultiplier = state.upgrades.clickMultiplier;
        const price = 100 * Math.pow(3, currentMultiplier);
        
        if (state.cookies < price) return false;
        
        set((state) => ({
          cookies: state.cookies - price,
          cookiesPerClick: state.cookiesPerClick + currentMultiplier,
          upgrades: {
            ...state.upgrades,
            clickMultiplier: currentMultiplier + 1
          }
        }));
        
        return true;
      },
      
      upgradeProductionMultiplier: () => {
        const state = get();
        const currentMultiplier = state.upgrades.productionMultiplier;
        const price = 500 * Math.pow(5, currentMultiplier);
        
        if (state.cookies < price) return false;
        
        set((state) => ({
          cookies: state.cookies - price,
          upgrades: {
            ...state.upgrades,
            productionMultiplier: currentMultiplier + 1
          },
          cookiesPerSecond: get().calculateCPS()
        }));
        
        return true;
      },
      
      calculateCPS: () => {
        const state = get();
        let cps = 0;
        
        state.buildings.forEach(building => {
          cps += building.baseProduction * building.owned;
        });
        
        return cps * state.upgrades.productionMultiplier;
      },
      
      reset: () => {
        set({
          cookies: 0,
          totalCookies: 0,
          cookiesPerClick: 1,
          cookiesPerSecond: 0,
          buildings: initialBuildings,
          upgrades: {
            clickMultiplier: 1,
            productionMultiplier: 1
          },
          lastUpdate: Date.now()
        });
      },
      
      tick: () => {
        const currentTime = Date.now();
        const state = get();
        const timeDiff = (currentTime - state.lastUpdate) / 1000; // Convert to seconds
        
        if (timeDiff < 0.01) return; // Skip very small updates
        
        const cookiesEarned = state.cookiesPerSecond * timeDiff;
        
        if (cookiesEarned > 0) {
          get().addCookies(cookiesEarned);
        }
        
        set({ lastUpdate: currentTime });
      }
    }),
    {
      name: 'game-incremental',
      storage: {
        getItem: getLocalStorage,
        setItem: setLocalStorage,
      },
    }
  )
);
