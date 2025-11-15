import React, { useEffect, useRef, useState } from 'react';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

interface ScrollTimelineProps {
  events: TimelineEvent[];
  title?: string;
  subtitle?: string;
}

/**
 * ScrollTimeline: A timeline component that reveals events one by one as you scroll.
 * Features:
 * - Vertical connecting line
 * - Animated dots at each event
 * - Staggered fade-in/slide-in animations
 * - Intersection Observer for scroll detection
 */
const ScrollTimeline: React.FC<ScrollTimelineProps> = ({ events, title = 'Timeline', subtitle = '' }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const [lineHeight, setLineHeight] = useState(0);

  // Intersection Observer to detect when items come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = eventRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index === -1) return;

          // Toggle visibility on enter/exit so the effect runs when scrolling up/down
          setVisibleIndices((prev) => {
            const next = new Set(prev);
            if (entry.isIntersecting) next.add(index);
            else next.delete(index);
            return next;
          });
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of element is visible
        rootMargin: '0px 0px -50px 0px', // Adjust trigger point
      }
    );

    eventRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Update line height based on content
  useEffect(() => {
    if (timelineRef.current) {
      const height = timelineRef.current.scrollHeight;
      setLineHeight(height);
    }
  }, [events]);

  return (
    <div className="w-full py-12 px-4 md:px-0">
      {/* Section Header */}
      {title && (
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 animate-glow">
            {title}
          </h2>
          {subtitle && <p className="text-dark-text text-lg">{subtitle}</p>}
        </div>
      )}

      {/* Timeline Container */}
      <div ref={timelineRef} className="relative max-w-4xl mx-auto">
        {/* Vertical Line Background (use frozen-ice blue) */}
        <div
          className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-frozen-ice via-frozen-ice/70 to-frozen-ice/50 transform -translate-x-1/2 origin-top transition-all duration-700"
          style={{ height: `${lineHeight}px` }}
        />

        {/* Timeline Events */}
        <div className="space-y-12 md:space-y-16">
          {events.map((event, index) => (
            <div
              key={index}
              ref={(el) => {
                eventRefs.current[index] = el;
              }}
              className={`relative flex items-start gap-8 md:gap-12 transition-all duration-700 ${
                visibleIndices.has(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Left Content (odd indices) */}
              {index % 2 === 0 ? (
                <>
                  <div className="w-full md:w-5/12 text-right md:pr-8">
                    <div
                      className={`p-6 rounded-lg bg-secondary/80 border border-accent/30 backdrop-blur-sm transition-all duration-700 ${
                        visibleIndices.has(index)
                          ? 'border-accent shadow-lg shadow-accent/20'
                          : 'border-secondary/50'
                      }`}
                    >
                      <p className="text-sm font-semibold text-accent mb-2">{event.date}</p>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                        {event.title}
                      </h3>
                      <p className="text-sm md:text-base text-dark-text/80">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="absolute left-1/2 top-8 w-5 h-5 transform -translate-x-1/2">
                    <div
                      className={`w-full h-full rounded-full border-2 border-accent bg-primary transition-all duration-700 ${
                        visibleIndices.has(index) ? 'scale-100 shadow-lg shadow-accent' : 'scale-0'
                      }`}
                    />
                  </div>

                  {/* Right Spacer */}
                  <div className="hidden md:block w-5/12" />
                </>
              ) : (
                <>
                  {/* Left Spacer */}
                  <div className="hidden md:block w-5/12" />

                  {/* Center Dot */}
                  <div className="absolute left-1/2 top-8 w-5 h-5 transform -translate-x-1/2">
                    <div
                      className={`w-full h-full rounded-full border-2 border-frozen-ice bg-primary transition-all duration-700 ${
                        visibleIndices.has(index) ? 'scale-100 shadow-lg shadow-frozen-ice' : 'scale-0'
                      }`}
                    />
                  </div>

                  {/* Right Content */}
                  <div className="w-full md:w-5/12 md:pl-8">
                    <div
                      className={`p-6 rounded-lg bg-secondary/80 border border-frozen-ice/30 backdrop-blur-sm transition-all duration-700 ${
                        visibleIndices.has(index)
                          ? 'border-frozen-ice shadow-lg shadow-frozen-ice/20'
                          : 'border-secondary/50'
                      }`}
                    >
                        <p className="text-sm font-semibold text-frozen-ice mb-2">{event.date}</p>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                        {event.title}
                      </h3>
                      <p className="text-sm md:text-base text-dark-text/80">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollTimeline;
