import { useEffect, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface Obstacle {
  id: number;
  position: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  type: 'tree' | 'rock' | 'cone';
}

interface Checkpoint {
  id: number;
  position: { x: number; z: number };
  passed: boolean;
}

interface TrackProps {
  track: {
    obstacles: Obstacle[];
    checkpoints: Checkpoint[];
    trackWidth: number;
    trackLength: number;
  };
}

const Track = ({ track }: TrackProps) => {
  // Load textures
  const asphaltTexture = useTexture('/textures/asphalt.png');
  const grassTexture = useTexture('/textures/grass.png');
  const woodTexture = useTexture('/textures/wood.jpg');
  
  // Set up texture repeat
  useEffect(() => {
    // Repeat textures for tiling
    if (asphaltTexture) {
      asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
      asphaltTexture.repeat.set(track.trackLength / 5, track.trackWidth / 5);
    }
    
    if (grassTexture) {
      grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
      grassTexture.repeat.set(100, 100);
    }
    
    if (woodTexture) {
      woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
      woodTexture.repeat.set(1, 1);
    }
  }, [asphaltTexture, grassTexture, woodTexture, track.trackLength, track.trackWidth]);
  
  // Pre-compute obstacle geometries
  const geometries = useMemo(() => {
    return {
      tree: new THREE.CylinderGeometry(0, 1, 3, 4),
      rock: new THREE.DodecahedronGeometry(1, 0),
      cone: new THREE.ConeGeometry(0.5, 1, 8)
    };
  }, []);
  
  // Generate checkpoints
  const checkpoints = useMemo(() => {
    return track.checkpoints.map((checkpoint) => (
      <group key={`checkpoint-${checkpoint.id}`} position={[checkpoint.position.x, 0, checkpoint.position.z]}>
        {/* Checkpoint marker */}
        <mesh position={[0, 2, 0]}>
          <torusGeometry args={[5, 0.2, 8, 16]} />
          <meshStandardMaterial 
            color={checkpoint.passed ? "#4CAF50" : "#FFC107"} 
            emissive={checkpoint.passed ? "#4CAF50" : "#FFC107"}
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
        
        {/* Checkpoint poles */}
        <mesh position={[-5, 2, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 4, 8]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
        
        <mesh position={[5, 2, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 4, 8]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
      </group>
    ));
  }, [track.checkpoints]);
  
  return (
    <group>
      {/* Road surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -track.trackLength / 2]} receiveShadow>
        <planeGeometry args={[track.trackWidth, track.trackLength]} />
        <meshStandardMaterial 
          map={asphaltTexture} 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Road edges */}
      <mesh position={[-track.trackWidth / 2, 0.05, -track.trackLength / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.5, track.trackLength, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      <mesh position={[track.trackWidth / 2, 0.05, -track.trackLength / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.5, track.trackLength, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Center line */}
      <mesh position={[0, 0.05, -track.trackLength / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.25, track.trackLength]} />
        <meshStandardMaterial color="white" transparent opacity={0.8} />
      </mesh>
      
      {/* Obstacles */}
      {track.obstacles.map((obstacle) => (
        <mesh
          key={`obstacle-${obstacle.id}`}
          position={[obstacle.position.x, obstacle.position.y, obstacle.position.z]}
          scale={[obstacle.scale.x, obstacle.scale.y, obstacle.scale.z]}
          castShadow
          geometry={geometries[obstacle.type]}
        >
          <meshStandardMaterial 
            color={
              obstacle.type === 'tree' ? '#2d4f1e' : 
              obstacle.type === 'rock' ? '#777777' : 
              '#ff4d00'
            }
            map={obstacle.type === 'tree' ? woodTexture : undefined}
          />
        </mesh>
      ))}
      
      {/* Checkpoints */}
      {checkpoints}
      
      {/* Starting line */}
      <mesh position={[0, 0.05, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[track.trackWidth, 2]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      <mesh position={[0, 0.06, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[track.trackWidth, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Finish line (same as starting line in this case) */}
      <mesh position={[0, 0.05, -1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[track.trackWidth, 2]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      <mesh position={[0, 0.06, -1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[track.trackWidth, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
};

export default Track;
