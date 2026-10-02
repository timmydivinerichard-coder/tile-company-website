'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, PresentationControls } from '@react-three/drei';
import { ReactLenis } from '@studio-freight/react-lenis';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. NAVIGATION
// ==========================================
function Navigation() {
  return (
    <nav className="fixed top-0 left-0 w-full p-8 z-50 flex justify-between items-center mix-blend-difference text-white pointer-events-none">
      <div className="text-2xl font-bold tracking-tighter pointer-events-auto">ABLE</div>
      <button className="text-sm font-medium tracking-widest uppercase hover:opacity-70 transition-opacity pointer-events-auto">
        Menu
      </button>
    </nav>
  );
}

// ==========================================
// 2. 3D HERO SECTION
// ==========================================
function FloatingTiles() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (state.pointer.x * Math.PI) / 10, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, (state.pointer.y * Math.PI) / 10, 0.05);
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 15 }).map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={1.5} floatIntensity={2}>
          <mesh 
            position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10]}
            rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
          >
            <boxGeometry args={[2, 3, 0.1]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#1a1a1a" : "#dcd9d1"} roughness={0.2} metalness={0.8} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Hero3D() {
  return (
    <section className="relative h-screen w-full bg-[#0a0a0a]">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <PresentationControls global polar={[-0.1, 0.1]} azimuth={[-0.2, 0.2]}>
            <FloatingTiles />
          </PresentationControls>
        </Canvas>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-[12vw] leading-[0.85] font-bold text-center tracking-tighter mix-blend-difference text-white"
        >
          SURFACES<br />THAT SHAPE<br />LIVES.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-8 text-lg md:text-xl font-light tracking-wide text-[#dcd9d1]"
        >
          Tiles, interiors and spaces designed to transform how you live.
        </motion.p>
      </div>
    </section>
  );
}

// ==========================================
// 3. TILE EXPLORER
// ==========================================
const TILES = [
  { id: 1, name: 'Calacatta Gold', type: 'Marble', use: 'Floor & Wall', color: 'bg-stone-200' },
  { id: 2, name: 'Nero Marquina', type: 'Polished Stone', use: 'Statement Wall', color: 'bg-neutral-900' },
  { id: 3, name: 'Travertine Raw', type: 'Textured', use: 'Exterior & Floor', color: 'bg-[#d2c5b3]' },
  { id: 4, name: 'Onyx Emerald', type: 'Polished', use: 'Bathroom Surface', color: 'bg-emerald-900' },
];

function TileExplorer() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <section className="py-32 px-8 min-h-screen bg-[#f5f5f0] text-[#0a0a0a]">
      <h2 className="text-[6vw] font-bold leading-none tracking-tighter mb-24">FIND YOUR SURFACE.</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {TILES.map((tile) => (
          <motion.div
            key={tile.id}
            layoutId={`tile-${tile.id}`}
            onClick={() => setSelectedId(tile.id)}
            whileHover={{ y: -20, rotateX: 5, rotateY: -5, scale: 1.05 }}
            className={`cursor-pointer h-[60vh] rounded-sm ${tile.color} shadow-2xl relative overflow-hidden group`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white">
              <h3 className="text-2xl font-bold">{tile.name}</h3>
              <p className="text-sm tracking-widest uppercase">{tile.type}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-md cursor-pointer"
            onClick={() => setSelectedId(null)}
          >
            {TILES.filter(t => t.id === selectedId).map(tile => (
              <motion.div
                key="modal"
                layoutId={`tile-${tile.id}`}
                className={`w-full max-w-5xl h-[80vh] ${tile.color} p-12 flex flex-col justify-end text-white shadow-2xl`}
              >
                <h2 className="text-[5vw] font-bold leading-none">{tile.name}</h2>
                <div className="flex gap-12 mt-8 text-lg border-t border-white/20 pt-8">
                  <div><span className="opacity-50 block text-sm">Finish</span>{tile.type}</div>
                  <div><span className="opacity-50 block text-sm">Ideal Use</span>{tile.use}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ==========================================
// 4. HORIZONTAL PROJECTS
// ==========================================
const PROJECTS = [
  { title: "Luxury Residence", material: "Calacatta Floor", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80" },
  { title: "Statement Space", material: "Matte Porcelain", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80" },
  { title: "Modern Bathroom", material: "Textured Stone", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&q=80" },
];

function HorizontalProjects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.project-panel');
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          end: () => "+=" + scrollRef.current?.offsetWidth
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="h-screen w-full bg-[#0a0a0a] text-white overflow-hidden flex flex-col">
      <div className="p-8 absolute top-0 left-0 z-10 mix-blend-difference">
        <h2 className="text-xl tracking-widest font-bold uppercase">Spaces We've Shaped</h2>
      </div>
      
      <div ref={scrollRef} className="flex h-full w-[300vw]">
        {PROJECTS.map((project, i) => (
          <div key={i} className="project-panel w-screen h-full relative flex items-center justify-center p-8 md:p-24">
            <div className="absolute inset-0 bg-neutral-900 overflow-hidden">
              <div 
                className="w-full h-full bg-cover bg-center opacity-60 scale-105 hover:scale-100 transition-transform duration-1000" 
                style={{ backgroundImage: `url(${project.img})` }} 
              />
            </div>
            <div className="relative z-10 w-full flex flex-col items-start justify-end h-full pb-12">
              <h3 className="text-[8vw] font-bold leading-none tracking-tighter uppercase">{project.title}</h3>
              <p className="text-2xl mt-4 font-light tracking-wide">{project.material}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ==========================================
// 5. SERVICES INTERACTIVE
// ==========================================
const SERVICES = [
  { id: '01', title: 'Tile Supply', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=80' },
  { id: '02', title: 'Interior Design', image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1600&q=80' },
  { id: '03', title: 'Space Finishing', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80' },
  { id: '04', title: 'Architecture', image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1600&q=80' },
];

function ServicesInteractive() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  return (
    <section className="relative h-screen w-full bg-[#f5f5f0] flex items-center px-8 md:px-24 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={hoveredIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.4, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${SERVICES[hoveredIndex].image})` }}
        />
      </AnimatePresence>

      <div className="relative z-10 w-full">
        <h2 className="text-sm font-bold tracking-widest uppercase mb-16 text-[#0a0a0a]">From Surface to Space.</h2>
        <ul className="flex flex-col gap-4">
          {SERVICES.map((service, index) => (
            <li 
              key={service.id}
              onMouseEnter={() => setHoveredIndex(index)}
              className="group cursor-pointer flex items-baseline gap-8 border-b border-black/10 pb-4"
            >
              <span className="text-xl font-light opacity-50 group-hover:opacity-100 transition-opacity text-[#0a0a0a]">{service.id}</span>
              <span className="text-[5vw] font-bold tracking-tighter text-[#0a0a0a] group-hover:pl-8 transition-all duration-500 ease-out">
                {service.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ==========================================
// 6. FOOTER CTA
// ==========================================
const WORDS = ["A TILE.", "A SURFACE.", "A ROOM.", "A HOME."];

function FooterCTA() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative h-screen w-full bg-[#0a0a0a] text-white flex flex-col justify-between overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 5, 2]} />
          <PresentationControls autoRotate autoRotateSpeed={2}>
            <mesh>
              <boxGeometry args={[4, 4, 0.2]} />
              <meshStandardMaterial color="#2a2a2a" roughness={0.1} />
            </mesh>
          </PresentationControls>
        </Canvas>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center mt-20">
        <motion.div 
          key={wordIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-[8vw] font-bold tracking-tighter mb-8 h-[10vw]"
        >
          {WORDS[wordIndex]}
        </motion.div>
        
        <h2 className="text-3xl md:text-5xl font-light tracking-wide mb-12">LET’S SHAPE YOUR SPACE.</h2>
        
        <div className="flex gap-6">
          <button className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform cursor-pointer pointer-events-auto">
            Start a Project
          </button>
          <button className="px-8 py-4 bg-transparent border border-white rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-colors cursor-pointer pointer-events-auto">
            WhatsApp Us
          </button>
        </div>
      </div>

      <div className="relative z-10 p-8 flex flex-col md:flex-row justify-between items-start md:items-end border-t border-white/10 text-sm tracking-widest uppercase gap-8">
        <div>
          <p>ABLE Integrated Homes & Interiors</p>
          <p className="opacity-50 mt-2">Lagos, Nigeria</p>
        </div>
        <div className="flex gap-8 pointer-events-auto">
          <a href="#" className="hover:opacity-70 transition-opacity">Instagram</a>
          <a href="#" className="hover:opacity-70 transition-opacity">Email</a>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// MAIN EXPORT
// ==========================================
export default function Home() {
  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
      <main className="relative w-full overflow-hidden bg-[#0a0a0a] text-[#f5f5f0] selection:bg-white selection:text-black">
        <Navigation />
        <Hero3D />
        <TileExplorer />
        <HorizontalProjects />
        <ServicesInteractive />
        <FooterCTA />
      </main>
    </ReactLenis>
  );
}