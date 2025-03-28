import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLocalStorage, setLocalStorage } from '../utils';

// Define obstacles and track elements
interface Obstacle {
  id: number;
  position: { x: number, y: number, z: number };
  scale: { x: number, y: number, z: number };
  type: 'tree' | 'rock' | 'cone';
}

interface Checkpoint {
  id: number;
  position: { x: number, z: number };
  passed: boolean;
}

interface TrackConfig {
  obstacles: Obstacle[];
  checkpoints: Checkpoint[];
  trackWidth: number;
  trackLength: number;
}

interface GameSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  controls: 'arrows' | 'wasd';
  sfxVolume: number;
}

interface GameStats {
  bestTime: number | null;
  bestLap: number | null;
  totalCompletedLaps: number;
  totalCrashes: number;
}

interface DrivingGameState {
  // Game state
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  carPosition: { x: number, y: number, z: number };
  carRotation: number;
  carSpeed: number;
  maxSpeed: number;
  acceleration: number;
  handling: number;
  currentLap: number;
  lapStartTime: number | null;
  currentTime: number;
  
  // Track and configuration
  track: TrackConfig;
  settings: GameSettings;
  stats: GameStats;
  
  // Actions
  startGame: () => void;
  resetGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  accelerate: (amount: number) => void;
  brake: (amount: number) => void;
  steer: (direction: number) => void;
  updateCarPosition: (deltaTime: number) => void;
  checkCollision: () => boolean;
  checkCheckpoint: () => void;
  completeRace: () => void;
  changeDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  changeControls: (controls: 'arrows' | 'wasd') => void;
}

// Generate simple track
const generateTrack = (difficulty: 'easy' | 'medium' | 'hard'): TrackConfig => {
  const trackWidth = 20;
  const trackLength = 200;
  
  const obstacles: Obstacle[] = [];
  const checkpoints: Checkpoint[] = [];
  
  // Create checkpoints every 40 units
  for (let i = 0; i <= trackLength; i += 40) {
    checkpoints.push({
      id: i,
      position: { x: 0, z: -i },
      passed: false
    });
  }
  
  // Add obstacles based on difficulty
  const obstacleCount = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
  
  for (let i = 0; i < obstacleCount; i++) {
    // Place obstacles on either side of the track
    const side = Math.random() > 0.5 ? 1 : -1;
    const offset = (trackWidth / 2) + 2 + (Math.random() * 10);
    const zPosition = -(Math.random() * trackLength);
    
    // Different obstacle types
    const obstacleTypes: ('tree' | 'rock' | 'cone')[] = ['tree', 'rock', 'cone'];
    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    
    // Different sizes based on type
    let scale = { x: 1, y: 1, z: 1 };
    if (type === 'tree') {
      scale = { x: 2, y: 5, z: 2 };
    } else if (type === 'rock') {
      scale = { x: 2, y: 1.5, z: 2 };
    } else if (type === 'cone') {
      scale = { x: 0.8, y: 1.2, z: 0.8 };
    }
    
    obstacles.push({
      id: i,
      position: { x: side * offset, y: scale.y / 2, z: zPosition },
      scale,
      type
    });
  }
  
  return {
    obstacles,
    checkpoints,
    trackWidth,
    trackLength
  };
};

// Initialize game settings based on difficulty
const getGameSettings = (difficulty: 'easy' | 'medium' | 'hard'): {
  maxSpeed: number,
  acceleration: number,
  handling: number
} => {
  switch (difficulty) {
    case 'easy':
      return {
        maxSpeed: 40,
        acceleration: 15,
        handling: 3
      };
    case 'medium':
      return {
        maxSpeed: 60,
        acceleration: 20,
        handling: 2.5
      };
    case 'hard':
      return {
        maxSpeed: 80,
        acceleration: 25,
        handling: 2
      };
    default:
      return {
        maxSpeed: 40,
        acceleration: 15,
        handling: 3
      };
  }
};

