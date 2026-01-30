import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";

import CanvasLoader from "../Loader";
import ScreenContent from "../ScreenContent";

// Component để animate RGB lights
const RGBLights = ({ scene }) => {
  const rgbMeshesRef = useRef([]);
  const timeRef = useRef(0);

  useEffect(() => {
    // Tìm tất cả các mesh có thể là RGB lights (LOẠI TRỪ MÀN HÌNH)
    const rgbMeshes = [];
    
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const name = child.name.toLowerCase();
        const materialName = child.material?.name?.toLowerCase() || "";
        
        // LOẠI TRỪ màn hình (monitor, screen) và Material.074_30
        const isMonitor = 
          name.includes("monitor") || 
          name.includes("screen") || 
          name.includes("display") ||
          materialName.includes("material.074_30");
        
        if (isMonitor) {
          return; // Bỏ qua màn hình
        }
        
        // Tìm các mesh có tên chứa từ khóa liên quan đến RGB/light/LED
        // hoặc có material với emissive
        if (
          name.includes("rgb") ||
          name.includes("light") ||
          name.includes("led") ||
          name.includes("speaker") ||
          name.includes("keyboard") ||
          name.includes("case") ||
          name.includes("pc") ||
          name.includes("fan") ||
          (child.material && 
           (Array.isArray(child.material) 
             ? child.material.some(m => m && m.name && !m.name.includes("Material.074_30") && m.emissive && (m.emissive.r > 0 || m.emissive.g > 0 || m.emissive.b > 0))
             : child.material.emissive && 
               !materialName.includes("material.074_30") &&
               (child.material.emissive.r > 0 || 
                child.material.emissive.g > 0 || 
                child.material.emissive.b > 0)))
        ) {
          // Tạo material mới với emissive nếu chưa có
          if (Array.isArray(child.material)) {
            child.material = child.material.map((mat) => {
              if (mat && mat.name && mat.name.includes("Material.074_30")) {
                return mat; // Giữ nguyên material màn hình
              }
              const newMat = mat.clone();
              if (!newMat.emissive) {
                newMat.emissive = new THREE.Color(0, 0, 0);
              }
              if (newMat.emissiveIntensity === undefined) {
                newMat.emissiveIntensity = 1;
              }
              return newMat;
            });
          } else {
            if (materialName.includes("material.074_30")) {
              return; // Bỏ qua material màn hình
            }
            const newMat = child.material.clone();
            if (!newMat.emissive) {
              newMat.emissive = new THREE.Color(0, 0, 0);
            }
            if (newMat.emissiveIntensity === undefined) {
              newMat.emissiveIntensity = 1;
            }
            child.material = newMat;
          }
          rgbMeshes.push(child);
        }
      }
    });

    rgbMeshesRef.current = rgbMeshes;
  }, [scene]);

  useFrame((state, delta) => {
    timeRef.current += delta;
    
    rgbMeshesRef.current.forEach((mesh, index) => {
      if (mesh.material) {
        const materials = Array.isArray(mesh.material) 
          ? mesh.material 
          : [mesh.material];
        
        materials.forEach((material) => {
          if (material && material.emissive) {
            // Tạo hiệu ứng RGB wave với offset khác nhau cho mỗi mesh
            const offset = index * 0.5;
            const speed = 1.5;
            const r = Math.sin(timeRef.current * speed + offset) * 0.5 + 0.5;
            const g = Math.sin(timeRef.current * speed + offset + 2.09) * 0.5 + 0.5;
            const b = Math.sin(timeRef.current * speed + offset + 4.18) * 0.5 + 0.5;
            
            // Tăng cường độ để RGB nổi bật hơn
            material.emissive.setRGB(r * 0.8, g * 0.8, b * 0.8);
            if (material.emissiveIntensity !== undefined) {
              material.emissiveIntensity = 2;
            }
          }
        });
      }
    });
  });

  return null;
};

