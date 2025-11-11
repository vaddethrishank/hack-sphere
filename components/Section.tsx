
import React, { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ id, title, subtitle, children, className = '' }) => {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent to-highlight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
};

export default Section;
