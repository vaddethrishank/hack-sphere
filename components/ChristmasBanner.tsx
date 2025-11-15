import React from 'react';

interface Snowflake {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

const Snowflake: React.FC<{ flake: Snowflake }> = ({ flake }) => {
  return (
    <span
      style={{
        left: `${flake.left}%`,
        fontSize: `${flake.size}px`,
        animationDuration: `${flake.duration}s`,
        animationDelay: `${flake.delay}s`,
      }}
      className={`absolute top-[-10vh] text-white/80 pointer-events-none select-none animate-snow-fall`}
    >
      ❄
    </span>
  );
};

interface ChristmasBackgroundProps {
  snowflakeCount?: number;
  showLights?: boolean;
  showOrnaments?: boolean;
}

/**
 * ChristmasBackground: A page-level background component with animated snowflakes and optional decorations.
 * Position this as a fixed/absolute background layer (behind main content) in pages.
 * Does NOT interfere with navbar or other fixed elements when z-index is kept low (e.g., z-0 or z-10).
 */
const ChristmasBackground: React.FC<ChristmasBackgroundProps> = ({ 
  snowflakeCount = 25, 
  showLights = true,
  showOrnaments = true
}) => {
  // Create snowflakes with varied positions/durations
  const flakes: Snowflake[] = Array.from({ length: snowflakeCount }).map((_, i) => ({
    id: i,
    left: Math.round(Math.random() * 100),
    size: 6 + Math.round(Math.random() * 16),
    duration: 10 + Math.random() * 12,
    delay: -(Math.random() * 15),
  }));

  const lightColors = [
    'christmas-red',
    'christmas-green',
    'ornament',
    'christmas-red',
    'christmas-green',
    'ornament',
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {/* Subtle animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-secondary/30 to-primary opacity-60" />

      {/* Snowflakes */}
      {flakes.map(f => (
        <Snowflake key={f.id} flake={f} />
      ))}

      {/* Top decoration: String lights and holiday text */}
      {showLights && (
        <div className="absolute left-0 right-0 top-6 flex justify-center pointer-events-none">
          <div className="flex items-center gap-2 rounded-full px-4 py-2 bg-black/30 backdrop-blur-sm">
            <div className="flex gap-2">
              {lightColors.map((c, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full bg-${c} animate-twinkle shadow-lg`}
                  style={{ 
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-white/70 ml-3 font-semibold tracking-wide">Happy Holidays — HackSphere '26</span>
          </div>
        </div>
      )}

      {/* Corner ornaments */}
      {showOrnaments && (
        <>
          <div className="absolute top-32 left-8 w-8 h-8 rounded-full bg-ornament/60 blur-md opacity-70 animate-floaty shadow-lg" />
          <div className="absolute top-40 right-12 w-6 h-6 rounded-full bg-christmas-red/60 blur-md opacity-60 animate-floaty shadow-md" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-16 w-7 h-7 rounded-full bg-christmas-green/50 blur-md opacity-50 animate-floaty shadow-md" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-20 right-8 w-9 h-9 rounded-full bg-ornament/50 blur-md opacity-60 animate-floaty shadow-lg" style={{ animationDelay: '1.5s' }} />
        </>
      )}
    </div>
  );
};

export default ChristmasBackground;
