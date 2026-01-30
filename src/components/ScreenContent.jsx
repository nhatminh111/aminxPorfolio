import { useState } from "react";

const codeFiles = {
  "Computers.jsx": `import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  return (
    <mesh>
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
        scale={isMobile ? 0.7 : 0.75}
        position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='demand'
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
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

export default ComputersCanvas;`,
  "Hero.jsx": `import { motion } from "framer-motion";

import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";

const Hero = () => {
  return (
    <section className={\`relative w-full h-screen mx-auto\`}>
      <div
        className={\`absolute inset-0 top-[120px]  max-w-7xl mx-auto \${styles.paddingX} flex flex-row items-start gap-5\`}
      >
        <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-[#915EFF]' />
          <div className='w-1 sm:h-80 h-40 violet-gradient' />
        </div>

        <div>
          <h1 className={\`\${styles.heroHeadText} text-white\`}>
            Hi, I'm <span className='text-[#915EFF]'>Adrian</span>
          </h1>
          <p className={\`\${styles.heroSubText} mt-2 text-white-100\`}>
            I develop 3D visuals, user <br className='sm:block hidden' />
            interfaces and web applications
          </p>
        </div>
      </div>

      <ComputersCanvas />

      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center'>
        <a href='#about'>
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2'>
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className='w-3 h-3 rounded-full bg-secondary mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;`,
  "App.jsx": `import React from "react";
import { BrowserRouter } from "react-router-dom";

import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
} from "./components";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          <Navbar />
          <Hero />
        </div>
        <About />
        <Experience />
        <Tech />
        <Works />
        <Feedbacks />
        <Contact />
        <Toaster />
      </div>
    </BrowserRouter>
  );
};

export default App;`,
};

const ScreenContent = () => {
  const [currentFile, setCurrentFile] = useState("Computers.jsx");
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (e) => {
    setScrollPosition(e.target.scrollTop);
  };

  const handleFileChange = (fileName) => {
    setCurrentFile(fileName);
    setScrollPosition(0);
  };

  const screenContentStyle = {
    width: "100%",
    height: "100%",
    background: "#1e1e1e",
    borderRadius: "4px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Courier New', monospace",
  };

  const screenHeaderStyle = {
    background: "#252526",
    padding: "8px",
    borderBottom: "1px solid #3e3e42",
  };

  const screenTabsStyle = {
    display: "flex",
    gap: "4px",
  };

  const tabStyle = (isActive) => ({
    padding: "6px 12px",
    background: isActive ? "#1e1e1e" : "#2d2d30",
    border: "none",
    borderRadius: "4px 4px 0 0",
    color: isActive ? "#ffffff" : "#cccccc",
    cursor: "pointer",
    fontSize: "11px",
    transition: "all 0.2s",
  });

  const screenBodyStyle = {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    background: "#1e1e1e",
  };

  const codeContentStyle = {
    margin: 0,
    color: "#d4d4d4",
    fontSize: "12px",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  };

  return (
    <div style={screenContentStyle}>
      <div style={screenHeaderStyle}>
        <div style={screenTabsStyle}>
          {Object.keys(codeFiles).map((fileName) => (
            <button
              key={fileName}
              onClick={() => handleFileChange(fileName)}
              style={tabStyle(currentFile === fileName)}
              onMouseEnter={(e) => {
                if (currentFile !== fileName) {
                  e.target.style.background = "#3e3e42";
                }
              }}
              onMouseLeave={(e) => {
                if (currentFile !== fileName) {
                  e.target.style.background = "#2d2d30";
                }
              }}
            >
              {fileName}
            </button>
          ))}
        </div>
      </div>
      <div 
        style={screenBodyStyle} 
        onScroll={handleScroll}
        className="screen-body-scroll"
      >
        <pre style={codeContentStyle}>
          <code>{codeFiles[currentFile]}</code>
        </pre>
      </div>
      <style>{`
        .screen-body-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .screen-body-scroll::-webkit-scrollbar-track {
          background: #1e1e1e;
        }
        .screen-body-scroll::-webkit-scrollbar-thumb {
          background: #424242;
          border-radius: 4px;
        }
        .screen-body-scroll::-webkit-scrollbar-thumb:hover {
          background: #4e4e4e;
        }
      `}</style>
    </div>
  );
};

export default ScreenContent;
