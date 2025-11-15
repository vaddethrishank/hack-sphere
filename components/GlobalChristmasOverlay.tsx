import React, { useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  type: 'snowflake' | 'sparkle' | 'light';
}

/**
 * GlobalChristmasOverlay: An immersive, always-present Christmas theme backdrop.
 * Covers the entire app with:
 * - Animated snowflakes falling continuously
 * - Twinkling particles/sparkles
 * - Pulsing Christmas lights
 * - Festive gradient background
 * Fixed positioning with low z-index (z-10) so navbar (z-50) and content stay on top.
 */
const GlobalChristmasOverlay: React.FC = () => {
  // Generate particles memoized so they don't constantly regenerate
  const particles: Particle[] = useMemo(() => {
    const result: Particle[] = [];
    
    // Snowflakes - slow, large, falling
    for (let i = 0; i < 20; i++) {
      result.push({
        id: `snow-${i}` as any,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 8 + Math.random() * 16,
        opacity: 0.5 + Math.random() * 0.5,
        duration: 12 + Math.random() * 10,
        delay: -(Math.random() * 15),
        type: 'snowflake',
      });
    }

    // Sparkles - fast, tiny, everywhere
    for (let i = 0; i < 30; i++) {
      result.push({
        id: `sparkle-${i}` as any,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        opacity: 0.6 + Math.random() * 0.4,
        duration: 0.8 + Math.random() * 1.2,
        delay: -(Math.random() * 2),
        type: 'sparkle',
      });
    }

    // Festive lights - medium, pulsing
    for (let i = 0; i < 12; i++) {
      result.push({
        id: `light-${i}` as any,
        x: Math.random() * 100,
        y: Math.random() * 80, // Keep lights mostly in upper half
        size: 4 + Math.random() * 8,
        opacity: 0.7,
        duration: 2 + Math.random() * 1.5,
        delay: -(Math.random() * 2),
        type: 'light',
      });
    }

    return result;
  }, []);

  const lightColors = ['christmas-red', 'christmas-green', 'ornament'];

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {/* Animated festive gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-secondary/40 to-primary/80 opacity-40" />

      {/* Particles */}
      {particles.map((particle) => {
        let animationClass = '';
        let colorClass = '';

        if (particle.type === 'snowflake') {
          animationClass = 'animate-snow-fall';
        } else if (particle.type === 'sparkle') {
          animationClass = 'animate-sparkle';
        } else if (particle.type === 'light') {
          colorClass = `bg-${lightColors[Math.floor(particle.id / 4) % lightColors.length]}`;
          animationClass = 'animate-pulse-glow';
        }

        return (
          <div
            key={particle.id}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              opacity: particle.opacity,
            }}
            className={`absolute pointer-events-none select-none flex items-center justify-center
              ${
                particle.type === 'snowflake'
                  ? `text-white/80 ${animationClass}`
                  : particle.type === 'sparkle'
                  ? `rounded-full bg-white/70 ${animationClass}`
                  : `rounded-full ${colorClass} ${animationClass} shadow-lg`
              }
            `}
          >
            {particle.type === 'snowflake' && '❄'}
          </div>
        );
      })}

      {/* Floating corner decorations */}
      <div className="absolute top-10 left-8 w-12 h-12 rounded-full bg-ornament/50 blur-lg animate-sway shadow-lg" />
      <div className="absolute top-20 right-6 w-10 h-10 rounded-full bg-christmas-red/60 blur-md animate-floaty shadow-md" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-32 left-12 w-11 h-11 rounded-full bg-christmas-green/50 blur-lg animate-sway shadow-md" style={{ animationDelay: '-0.5s' }} />
      <div className="absolute bottom-16 right-10 w-10 h-10 rounded-full bg-ornament/60 blur-md animate-floaty shadow-lg" style={{ animationDelay: '1s' }} />

      {/* Festive text banner at top */}
      <div className="absolute left-0 right-0 top-4 flex justify-center pointer-events-auto z-20">
        <div className="flex items-center gap-3 rounded-full px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="flex gap-2">
            {lightColors.map((c, i) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full bg-${c} animate-twinkle shadow-md`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <span className="text-xs md:text-sm text-white/80 font-semibold tracking-wide ml-2">
            ✨ Merry Christmas — HackSphere '26 ✨
          </span>
        </div>
      </div>
    </div>
  );
};

export default GlobalChristmasOverlay;