export const useDrivingGame = create<DrivingGameState>()(
  persist(
    (set, get) => {
      // Initial difficulty
      const initialDifficulty = 'easy';
      const { maxSpeed, acceleration, handling } = getGameSettings(initialDifficulty);
      
      return {
        // Game state
        isPlaying: false,
        isPaused: false,
        isGameOver: false,
        carPosition: { x: 0, y: 0.5, z: 0 },
        carRotation: 0,
        carSpeed: 0,
        maxSpeed,
        acceleration,
        handling,
        currentLap: 0,
        lapStartTime: null,
        currentTime: 0,
        
        // Track and configuration
        track: generateTrack(initialDifficulty),
        settings: {
          difficulty: initialDifficulty,
          controls: 'arrows',
          sfxVolume: 0.7
        },
        stats: {
          bestTime: null,
          bestLap: null,
          totalCompletedLaps: 0,
          totalCrashes: 0
        },
        
        // Actions
        startGame: () => {
          const { settings } = get();
          const track = generateTrack(settings.difficulty);
          
          set({
            isPlaying: true,
            isPaused: false,
            isGameOver: false,
            carPosition: { x: 0, y: 0.5, z: 0 },
            carRotation: 0,
            carSpeed: 0,
            currentLap: 0,
            lapStartTime: Date.now(),
            currentTime: 0,
            track
          });
        },
        
        resetGame: () => {
          const { settings } = get();
          const track = generateTrack(settings.difficulty);
          
          set({
            isPlaying: false,
            isPaused: false,
            isGameOver: false,
            carPosition: { x: 0, y: 0.5, z: 0 },
            carRotation: 0,
            carSpeed: 0,
            currentLap: 0,
            lapStartTime: null,
            currentTime: 0,
            track
          });
        },
        
        pauseGame: () => {
          set({ isPaused: true });
        },
        
        resumeGame: () => {
          set({ isPaused: false });
        },
        
        accelerate: (amount: number) => {
          set((state) => {
            if (!state.isPlaying || state.isPaused || state.isGameOver) return {};
            
            // Accelerate up to max speed
            const newSpeed = Math.min(
              state.carSpeed + (amount * state.acceleration * 0.016),
              state.maxSpeed
            );
            
            return { carSpeed: newSpeed };
          });
        },
        
        brake: (amount: number) => {
          set((state) => {
            if (!state.isPlaying || state.isPaused || state.isGameOver) return {};
            
            // Brake/reverse (negative speed indicates reversing)
            const newSpeed = Math.max(
              state.carSpeed - (amount * state.acceleration * 0.032),
              -state.maxSpeed / 2
            );
            
            return { carSpeed: newSpeed };
          });
        },
        
        steer: (direction: number) => {
          set((state) => {
            if (!state.isPlaying || state.isPaused || state.isGameOver) return {};
            
            // Direction is -1 for left, 1 for right
            // Scale steering by the car's speed for more realistic handling
            const rotationAmount = direction * state.handling * Math.min(Math.abs(state.carSpeed) * 0.01, 1) * 0.016;
            
            return {
              carRotation: state.carRotation + rotationAmount
            };
          });
        },
        
        updateCarPosition: (deltaTime: number) => {
          set((state) => {
            if (!state.isPlaying || state.isPaused || state.isGameOver) return {};
            
            // Apply drag/friction
            const drag = 0.98;
            let newSpeed = state.carSpeed * drag;
            
            // If very slow, stop completely to prevent sliding
            if (Math.abs(newSpeed) < 0.1) {
              newSpeed = 0;
            }
            
            // Calculate movement based on rotation
            const moveX = Math.sin(state.carRotation) * newSpeed * deltaTime;
            const moveZ = Math.cos(state.carRotation) * newSpeed * deltaTime;
            
            const newPosition = {
              x: state.carPosition.x + moveX,
              y: state.carPosition.y,
              z: state.carPosition.z - moveZ // Negative because forward is negative Z in Three.js
            };
            
            // Track boundaries - prevent going too far off track
            const { trackWidth } = state.track;
            const boundaryLimit = trackWidth * 2;
            
            if (Math.abs(newPosition.x) > boundaryLimit) {
              newPosition.x = Math.sign(newPosition.x) * boundaryLimit;
            }
            
            // Update the time if racing
            let currentTime = state.currentTime;
            if (state.lapStartTime !== null) {
              currentTime = (Date.now() - state.lapStartTime) / 1000;
            }
            
            return {
              carPosition: newPosition,
              carSpeed: newSpeed,
              currentTime
            };
          });
          
          // After updating position, check for collisions and checkpoints
          const hasCollision = get().checkCollision();
          if (hasCollision) {
            // Handle collision - reduce speed and update crash count
            set((state) => ({
              carSpeed: state.carSpeed * 0.3,
              stats: {
                ...state.stats,
                totalCrashes: state.stats.totalCrashes + 1
              }
            }));
          }
          
          get().checkCheckpoint();
        },
        
        checkCollision: () => {
          const { carPosition, track } = get();
          
          // Check collision with obstacles
          for (const obstacle of track.obstacles) {
            const dx = carPosition.x - obstacle.position.x;
            const dz = carPosition.z - obstacle.position.z;
            
            // Simple collision distance based on obstacle scale
            const collisionDistance = (obstacle.scale.x + 1.5) / 2; // Car is roughly 1.5 units wide
            
            // Check if within collision distance
            if (Math.sqrt(dx * dx + dz * dz) < collisionDistance) {
              return true;
            }
          }
          
          return false;
        },
        
        checkCheckpoint: () => {
          const { carPosition, track, currentLap } = get();
          
          // Find the next checkpoint
          const nextCheckpointIndex = track.checkpoints.findIndex(cp => !cp.passed);
          
          if (nextCheckpointIndex === -1) {
            // All checkpoints passed, we've completed a lap
            get().completeRace();
            return;
          }
          
          const checkpoint = track.checkpoints[nextCheckpointIndex];
          
          // Check if we've passed this checkpoint
          const dx = carPosition.x - checkpoint.position.x;
          const dz = carPosition.z - checkpoint.position.z;
          const distance = Math.sqrt(dx * dx + dz * dz);
          
          if (distance < 10) { // Checkpoint radius
            const updatedCheckpoints = [...track.checkpoints];
            updatedCheckpoints[nextCheckpointIndex] = {
              ...checkpoint,
              passed: true
            };
            
            set({
              track: {
                ...track,
                checkpoints: updatedCheckpoints
              }
            });
          }
        },
        
        completeRace: () => {
          const { currentTime, currentLap, stats } = get();
          
          // Reset all checkpoint states
          const { track } = get();
          const updatedCheckpoints = track.checkpoints.map(cp => ({
            ...cp,
            passed: false
          }));
          
          // Update best times
          let newBestLap = stats.bestLap;
          if (newBestLap === null || currentTime < newBestLap) {
            newBestLap = currentTime;
          }
          
          set({
            track: {
              ...track,
              checkpoints: updatedCheckpoints
            },
            currentLap: currentLap + 1,
            lapStartTime: Date.now(),
            stats: {
              ...stats,
              bestLap: newBestLap,
              totalCompletedLaps: stats.totalCompletedLaps + 1
            }
          });
        },
        
        changeDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => {
          const { maxSpeed, acceleration, handling } = getGameSettings(difficulty);
          const track = generateTrack(difficulty);
          
          set((state) => ({
            maxSpeed,
            acceleration,
            handling,
            track,
            settings: {
              ...state.settings,
              difficulty
            },
            isPlaying: false,
            isPaused: false,
            isGameOver: false,
            carPosition: { x: 0, y: 0.5, z: 0 },
            carRotation: 0,
            carSpeed: 0,
            currentLap: 0,
            lapStartTime: null,
            currentTime: 0
          }));
        },
        
        changeControls: (controls: 'arrows' | 'wasd') => {
          set((state) => ({
            settings: {
              ...state.settings,
              controls
            }
          }));
        }
      };
    },
    {
      name: 'driving-game',
      storage: {
        getItem: getLocalStorage,
        setItem: setLocalStorage,
      },
    }
  )
);
