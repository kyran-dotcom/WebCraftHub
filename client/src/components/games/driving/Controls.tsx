import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { KeyboardControls, useKeyboardControls } from '@react-three/drei';
import { useDrivingGame } from '../../../lib/stores/useDrivingGame';

// Define control keys
enum ControlKeys {
  forward = 'forward',
  backward = 'backward',
  left = 'left', 
  right = 'right',
}

const Controls = () => {
  const { 
    isPlaying, 
    isPaused, 
    settings,
    updateCarPosition, 
    accelerate, 
    brake, 
    steer 
  } = useDrivingGame();
  
  // Map current key presses
  const [, getKeys] = useKeyboardControls<ControlKeys>();
  
  // Time tracking for frame-rate independent movement
  const lastTimeRef = useRef<number | null>(null);
  
  // Control mappings based on user preference
  const keyMap = [
    // Arrow keys
    { name: ControlKeys.forward, keys: settings.controls === 'arrows' ? ['ArrowUp'] : ['KeyW'] },
    { name: ControlKeys.backward, keys: settings.controls === 'arrows' ? ['ArrowDown'] : ['KeyS'] },
    { name: ControlKeys.left, keys: settings.controls === 'arrows' ? ['ArrowLeft'] : ['KeyA'] },
    { name: ControlKeys.right, keys: settings.controls === 'arrows' ? ['ArrowRight'] : ['KeyD'] },
  ];
  
  // Log control scheme for debugging
  useEffect(() => {
    console.log(`Control scheme set to: ${settings.controls}`);
  }, [settings.controls]);
  
  // Game loop
  useFrame((state) => {
    if (!isPlaying || isPaused) {
      lastTimeRef.current = null;
      return;
    }
    
    // Calculate time delta for smooth movement
    const currentTime = state.clock.getElapsedTime();
    if (lastTimeRef.current === null) {
      lastTimeRef.current = currentTime;
      return;
    }
    
    const delta = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;
    
    const keys = getKeys();
    
    // Handle input
    if (keys.forward) {
      accelerate(1);
      // console.log('Accelerating');
    }
    
    if (keys.backward) {
      brake(1);
      // console.log('Braking');
    }
    
    if (keys.left) {
      steer(-1);
      // console.log('Steering left');
    }
    
    if (keys.right) {
      steer(1);
      // console.log('Steering right');
    }
    
    // Apply physics and movement
    updateCarPosition(delta);
  });
  
  return (
    <KeyboardControls map={keyMap}>
      {/* This component doesn't render anything, it just handles controls */}
    </KeyboardControls>
  );
};

export default Controls;
