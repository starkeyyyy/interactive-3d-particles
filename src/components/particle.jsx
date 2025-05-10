// import React, { useRef, useMemo, useState } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { OrbitControls } from '@react-three/drei'
// import * as THREE from 'three'

// function ParticleSphere({ count = 1000, radius = 3 }) {
//   const points = useRef()
//   const particlePositions = useRef([])
//   const originalPositions = useRef([])
//   const particleVelocities = useRef([])
  
//   // Mouse interaction state
//   const [mousePosition] = useState(new THREE.Vector3())
//   const raycaster = useMemo(() => new THREE.Raycaster(), [])
//   const threshold = 1.5
  
//   // Generate initial particle positions in a sphere
//   useMemo(() => {
//     const positions = new Float32Array(count * 3)
//     particlePositions.current = []
//     originalPositions.current = []
//     particleVelocities.current = []
    
//     for (let i = 0; i < count; i++) {
//       // Calculate random position on sphere
//       const phi = Math.acos(-1 + Math.random() * 2)
//       const theta = Math.random() * Math.PI * 2
      
//       const x = radius * Math.sin(phi) * Math.cos(theta)
//       const y = radius * Math.sin(phi) * Math.sin(theta)
//       const z = radius * Math.cos(phi)
      
//       positions[i * 3] = x
//       positions[i * 3 + 1] = y
//       positions[i * 3 + 2] = z
      
//       particlePositions.current.push(new THREE.Vector3(x, y, z))
//       originalPositions.current.push(new THREE.Vector3(x, y, z))
//       particleVelocities.current.push(new THREE.Vector3(0, 0, 0))
//     }
    
//     return positions
//   }, [count, radius])
  
//   useFrame((state) => {
//     if (!points.current) return
    
//     // Update mouse position for interaction
//     const mouse = state.mouse
//     mousePosition.set(mouse.x * 5, mouse.y * 5, 0)
    
//     // Set raycaster from camera through mouse position
//     raycaster.setFromCamera(mouse, state.camera)
    
//     // Update particles
//     const positions = points.current.geometry.attributes.position.array
    
//     for (let i = 0; i < count; i++) {
//       const i3 = i * 3
//       const currentPos = particlePositions.current[i]
//       const originalPos = originalPositions.current[i]
//       const velocity = particleVelocities.current[i]
      
//       // Calculate distance to mouse ray
//       const distToRay = raycaster.ray.distanceToPoint(currentPos)
      
//       // If close to mouse, push particles away
//       if (distToRay < threshold) {
//         // Calculate direction away from ray
//         const direction = new THREE.Vector3().subVectors(currentPos, raycaster.ray.origin).normalize()
        
//         // Apply force based on distance
//         const force = (1 - distToRay / threshold) * 0.05
//         velocity.addScaledVector(direction, force)
//       }
      
//       // Add attraction force back to original position
//       const attractionForce = new THREE.Vector3().subVectors(originalPos, currentPos).multiplyScalar(0.01)
//       velocity.add(attractionForce)
      
//       // Add damping
//       velocity.multiplyScalar(0.95)
      
//       // Update position
//       currentPos.add(velocity)
      
//       // Update geometry position
//       positions[i3] = currentPos.x
//       positions[i3 + 1] = currentPos.y
//       positions[i3 + 2] = currentPos.z
//     }
    
//     points.current.geometry.attributes.position.needsUpdate = true
//   })
  
//   return (
//     <points ref={points}>
//       <bufferGeometry>
//         <bufferAttribute
//           attach="attributes-position"
//           count={count}
//           array={useMemo(() => {
//             const positions = new Float32Array(count * 3)
//             for (let i = 0; i < count; i++) {
//               const pos = particlePositions.current[i]
//               positions[i * 3] = pos.x
//               positions[i * 3 + 1] = pos.y
//               positions[i * 3 + 2] = pos.z
//             }
//             return positions
//           }, [count])}
//           itemSize={3}
//         />
//       </bufferGeometry>
//       <pointsMaterial
//         size={0.08}
//         color="#ffffff"
//         sizeAttenuation
//         transparent
//         depthWrite={false}
//       />
//     </points>
//   )
// }

