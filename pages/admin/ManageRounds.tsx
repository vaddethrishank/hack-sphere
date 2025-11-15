import React, { useState, useEffect } from 'react';
import { useContest } from '../../hooks/useContest';

const ManageRounds: React.FC = () => {
    const { rounds, startRound, endRound, setRoundDuration } = useContest();
    const round1 = rounds.find(r => r.id === 1);
    const [duration, setDuration] = useState(round1?.durationInMinutes || 90);
    const [elapsedTime, setElapsedTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [remainingTime, setRemainingTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        setDuration(round1?.durationInMinutes || 90);
    }, [round1]);

    // Timer effect for active rounds
    useEffect(() => {
        const timer = setInterval(() => {
            rounds.forEach((round) => {
                if (round.status === 'Active' && round.startedAt && round.durationInMinutes) {
                    const startTime = new Date(round.startedAt).getTime();
                    const now = Date.now();
                    const elapsedMs = now - startTime;
                    const totalMs = round.durationInMinutes * 60 * 1000;
                    const remainingMs = Math.max(0, totalMs - elapsedMs);

                    // Calculate elapsed time
                    const elapsedSeconds = Math.floor(elapsedMs / 1000);
                    const elapsedHours = Math.floor(elapsedSeconds / 3600);
                    const elapsedMinutes = Math.floor((elapsedSeconds % 3600) / 60);
                    const elapsedSecs = elapsedSeconds % 60;

                    // Calculate remaining time
                    const remainingSeconds = Math.floor(remainingMs / 1000);
                    const remainingHours = Math.floor(remainingSeconds / 3600);
                    const remainingMinutes = Math.floor((remainingSeconds % 3600) / 60);
                    const remainingSecs = remainingSeconds % 60;

                    setElapsedTime({
                        hours: elapsedHours,
                        minutes: elapsedMinutes,
                        seconds: elapsedSecs,
                    });

                    setRemainingTime({
                        hours: remainingHours,
                        minutes: remainingMinutes,
                        seconds: remainingSecs,
                    });
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [rounds]);

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
                                    round.status === 'Active' ? 'text-christmas-green' :
                                    round.status === 'Finished' ? 'text-gray-400' :
                                    round.status === 'Not Started' ? 'text-yellow-400' : 'text-gray-500'
                                }`}>
                                    Status: {round.status}
                                </p>
                                
                                {/* Timer Display for Active Rounds */}
                                {round.status === 'Active' && (
                                    <div className="mt-3 p-3 bg-secondary rounded-lg border border-christmas-green/30">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-dark-text/70 mb-1">Elapsed Time</p>
                                                <p className="text-lg font-bold text-christmas-green">
                                                    {String(elapsedTime.hours).padStart(2, '0')}:{String(elapsedTime.minutes).padStart(2, '0')}:{String(elapsedTime.seconds).padStart(2, '0')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-dark-text/70 mb-1">Time Remaining</p>
                                                <p className={`text-lg font-bold ${
                                                    remainingTime.minutes <= 5 && remainingTime.hours === 0 ? 'text-christmas-red' : 'text-frozen-ice'
                                                }`}>
                                                    {String(remainingTime.hours).padStart(2, '0')}:{String(remainingTime.minutes).padStart(2, '0')}:{String(remainingTime.seconds).padStart(2, '0')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 w-full bg-secondary rounded-full h-2 border border-christmas-green/30 overflow-hidden">
                                            <div 
                                                className="bg-gradient-to-r from-christmas-green to-frozen-ice h-full transition-all duration-300"
                                                style={{ 
                                                    width: `${round.durationInMinutes ? ((round.durationInMinutes * 60 * 1000 - (remainingTime.hours * 3600 * 1000 + remainingTime.minutes * 60 * 1000 + remainingTime.seconds * 1000)) / (round.durationInMinutes * 60 * 1000)) * 100 : 0}%` 
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => startRound(round.id)}
                                    className="bg-christmas-green hover:bg-christmas-green/80 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50" 
                                    disabled={round.status === 'Active' || round.status === 'Finished' || round.status === 'Locked'}
                                >
                                    Start Round
                                </button>
                                <button 
                                    onClick={() => endRound(round.id)}
                                    className="bg-christmas-red hover:bg-accent text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50" 
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
                                    className="bg-secondary p-2 rounded-md w-24 border-transparent focus:ring-frozen-ice focus:border-frozen-ice"
                                />
                                    <button onClick={handleSetDuration} className="bg-frozen-ice hover:bg-frozen-ice/80 text-white font-bold py-2 px-4 rounded transition-colors">
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