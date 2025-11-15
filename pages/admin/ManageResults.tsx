import React from 'react';
import { useContest } from '../../hooks/useContest';
import { useAuth } from '../../hooks/useAuth';

const ManageResults: React.FC = () => {
    const { submissions, calculateRound1Score } = useContest();
    const { teams } = useAuth();

    const getTeamName = (teamId: string) => teams.find(t => t.id === teamId)?.name || teamId;

    // Group submissions by teamId
    const teamMap: Record<string, typeof submissions> = {};
    submissions.forEach(s => {
        if (!teamMap[s.teamId]) teamMap[s.teamId] = [];
        teamMap[s.teamId].push(s);
    });
    const teamIds = Object.keys(teamMap);

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold text-white mb-8">Submissions & Results</h1>
            <div className="bg-primary p-8 rounded-lg mb-8">
                <h3 className="text-xl font-semibold text-white">Results Automation</h3>
                <p className="mt-4 text-dark-text">
                    Use the table below to view and manage team submissions for Round 1. Calculated scores will update the leaderboard.
                </p>
            </div>
            <div className="bg-primary p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Round 1 Results ({teamIds.length} teams)</h3>
                {teamIds.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-secondary/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Team Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Avg Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary">
                                {teamIds.map(teamId => {
                                    const subs = teamMap[teamId];
                                    // compute average of numeric scores only
                                    const numericScores = subs.map(s => s.score).filter(s => typeof s === 'number') as number[];
                                    const avg = numericScores.length > 0 ? Math.round(numericScores.reduce((a, b) => a + b, 0) / numericScores.length) : null;
                                    const allScored = subs.every(s => typeof s.score === 'number');
                                    return (
                                        <tr key={teamId}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{getTeamName(teamId)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold text-accent">{avg !== null ? avg : '—'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => calculateRound1Score(teamId)}
                                                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded transition-colors"
                                                    disabled={allScored}
                                                >
                                                    Calculate Score
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-dark-text text-center">No submissions yet.</p>
                )}
            </div>
        </div>
    );
};

export default ManageResults;
