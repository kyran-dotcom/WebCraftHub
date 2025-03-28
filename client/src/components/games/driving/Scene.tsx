import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sky, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useDrivingGame } from '../../../lib/stores/useDrivingGame';
import Car from './Car';
import Track from './Track';
import { useAudio } from '../../../lib/stores/useAudio';

const Scene = () => {
  const { camera } = useThree();
  const { 
    isPlaying, 
    carPosition, 
    carRotation, 
    track,
    currentLap
  } = useDrivingGame();
  
  const { playSuccess } = useAudio();
  const prevLapRef = useRef(0);
  
  // Set up camera
  useEffect(() => {
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  // Handle camera following the car
  useFrame((_, delta) => {
    if (isPlaying) {
      // Calculate camera position behind the car
      const cameraOffset = new THREE.Vector3(
        -Math.sin(carRotation) * 8,
        4,
        -Math.cos(carRotation) * 8
      );
      
      // Smoothly move camera to follow car
      camera.position.lerp(
        new THREE.Vector3(
          carPosition.x + cameraOffset.x,
          carPosition.y + cameraOffset.y,
          carPosition.z + cameraOffset.z
        ),
        5 * delta
      );
      
      // Camera looks ahead of the car
      const lookTarget = new THREE.Vector3(
        carPosition.x + Math.sin(carRotation) * 10,
        carPosition.y + 1,
        carPosition.z + Math.cos(carRotation) * 10
      );
      
      camera.lookAt(lookTarget);
    }
    
    // Check for lap completion
    if (currentLap > prevLapRef.current) {
      playSuccess();
      prevLapRef.current = currentLap;
    }
  });
  
  return (
    <>
      {/* Environment */}
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0.5} azimuth={0.25} />
      <Environment preset="sunset" />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Game elements */}
      <Car />
      <Track track={track} />
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.1, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#4a801e" />
      </mesh>
    </>
  );
};

export default Scene;
