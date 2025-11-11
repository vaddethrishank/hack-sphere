import React from 'react';
import { NavLink } from 'react-router-dom';
import { useContest } from '../../hooks/useContest';
import { useAuth } from '../../hooks/useAuth';

const ManageResults: React.FC = () => {
    const { submissions, calculateRound1Score } = useContest();
    const { teams } = useAuth();

    const getTeamName = (teamId: string) => {
        return teams.find(t => t.id === teamId)?.name || teamId;
    }

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold text-white mb-8">Submissions & Results</h1>
            
            <div className="bg-primary p-8 rounded-lg mb-8">
                <h3 className="text-xl font-semibold text-white">Results Automation</h3>
                <p className="mt-4 text-dark-text">
                   Use the table below to automatically calculate scores for Round 1 MCQ submissions. Coding problems must be evaluated manually. The calculated scores will automatically update the public leaderboard.
                </p>
            </div>
            
            <div className="bg-primary p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Round 1 Submissions ({submissions.length})</h3>
                {submissions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-secondary/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Team Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Submitted At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary">
                                {submissions.map(sub => (
                                    <tr key={sub.teamId}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{getTeamName(sub.teamId)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-dark-text">{sub.submittedAt.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-accent">
                                            {typeof sub.score === 'number' ? sub.score : 'Not Calculated'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                            <button 
                                                onClick={() => calculateRound1Score(sub.teamId)}
                                                className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={typeof sub.score === 'number'}
                                            >
                                                Calculate Score
                                            </button>
                                            <NavLink to={`/admin/submission/${sub.teamId}`} className="text-sm bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded transition-colors">
                                                View Details
                                            </NavLink>
                                        </td>
                                    </tr>
                                ))}
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
