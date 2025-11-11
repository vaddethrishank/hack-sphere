import React from 'react';
import { NavLink } from 'react-router-dom';
import Section from '../components/Section';

const timelineEvents = [
  { date: 'Aug 1, 2025', title: 'Registration Opens', description: 'Teams can start registering for the hackathon.' },
  { date: 'Sep 15, 2025', title: 'Registration Closes', description: 'The deadline for team registrations.' },
  { date: 'Oct 1, 2025', title: 'Round 1: Online Quiz', description: 'An online MCQ round to test foundational knowledge.' },
  { date: 'Oct 15, 2025', title: 'Round 2: Online Coding', description: 'Qualified teams participate in a competitive programming round.' },
  { date: 'Jan 10, 2026', title: 'Round 3: Offline Hackathon', description: 'The final 24-hour hackathon at NIT Silchar campus.' },
  { date: 'Jan 11, 2026', title: 'Results & Closing Ceremony', description: 'Winners are announced and prizes are distributed.' },
];

const sponsors = [
    { name: 'Google', logo: 'https://picsum.photos/seed/google/150/50' },
    { name: 'Microsoft', logo: 'https://picsum.photos/seed/microsoft/150/50' },
    { name: 'Amazon', logo: 'https://picsum.photos/seed/amazon/150/50' },
    { name: 'Devfolio', logo: 'https://picsum.photos/seed/devfolio/150/50' },
    { name: 'Unstop', logo: 'https://picsum.photos/seed/unstop/150/50' },
];

const HomePage: React.FC = () => {
    return (
        <div className="animate-fade-in-up">
            {/* Hero Section */}
            <div className="relative pt-24 pb-32 flex content-center items-center justify-center" style={{ minHeight: '80vh' }}>
                <div className="absolute top-0 w-full h-full bg-center bg-cover bg-primary"
                    style={{ backgroundImage: `url('https://picsum.photos/seed/hero/1920/1080')` }}>
                    <span id="blackOverlay" className="w-full h-full absolute opacity-75 bg-primary"></span>
                </div>
                <div className="container relative mx-auto">
                    <div className="items-center flex flex-wrap">
                        <div className="w-full lg:w-8/12 px-4 ml-auto mr-auto text-center">
                            <div className="pr-12">
                                <h1 className="text-white font-semibold text-5xl md:text-6xl animate-glow">
                                    Hackathon 2026
                                </h1>
                                <p className="mt-4 text-lg text-gray-300">
                                    Presented by NIT Silchar. A 3-day coding marathon to build, innovate, and create the future.
                                </p>
                                <div className="mt-12">
                                    <NavLink to="/registration" className="bg-highlight hover:bg-highlight/80 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg shadow-highlight/30">
                                        Register Now
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Section */}
            <Section title="Event Timeline" subtitle="Follow our journey from registration to the final round.">
                <div className="relative">
                    <div className="border-l-2 border-accent absolute h-full top-0 left-1/2 -ml-px"></div>
                    {timelineEvents.map((event, index) => (
                        <div key={index} className={`flex items-center w-full mb-8 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                            <div className="w-1/2"></div>
                            <div className="w-1/2 px-4">
                                <div className={`p-6 bg-secondary rounded-lg shadow-lg transform transition-transform hover:scale-105 ${index % 2 === 0 ? 'text-right' : ''}`}>
                                    <p className="text-accent font-semibold">{event.date}</p>
                                    <h3 className="text-xl font-bold mt-1 text-white">{event.title}</h3>
                                    <p className="mt-2 text-dark-text/80">{event.description}</p>
                                </div>
                            </div>
                            <div className="absolute w-5 h-5 bg-highlight rounded-full left-1/2 -ml-2.5 border-4 border-primary"></div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Prizes Section Preview */}
            <Section title="Prizes & Perks" subtitle="Win exciting cash prizes and grab exclusive opportunities.">
                <div className="text-center">
                    <h3 className="text-4xl font-bold text-white mb-4">Total Prize Pool: ₹5,00,000+</h3>
                    <p className="text-lg text-dark-text mb-8">More than just cash prizes. Get internship opportunities, goodies, and cloud credits.</p>
                    <NavLink to="/prizes" className="text-accent hover:text-highlight transition-colors font-semibold">
                        View All Prizes &rarr;
                    </NavLink>
                </div>
            </Section>
            
            {/* Sponsors Section */}
            <Section title="Our Sponsors" className="bg-secondary/30">
                 <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                    {sponsors.map(sponsor => (
                        <img key={sponsor.name} src={sponsor.logo} alt={sponsor.name} className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default HomePage;