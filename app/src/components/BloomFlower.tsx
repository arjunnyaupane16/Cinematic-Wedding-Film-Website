import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PetalConfig {
  id: number;
  color: string;
  angle: number;
  distance: number;
  delay: number;
}

export function BloomFlower() {
  const containerRef = useRef<HTMLDivElement>(null);
  const flowerRef = useRef<HTMLDivElement>(null);
  const petalsRef = useRef<HTMLDivElement>(null);
  const [petals, setPetals] = useState<PetalConfig[]>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Generate petal configuration
  useEffect(() => {
    const petalCount = 8;
    const generatedPetals: PetalConfig[] = [];

    for (let i = 0; i < petalCount; i++) {
      const angle = (360 / petalCount) * i;
      const distance = 100 + Math.random() * 40;
      const radians = (angle * Math.PI) / 180;

      generatedPetals.push({
        id: i,
        color: ['#8B1538', '#A01F48', '#B03158', '#C84A68'][i % 4],
        angle,
        distance,
        delay: i * 0.08,
      });
    }

    setPetals(generatedPetals);
  }, []);

  // Setup scroll-triggered bloom animation
  useEffect(() => {
    if (!containerRef.current || !flowerRef.current || petals.length === 0) return;

    const ctx = gsap.context(() => {
      // Kill existing trigger
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }

      // Create scroll trigger for bloom
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current!,
        start: 'top center',
        end: 'center center',
        scrub: 0.6,
        markers: false,
        onUpdate: (self) => {
          const progress = self.progress; // 0 to 1

          if (!flowerRef.current) return;

          // Bloom animation (0 to 1)
          if (progress < 0.6) {
            const bloomProgress = progress / 0.6;
            flowerRef.current.classList.remove('fade-out');
            flowerRef.current.classList.add('visible');

            gsap.to(flowerRef.current, {
              opacity: 1,
              scale: 0.3 + bloomProgress * 0.7,
              duration: 0,
            });

            // Animate petals
            petals.forEach((petal) => {
              const petalEl = document.querySelector(`[data-petal-id="${petal.id}"]`) as HTMLElement;
              if (!petalEl) return;

              const radians = (petal.angle * Math.PI) / 180;
              const tx = Math.cos(radians) * petal.distance * bloomProgress;
              const ty = Math.sin(radians) * petal.distance * bloomProgress;

              gsap.to(petalEl, {
                opacity: bloomProgress * 0.9,
                x: tx,
                y: ty,
                rotation: bloomProgress * 360,
                duration: 0,
              });
            });
          } else {
            // Fade out animation (0.6 to 1)
            const fadeProgress = (progress - 0.6) / 0.4;

            gsap.to(flowerRef.current, {
              opacity: 1 - fadeProgress * 0.8,
              scale: 1 - fadeProgress * 0.2,
              duration: 0,
            });

            petals.forEach((petal) => {
              const petalEl = document.querySelector(`[data-petal-id="${petal.id}"]`) as HTMLElement;
              if (!petalEl) return;

              gsap.to(petalEl, {
                opacity: Math.max(0, 0.9 - fadeProgress),
                y: (petal.distance / 2) * fadeProgress * 1.2,
                duration: 0,
              });
            });
          }
        },
      });

      scrollTriggerRef.current = trigger;

      return () => {
        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.kill();
        }
      };
    }, containerRef);

    return () => ctx.revert();
  }, [petals]);

  // Generate floating particles on bloom
  const generateParticles = () => {
    if (!flowerRef.current) return;

    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle-effect';

      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 120;
      const duration = 2.5 + Math.random() * 1.5;

      particle.style.setProperty('--particle-tx', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--particle-ty', `${Math.sin(angle) * distance}px`);
      particle.style.setProperty('--particle-duration', `${duration}s`);
      particle.style.setProperty('--particle-distance', `${distance}px`);
      particle.style.setProperty('--particle-x', `${Math.cos(angle) * 50}px`);

      particle.innerHTML = i % 2 === 0 ? '♥' : '✿';
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.style.fontSize = `${12 + Math.random() * 8}px`;
      particle.style.color = 'rgba(139, 21, 56, 0.7)';
      particle.style.transform = 'translate(-50%, -50%)';

      flowerRef.current.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, duration * 1000);
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen w-full flex items-center justify-center py-20 px-4">
      {/* Bloom Flower Container */}
      <div
        ref={flowerRef}
        className="flower-bloom relative w-64 h-64 md:w-96 md:h-96"
        onMouseEnter={generateParticles}
      >
        {/* Center Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#8B1538] to-[#4A0D1F] shadow-lg shadow-[#8B1538]/40 flex items-center justify-center text-4xl md:text-5xl">
            ✿
          </div>
        </div>

        {/* Petals Container */}
        <div ref={petalsRef} className="flower-petals">
          {petals.map((petal) => (
            <div
              key={petal.id}
              data-petal-id={petal.id}
              className="flower-petal"
              style={{
                backgroundColor: petal.color,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotateZ(${petal.angle}deg)`,
                boxShadow: `0 4px 12px rgba(139, 21, 56, 0.4)`,
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
              }}
            />
          ))}
        </div>

        {/* Soft Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8B1538]/10 to-transparent pointer-events-none" />
      </div>

      {/* Description Text */}
      <style>{`  
        [data-petal-id] {
          will-change: transform, opacity;
        }
      `}</style>

      {/* Info Label */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-white/60 text-sm tracking-[0.2em] uppercase">Scroll to bloom</p>
      </div>
    </div>
  );
}