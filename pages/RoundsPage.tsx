import React from 'react';
import Section from '../components/Section';

const rounds = [
  {
    name: 'Round 1: Online Challenge',
    description: 'An online preliminary round combining a time-bound MCQ quiz and a set of coding challenges. This round tests your fundamental CS knowledge, logical reasoning, and problem-solving skills.',
    icon: (
      <svg className="w-12 h-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    name: 'Round 2: Project Submission',
    description: 'Shortlisted teams will be given a single, detailed problem statement. Your task is to develop a comprehensive software solution and submit the complete project files. This round evaluates your development skills, creativity, and ability to build a functional application.',
    icon: (
        <svg className="w-12 h-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
    ),
  },
  {
    name: 'Round 3: Offline Hackathon',
    description: 'The final round is a 24-hour offline hackathon at the NIT Silchar campus. Top teams will build a functional prototype of their solution for a given problem statement. This is where innovation, teamwork, and presentation skills come into play.',
    icon: (
      <svg className="w-12 h-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 21.75l4.5-4.5-4.5-4.5m4.5 9l-4.5-4.5 4.5-4.5M14.25 2.25l-4.5 4.5 4.5 4.5m-4.5-9l4.5 4.5-4.5 4.5" />
      </svg>
    ),
  },
];

const RoundsPage: React.FC = () => {
  return (
    <div className="animate-fade-in-up relative">
      {/* Global Christmas Background is rendered in App.tsx */}
      <Section title="Competition Rounds" subtitle="The journey to victory is spread across three challenging rounds.">
        <div className="space-y-12">
          {rounds.map((round) => (
            <div key={round.name} className="flex flex-col md:flex-row items-center gap-8 p-8 bg-secondary/50 rounded-lg shadow-lg">
              <div className="flex-shrink-0">{round.icon}</div>
              <div>
                <h3 className="text-2xl font-bold text-white">{round.name}</h3>
                <p className="mt-2 text-dark-text/90">{round.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default RoundsPage;