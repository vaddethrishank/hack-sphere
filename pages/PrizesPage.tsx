
import React from 'react';
import Section from '../components/Section';
import { Prize } from '../types';

const prizes: Prize[] = [
    { rank: '1st Place', amount: '₹2,50,000', perks: ['Internship interviews', 'Premium Goodies', '₹50,000 Cloud Credits'] },
    { rank: '2nd Place', amount: '₹1,50,000', perks: ['Internship interviews', 'Goodies', '₹25,000 Cloud Credits'] },
    { rank: '3rd Place', amount: '₹1,00,000', perks: ['Internship interviews', 'Goodies', '₹10,000 Cloud Credits'] },
    { rank: 'Best All-Girls Team', amount: '₹25,000', perks: ['Special Mention', 'Mentorship Sessions'] },
    { rank: 'Best First-Year Team', amount: '₹15,000', perks: ['Special Mention', 'Mentorship Sessions'] },
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
        <div className="animate-fade-in-up">
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