// export default function Interaction() {
//   return (
//     <Canvas camera={{ position: [0, 0, 8], fov: 60 }} style={{ height: '100vh', width: '100vw' }}>
//       <color attach="background" args={['#000']} />
//       <OrbitControls makeDefault />
//       <ParticleSphere count={2000} radius={3} />
//     </Canvas>
//   )
// }

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function ParticleText({ text = "HELLO!", count = 3000 }) {
  const points = useRef()
  const particlePositions = useRef([])
  const originalPositions = useRef([])
  const particleVelocities = useRef([])
  const tempVector = useMemo(() => new THREE.Vector3(), [])
  
  // Mouse position in 3D space
  const mouse3D = useMemo(() => new THREE.Vector3(), [])
  const mouseRadius = 1.5 // Radius of influence around mouse pointer
  const repulsionStrength = 0.08 // Strength of repulsion force
  const returnStrength = 0.03 // Strength of return force to original position
  
  // Generate text points
  useMemo(() => {
    // Generate points based on a simple algorithm to form "HELLO!"
    const positions = new Float32Array(count * 3)
    particlePositions.current = []
    originalPositions.current = []
    particleVelocities.current = []
    
    // Create a simple representation of "HELLO!" using point coordinates
    const letters = [
      // H shape
      [...Array(Math.floor(count/6))].map((_, i) => {
        const t = i / (count/6)
        if (t < 0.45) return new THREE.Vector3(-4, t * 4 - 1.5, 0)
        else if (t < 0.55) return new THREE.Vector3(-4 + (t - 0.45) * 20, 0, 0)
        else return new THREE.Vector3(-2, (t - 0.55) * 4 - 1.5, 0)
      }),
      // E shape
      [...Array(Math.floor(count/6))].map((_, i) => {
        const t = i / (count/6)
        if (t < 0.3) return new THREE.Vector3(-1, t * 3 - 1.5, 0)
        else if (t < 0.4) return new THREE.Vector3(-1 + (t - 0.3) * 10, -1.5, 0)
        else if (t < 0.6) return new THREE.Vector3(-1 + (t - 0.4) * 10, 0, 0)
        else if (t < 0.7) return new THREE.Vector3(-1 + (t - 0.6) * 10, 1.5, 0)
        else return new THREE.Vector3(-1, (t - 0.7) * 10 - 1.5, 0)
      }),
      // L shape
      [...Array(Math.floor(count/6))].map((_, i) => {
        const t = i / (count/6)
        if (t < 0.7) return new THREE.Vector3(1, t * 3 - 1.5, 0)
        else return new THREE.Vector3(1 + (t - 0.7) * 6.7, -1.5, 0)
      }),
      // L shape
      [...Array(Math.floor(count/6))].map((_, i) => {
        const t = i / (count/6)
        if (t < 0.7) return new THREE.Vector3(3, t * 3 - 1.5, 0)
        else return new THREE.Vector3(3 + (t - 0.7) * 6.7, -1.5, 0)
      }),
      // O shape
      [...Array(Math.floor(count/6))].map((_, i) => {
        const t = i / (count/6)
        const angle = t * Math.PI * 2
        return new THREE.Vector3(6 + Math.cos(angle) * 0.8, Math.sin(angle) * 0.8, 0)
      }),
      // ! shape
      [...Array(Math.floor(count/6))].map((_, i) => {
        const t = i / (count/6)
        if (t < 0.8) return new THREE.Vector3(8, t * 2.5 - 0.5, 0)
        else return new THREE.Vector3(8, -1.5, 0)
      })
    ]
    
    // Flatten the letter arrays and take the number of points we need
    const allPoints = letters.flat().slice(0, count)
    
    // Fill the positions array
    for (let i = 0; i < count; i++) {
      const point = allPoints[i] || new THREE.Vector3(0, 0, 0)
      
      // Add slight randomness for more natural appearance
      const jittered = point.clone().add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        )
      )
      
      positions[i * 3] = jittered.x
      positions[i * 3 + 1] = jittered.y
      positions[i * 3 + 2] = jittered.z
      
      particlePositions.current.push(jittered.clone())
      originalPositions.current.push(jittered.clone())
      particleVelocities.current.push(new THREE.Vector3(0, 0, 0))
    }
    
    return positions
  }, [count, text])
  
  useFrame((state) => {
    if (!points.current) return
    
    // Update mouse position in 3D space
    const mouseX = state.mouse.x * state.viewport.width / 2
    const mouseY = state.mouse.y * state.viewport.height / 2
    mouse3D.set(mouseX, mouseY, 0)
    
    // Update particle positions
    const positions = points.current.geometry.attributes.position.array
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const currentPos = particlePositions.current[i]
      const originalPos = originalPositions.current[i]
      const velocity = particleVelocities.current[i]
      
      // Vector from particle to mouse
      tempVector.copy(currentPos).sub(mouse3D)
      const distanceToMouse = tempVector.length()
      
      // If particle is close to mouse, push it away
      if (distanceToMouse < mouseRadius) {
        const force = (1 - distanceToMouse / mouseRadius) * repulsionStrength
        velocity.addScaledVector(tempVector.normalize(), force)
      }
      
      // Add attraction back to original position
      tempVector.copy(originalPos).sub(currentPos)
      velocity.addScaledVector(tempVector, returnStrength)
      
      // Apply damping
      velocity.multiplyScalar(0.95)
      
      // Update position
      currentPos.add(velocity)
      
      // Update geometry position
      positions[i3] = currentPos.x
      positions[i3 + 1] = currentPos.y
      positions[i3 + 2] = currentPos.z
    }
    
    points.current.geometry.attributes.position.needsUpdate = true
  })
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={useMemo(() => {
            const positions = new Float32Array(count * 3)
            for (let i = 0; i < count; i++) {
              const pos = particlePositions.current[i]
              positions[i * 3] = pos.x
              positions[i * 3 + 1] = pos.y
              positions[i * 3 + 2] = pos.z
            }
            return positions
          }, [count])}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#88ccff"
        sizeAttenuation
        transparent
        depthWrite={false}
      />
    </points>
  )
}

export default function Interaction() {
  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 60 }} style={{ height: '100vh', width: '100vw' }}>
      <color attach="background" args={['#111']} />
      <OrbitControls makeDefault />
      <ParticleText text="hello" count={4000} />
    </Canvas>
  )
}