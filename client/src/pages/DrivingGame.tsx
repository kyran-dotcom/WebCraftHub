import { Suspense, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDrivingGame } from '../lib/stores/useDrivingGame';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAudio } from '../lib/stores/useAudio';
import Scene from '../components/games/driving/Scene';
import Controls from '../components/games/driving/Controls';

const DrivingGame = () => {
  const { 
    isPlaying, 
    isPaused, 
    currentLap, 
    currentTime, 
    settings,
    stats,
    startGame,
    resetGame,
    pauseGame,
    resumeGame,
    changeDifficulty,
    changeControls
  } = useDrivingGame();
  
  const { playHit, playSuccess } = useAudio();
  
  // Load sound effects
  useEffect(() => {
    const hitSound = new Audio('/sounds/hit.mp3');
    const successSound = new Audio('/sounds/success.mp3');
    const bgMusic = new Audio('/sounds/background.mp3');
    
    // Configure sounds
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    
    useAudio.setState({
      hitSound,
      successSound,
      backgroundMusic: bgMusic,
      isMuted: false
    });
    
    // Play background music
    if (isPlaying && !isPaused) {
      bgMusic.play().catch(e => console.log('Audio play prevented:', e));
    }
    
    return () => {
      hitSound.pause();
      successSound.pause();
      bgMusic.pause();
    };
  }, [isPlaying, isPaused]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        if (isPlaying && !isPaused) {
          pauseGame();
        } else if (isPlaying && isPaused) {
          resumeGame();
        }
      } else if (e.code === 'Enter' && !isPlaying) {
        startGame();
      } else if (e.code === 'KeyR' && isPlaying) {
        resetGame();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused, pauseGame, resumeGame, startGame, resetGame]);
  
  // Format time display
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.floor((timeInSeconds % 1) * 1000);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };
  
  return (
    <>
      <Helmet>
        <title>Driving Game | maths.k.com</title>
      </Helmet>
      
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="relative flex-grow border border-accent rounded-md overflow-hidden">
          {/* Game UI Overlay */}
          <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-start">
            <div className="flex flex-col gap-2">
              {isPlaying && (
                <>
                  <Card className="bg-black/70 p-2 text-white">
                    <div>Lap: {currentLap}</div>
                    <div>Time: {formatTime(currentTime)}</div>
                  </Card>
                </>
              )}
            </div>
            
            <div className="flex gap-2">
              {!isPlaying ? (
                <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
                  Start Race
                </Button>
              ) : isPaused ? (
                <Button onClick={resumeGame} className="bg-green-600 hover:bg-green-700">
                  Resume
                </Button>
              ) : (
                <Button onClick={pauseGame} className="bg-orange-600 hover:bg-orange-700">
                  Pause
                </Button>
              )}
              
              {isPlaying && (
                <Button onClick={resetGame} variant="destructive">
                  Reset
                </Button>
              )}
            </div>
          </div>
          
          {/* Pause Menu */}
          {isPlaying && isPaused && (
            <div className="absolute inset-0 z-20 bg-black/70 flex items-center justify-center">
              <Card className="w-full max-w-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Game Paused</h2>
                <div className="space-y-4">
                  <Button onClick={resumeGame} className="w-full bg-green-600 hover:bg-green-700">
                    Resume Game
                  </Button>
                  <Button onClick={resetGame} variant="destructive" className="w-full">
                    Quit Race
                  </Button>
                </div>
              </Card>
            </div>
          )}
          
          {/* 3D Canvas */}
          <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
            {!isPlaying && <OrbitControls />}
            {process.env.NODE_ENV === 'development' && <Stats />}
          </Canvas>
          
          {/* Controls component that handles keyboard input */}
          <Controls />
        </div>
        
        {/* Settings and stats */}
        <div className="mt-4">
          <Tabs defaultValue="settings">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="p-4 border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Difficulty</h3>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => changeDifficulty('easy')}
                      variant={settings.difficulty === 'easy' ? 'default' : 'outline'}
                      className="flex-1"
                    >
                      Easy
                    </Button>
                    <Button 
                      onClick={() => changeDifficulty('medium')}
                      variant={settings.difficulty === 'medium' ? 'default' : 'outline'}
                      className="flex-1"
                    >
                      Medium
                    </Button>
                    <Button 
                      onClick={() => changeDifficulty('hard')}
                      variant={settings.difficulty === 'hard' ? 'default' : 'outline'}
                      className="flex-1"
                    >
                      Hard
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Controls</h3>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => changeControls('arrows')}
                      variant={settings.controls === 'arrows' ? 'default' : 'outline'}
                      className="flex-1"
                    >
                      Arrow Keys
                    </Button>
                    <Button 
                      onClick={() => changeControls('wasd')}
                      variant={settings.controls === 'wasd' ? 'default' : 'outline'}
                      className="flex-1"
                    >
                      WASD
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Instructions</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Use {settings.controls === 'arrows' ? 'arrow keys' : 'WASD'} to control your car</li>
                  <li>Complete laps by driving through all checkpoints</li>
                  <li>Avoid obstacles to maintain your speed</li>
                  <li>Press ESC to pause/resume the game</li>
                  <li>Press R to reset the race</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="stats" className="p-4 border rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Race Stats</h3>
                  <ul className="space-y-2">
                    <li><span className="font-semibold">Current Lap:</span> {currentLap}</li>
                    <li><span className="font-semibold">Current Time:</span> {formatTime(currentTime)}</li>
                    <li><span className="font-semibold">Best Lap Time:</span> {stats.bestLap ? formatTime(stats.bestLap) : 'None'}</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Overall Stats</h3>
                  <ul className="space-y-2">
                    <li><span className="font-semibold">Total Laps Completed:</span> {stats.totalCompletedLaps}</li>
                    <li><span className="font-semibold">Total Crashes:</span> {stats.totalCrashes}</li>
                    <li><span className="font-semibold">Current Difficulty:</span> {settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)}</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default DrivingGame;
