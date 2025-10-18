// // components/Product3DViewer.jsx
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Environment } from "@react-three/drei";
// import * as THREE from "three";

// const Product3DViewer = ({ imageUrl }) => {
//   return (
//     <div className="h-96 w-full bg-gray-100 rounded-lg overflow-hidden">
//       <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
//         <ambientLight intensity={0.5} />
//         <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />

//         <mesh rotation={[-Math.PI / 2, 0, 0]}>
//           <planeGeometry args={[2, 2, 32, 32]} />
//           <meshStandardMaterial
//             map={imageUrl && new THREE.TextureLoader().load(imageUrl)}
//             side={THREE.DoubleSide}
//             displacementMap={
//               imageUrl && new THREE.TextureLoader().load(imageUrl)
//             }
//             displacementScale={0.1}
//           />
//         </mesh>

//         <OrbitControls
//           enableZoom={true}
//           enablePan={true}
//           enableRotate={true}
//           minPolarAngle={Math.PI / 6}
//           maxPolarAngle={Math.PI / 2}
//         />
//         <Environment preset="city" />
//       </Canvas>
//     </div>
//   );
// };

// export default Product3DViewer;
// components/Product3DViewer.jsx
// import { Canvas, useLoader } from "@react-three/fiber";
// import { OrbitControls, Environment, Loader } from "@react-three/drei";
// import * as THREE from "three";
// import { useEffect } from "react";

// const Product3DViewer = ({ imageUrl }) => {
//   const texture = useLoader(THREE.TextureLoader, imageUrl);
//   const displacementMap = useLoader(THREE.TextureLoader, imageUrl);

//   useEffect(() => {
//     if (texture && displacementMap) {
//       texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//       texture.anisotropy = 16;
//       displacementMap.wrapS = displacementMap.wrapT = THREE.RepeatWrapping;
//     }
//   }, [texture, displacementMap]);

//   return (
//     <div className="h-96 w-full bg-gray-100 rounded-lg overflow-hidden relative">
//       <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
//         <ambientLight intensity={1.2} />
//         <spotLight
//           position={[10, 10, 10]}
//           intensity={1.5}
//           penumbra={1}
//           castShadow
//         />

//         <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
//           <planeGeometry args={[3, 3, 128, 128]} />
//           <meshStandardMaterial
//             map={texture}
//             displacementMap={displacementMap}
//             displacementScale={0.08}
//             roughness={0.5}
//             metalness={0.2}
//             side={THREE.DoubleSide}
//           />
//         </mesh>

//         <OrbitControls
//           enableZoom={true}
//           enablePan={true}
//           enableRotate={true}
//           minDistance={1.5}
//           maxDistance={5}
//           minPolarAngle={Math.PI / 6}
//           maxPolarAngle={Math.PI / 2}
//         />
//         <Environment preset="studio" />
//       </Canvas>

//       <Loader
//         containerStyles={{ background: "transparent" }}
//         innerStyles={{ backgroundColor: "#4A4947" }}
//         barStyles={{ backgroundColor: "#D8D2C2" }}
//         dataStyles={{ color: "#4A4947" }}
//       />
//     </div>
//   );
// };

// export default Product3DViewer;
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, Loader } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

const Product3DViewer = ({ imageUrl, displacementScale = 0.01 }) => {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const displacementMap = useLoader(THREE.TextureLoader, imageUrl);

  const processedTexture = useMemo(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = 16;
    }
    return texture;
  }, [texture]);

  const processedDisplacementMap = useMemo(() => {
    if (displacementMap) {
      displacementMap.wrapS = displacementMap.wrapT = THREE.RepeatWrapping;
    }
    return displacementMap;
  }, [displacementMap]);

  return (
    <div className="h-96 w-full bg-gray-100 rounded-lg overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <spotLight
          position={[10, 10, 10]}
          intensity={1.2}
          penumbra={0.5}
          castShadow
        />

        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
          <planeGeometry args={[3, 3, 64, 64]} />
          <meshStandardMaterial
            map={processedTexture}
            displacementMap={processedDisplacementMap}
            displacementScale={displacementScale}
            roughness={0.5}
            metalness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>

        <OrbitControls enableDamping dampingFactor={0.1} />
        <Environment preset="studio" />
      </Canvas>

      <Loader
        containerStyles={{ background: "transparent" }}
        innerStyles={{ backgroundColor: "#4A4947" }}
        barStyles={{ backgroundColor: "#D8D2C2" }}
        dataStyles={{ color: "#4A4947" }}
      />
    </div>
  );
};

export default Product3DViewer;
