import { BrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

import { Hero, Navbar } from "./components";
import CanvasLoader from "./components/Loader";

// Lazy load các components không cần thiết ngay
const About = lazy(() => import("./components/About").then(module => ({ default: module.About })));
const Experience = lazy(() => import("./components/Experience").then(module => ({ default: module.Experience })));
const Tech = lazy(() => import("./components/Tech").then(module => ({ default: module.Tech })));
const Contact = lazy(() => import("./components/Contact").then(module => ({ default: module.Contact })));
const StarsCanvas = lazy(() => import("./components/canvas/Stars").then(module => ({ default: module.StarsCanvas })));

const App = () => {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          <Navbar />
          <Hero />
        </div>
        <Suspense fallback={<CanvasLoader />}>
          <About />
        </Suspense>
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
        <Suspense fallback={null}>
          <Tech />
        </Suspense>
        <Suspense fallback={null}>
          <div className='relative z-0'>
            <Contact />
            <StarsCanvas />
          </div>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
