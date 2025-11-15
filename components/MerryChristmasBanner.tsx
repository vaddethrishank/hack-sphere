import React from 'react';

/**
 * MerryChristmasBanner: Festive Christmas banner with animated lights
 * Features:
 * - Twinkling colored lights
 * - "Merry Christmas" text
 * - Fixed positioning at top
 * - Glassmorphic background
 */
const MerryChristmasBanner: React.FC = () => {
  const lightColors = ['christmas-red', 'christmas-green', 'ornament'];

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center pointer-events-auto z-50">
      <div className="flex items-center gap-3 rounded-full px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 shadow-lg m-4">
        {/* Animated Christmas Lights */}
        <div className="flex gap-2">
          {lightColors.map((c, i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full bg-${c} animate-twinkle shadow-md`}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        
        {/* Festive Text */}
        <span className="text-xs md:text-sm text-white/80 font-semibold tracking-wide ml-2">
          ✨ Merry Christmas — HackSphere '26 ✨
        </span>
        
        {/* Animated Christmas Lights */}
        <div className="flex gap-2 ml-2">
          {lightColors.map((c, i) => (
            <span
              key={`right-${i}`}
              className={`w-2.5 h-2.5 rounded-full bg-${c} animate-twinkle shadow-md`}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MerryChristmasBanner;
