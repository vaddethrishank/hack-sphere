import React from 'react';
import Section from '../components/Section';
import { Prize } from '../types';

const prizes: Prize[] = [
    { rank: '1st Place', amount: '₹50,000', perks: ['Certificate of Achievement', 'Goodies',] },
    { rank: '2nd Place', amount: '₹40,000', perks: ['Certificate of Achievement', 'Goodies', ] },
    { rank: '3rd Place', amount: '₹30,000', perks: ['Certificate of Achievement', 'Goodies',] },
    { rank: 'Final-Teams', amount: 'Free Accomodation', perks: ['Special Mention', 'Academic Interaction','Gala Dinner'] },
    {rank:'Participants',amount:'Certificates',perks:['Performance based Certification',]}
    
];

const PrizeCard: React.FC<{ prize: Prize, isWinner?: boolean }> = ({ prize, isWinner = false }) => (
    <div className={`border rounded-lg p-8 text-center transition-transform transform hover:-translate-y-2 ${isWinner ? 'bg-gradient-to-br from-accent to-highlight text-white border-highlight' : 'bg-secondary border-secondary'}`}>
        <h3 className={`font-bold text-2xl ${isWinner ? 'text-white' : 'text-accent'}`}>{prize.rank}</h3>
        <p className="text-4xl font-extrabold my-4">{prize.amount}</p>
        <ul className="space-y-2 text-sm">
            {prize.perks.map(perk => <li key={perk}>✓ {perk}</li>)}
        </ul>
    </div>
);


const PrizesPage: React.FC = () => {
    return (
        <div className="animate-fade-in-up relative">
            {/* Global Christmas Background is rendered in App.tsx */}
            <Section title="Prizes and Recognition" subtitle="Rewarding innovation and excellence with a massive prize pool.">
                <div className="grid md:grid-cols-3 gap-8">
                    {prizes.map((prize, index) => (
                        <PrizeCard key={prize.rank} prize={prize} isWinner={index < 3} />
                    ))}
                </div>
                 <div className="text-center mt-16 p-8 bg-secondary/50 rounded-lg">
                    <h3 className="text-2xl font-bold text-white mb-4">Certificates for All</h3>
                    <p className="text-dark-text max-w-3xl mx-auto">
                        Every participant who successfully completes at least one round will receive a
                        <span className="font-semibold text-accent"> Certificate of Participation</span>.
                        Top performing teams will be awarded <span className="font-semibold text-highlight">Certificates of Appreciation</span> and
                        <span className="font-semibold text-white"> Certificates of Outstanding Performance</span>.
                    </p>
                </div>
            </Section>
        </div>
    );
};

export default PrizesPage;