// RGB Point Lights để tạo hiệu ứng RGB xung quanh PC
const RGBPointLights = () => {
  const light1Ref = useRef();
  const light2Ref = useRef();
  const light3Ref = useRef();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;
    const speed = 1.5;

    // PC case RGB light
    if (light1Ref.current) {
      const r = Math.sin(timeRef.current * speed) * 0.5 + 0.5;
      const g = Math.sin(timeRef.current * speed + 2.09) * 0.5 + 0.5;
      const b = Math.sin(timeRef.current * speed + 4.18) * 0.5 + 0.5;
      light1Ref.current.color.setRGB(r, g, b);
    }

    // Speaker 1 RGB light
    if (light2Ref.current) {
      const offset = 1.0;
      const r = Math.sin(timeRef.current * speed + offset) * 0.5 + 0.5;
      const g = Math.sin(timeRef.current * speed + offset + 2.09) * 0.5 + 0.5;
      const b = Math.sin(timeRef.current * speed + offset + 4.18) * 0.5 + 0.5;
      light2Ref.current.color.setRGB(r, g, b);
    }

    // Speaker 2 & Keyboard RGB light
    if (light3Ref.current) {
      const offset = 2.0;
      const r = Math.sin(timeRef.current * speed + offset) * 0.5 + 0.5;
      const g = Math.sin(timeRef.current * speed + offset + 2.09) * 0.5 + 0.5;
      const b = Math.sin(timeRef.current * speed + offset + 4.18) * 0.5 + 0.5;
      light3Ref.current.color.setRGB(r, g, b);
    }
  });

  return (
    <>
      {/* PC case RGB light */}
      <pointLight
        ref={light1Ref}
        position={[0, -2.5, -1]}
        intensity={2}
        distance={3}
        decay={2}
      />
      {/* Speaker 1 RGB light */}
      <pointLight
        ref={light2Ref}
        position={[-1.5, -2.5, -1]}
        intensity={1.5}
        distance={2.5}
        decay={2}
      />
      {/* Speaker 2 & Keyboard RGB light */}
      <pointLight
        ref={light3Ref}
        position={[1.5, -2.5, -1]}
        intensity={1.5}
        distance={2.5}
        decay={2}
      />
    </>
  );
};

// Component để hiển thị screen content (cửa sổ code bên cạnh màn hình)
const CodeWindow = ({ isMobile }) => {
  // Vị trí cửa sổ code BÊN CẠNH màn hình (bên phải)
  const codeWindowPosition = isMobile 
    ? [1.2, -1.5, -1.8] 
    : [1.5, -1.8, -1.2];
  const codeWindowScale = isMobile ? 0.50 : 0.3;

  return (
    <Html
      position={codeWindowPosition}
      transform
      occlude
      distanceFactor={codeWindowScale}
      style={{
        width: "350px",
        height: "250px",
        pointerEvents: "auto",
      }}
    >
      <ScreenContent />
    </Html>
  );
};

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");
  const groupRef = useRef();

  return (
    <group ref={groupRef}>
      <hemisphereLight intensity={0.15} groundColor='black' />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.5 : 0.75}  // Giảm scale trên mobile để PC hiển thị đầy đủ
        position={isMobile ? [0, -2.0, -0.6] : [0, -3, -1.5]}  // Điều chỉnh position cho mobile
        rotation={isMobile ? [-0.01, -0.15, -0.05] : [-0.01, -0.2, -0.1]}  // Điều chỉnh rotation cho mobile
      />
      <RGBLights scene={computer.scene} />
      <RGBPointLights />
    </group>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    // Check for mobile and tablet
    const checkScreenSize = () => {
      const mobile = window.matchMedia("(max-width: 640px)").matches;
      const tablet = window.matchMedia("(max-width: 1024px) and (min-width: 641px)").matches;
      setIsMobile(mobile);
      setIsTablet(tablet);
    };

    checkScreenSize();

    const mobileQuery = window.matchMedia("(max-width: 640px)");
    const tabletQuery = window.matchMedia("(max-width: 1024px) and (min-width: 641px)");

    const handleMobileChange = (e) => setIsMobile(e.matches);
    const handleTabletChange = (e) => setIsTablet(e.matches);

    mobileQuery.addEventListener("change", handleMobileChange);
    tabletQuery.addEventListener("change", handleTabletChange);

    return () => {
      mobileQuery.removeEventListener("change", handleMobileChange);
      tabletQuery.removeEventListener("change", handleTabletChange);
    };
  }, []);

  // Điều chỉnh camera và FOV cho mobile/tablet
  const cameraConfig = isMobile 
    ? { position: [15, 2, 4], fov: 35 }  // Mobile: camera gần hơn, FOV rộng hơn
    : isTablet
    ? { position: [18, 2.5, 4.5], fov: 30 }  // Tablet: camera trung bình
    : { position: [20, 3, 5], fov: 25 };  // Desktop: camera mặc định

  return (
    <Canvas
      frameloop='always'
      shadows
      dpr={isMobile ? [1, 1.5] : [1, 2]}  // Giảm DPR trên mobile để tăng performance
      camera={cameraConfig}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
