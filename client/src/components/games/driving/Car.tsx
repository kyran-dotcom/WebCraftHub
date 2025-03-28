import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDrivingGame } from '../../../lib/stores/useDrivingGame';

const Car = () => {
  const { 
    isPlaying, 
    carPosition, 
    carRotation, 
    carSpeed 
  } = useDrivingGame();
  
  const carRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);
  
  // Animate the car and wheels
  useFrame((_, delta) => {
    if (!carRef.current) return;
    
    // Update car position and rotation
    carRef.current.position.set(carPosition.x, carPosition.y, carPosition.z);
    carRef.current.rotation.y = carRotation;
    
    // Rotate wheels based on speed
    wheelsRef.current.forEach(wheel => {
      wheel.rotation.z -= carSpeed * delta * 0.5;
    });
  });
  
  return (
    <group ref={carRef}>
      {/* Car body */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[1.5, 0.5, 3]} />
        <meshStandardMaterial color="#e63946" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Car roof/cabin */}
      <mesh castShadow position={[0, 0.8, -0.2]}>
        <boxGeometry args={[1.2, 0.5, 1.5]} />
        <meshStandardMaterial color="#e63946" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Windshield */}
      <mesh castShadow position={[0, 0.7, 0.8]}>
        <boxGeometry args={[1.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#a8dadc" transparent opacity={0.7} />
      </mesh>
      
      {/* Wheels - front left */}
      <mesh 
        castShadow 
        position={[-0.8, 0.25, 1]} 
        rotation={[0, 0, Math.PI / 2]}
        ref={el => wheelsRef.current[0] = el as THREE.Mesh}
      >
        <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Wheels - front right */}
      <mesh 
        castShadow 
        position={[0.8, 0.25, 1]} 
        rotation={[0, 0, Math.PI / 2]}
        ref={el => wheelsRef.current[1] = el as THREE.Mesh}
      >
        <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Wheels - rear left */}
      <mesh 
        castShadow 
        position={[-0.8, 0.25, -1]} 
        rotation={[0, 0, Math.PI / 2]}
        ref={el => wheelsRef.current[2] = el as THREE.Mesh}
      >
        <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Wheels - rear right */}
      <mesh 
        castShadow 
        position={[0.8, 0.25, -1]} 
        rotation={[0, 0, Math.PI / 2]}
        ref={el => wheelsRef.current[3] = el as THREE.Mesh}
      >
        <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Headlights */}
      <mesh castShadow position={[0.5, 0.4, 1.51]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial color="#f1faee" emissive="#f1faee" emissiveIntensity={isPlaying ? 1 : 0} />
      </mesh>
      
      <mesh castShadow position={[-0.5, 0.4, 1.51]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial color="#f1faee" emissive="#f1faee" emissiveIntensity={isPlaying ? 1 : 0} />
      </mesh>
      
      {/* Taillights */}
      <mesh castShadow position={[0.5, 0.4, -1.51]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial color="#e63946" emissive="#e63946" emissiveIntensity={0.8} />
      </mesh>
      
      <mesh castShadow position={[-0.5, 0.4, -1.51]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial color="#e63946" emissive="#e63946" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
};

export default Car;
