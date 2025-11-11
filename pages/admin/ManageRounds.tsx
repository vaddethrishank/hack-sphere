import React, { useState, useEffect } from 'react';
import { useContest } from '../../hooks/useContest';

const ManageRounds: React.FC = () => {
    const { rounds, startRound, endRound, setRoundDuration } = useContest();
    const round1 = rounds.find(r => r.id === 1);
    const [duration, setDuration] = useState(round1?.durationInMinutes || 90);

    useEffect(() => {
        setDuration(round1?.durationInMinutes || 90);
    }, [round1]);

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDuration(Number(e.target.value));
    };

    const handleSetDuration = () => {
        setRoundDuration(1, duration);
        alert(`Round 1 duration set to ${duration} minutes.`);
    };

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold text-white mb-8">Manage Rounds</h1>
            <div className="space-y-6">
                {rounds.map((round) => (
                    <div key={round.id} className="bg-primary p-6 rounded-lg shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-white">{round.name}</h3>
                                <p className={`mt-1 text-sm font-medium ${
                                    round.status === 'Active' ? 'text-green-400' :
                                    round.status === 'Finished' ? 'text-gray-400' :
                                    round.status === 'Not Started' ? 'text-yellow-400' : 'text-gray-500'
                                }`}>
                                    Status: {round.status}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => startRound(round.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50" 
                                    disabled={round.status === 'Active' || round.status === 'Finished' || round.status === 'Locked'}
                                >
                                    Start Round
                                </button>
                                <button 
                                    onClick={() => endRound(round.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50" 
                                    disabled={round.status !== 'Active'}
                                >
                                    End Round
                                </button>
                            </div>
                        </div>
                        {round.id === 1 && round.status !== 'Active' && round.status !== 'Finished' && (
                            <div className="mt-4 pt-4 border-t border-secondary flex items-center gap-4">
                                <label htmlFor="duration" className="text-sm font-medium text-dark-text">Set Duration (minutes):</label>
                                <input 
                                    type="number" 
                                    id="duration"
                                    value={duration}
                                    onChange={handleDurationChange}
                                    className="bg-secondary p-2 rounded-md w-24 border-transparent focus:ring-accent focus:border-accent"
                                />
                                <button onClick={handleSetDuration} className="bg-accent hover:bg-accent/80 text-white font-bold py-2 px-4 rounded transition-colors">
                                    Set Duration
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageRounds;