import React, { useState, useMemo } from 'react';
import Section from '../components/Section';
import { useContest } from '../hooks/useContest';
import { useAuth } from '../hooks/useAuth';

const LeaderboardPage: React.FC = () => {
    const [activeRound, setActiveRound] = useState('Round 1');
    const [collegeFilter, setCollegeFilter] = useState('');
    const { submissions } = useContest();
    const { teams } = useAuth();

    const colleges = useMemo(() => {
        return [...new Set(teams.map(team => team.college).filter(Boolean))].sort();
    }, [teams]);

    const leaderboardData = useMemo(() => {
        const scoredSubmissions = submissions.filter(s => typeof s.score === 'number');

        const enrichedSubmissions = scoredSubmissions.map(submission => {
            const team = teams.find(t => t.id === submission.teamId);
            return {
                ...submission,
                teamName: team?.name || 'Unknown Team',
                college: team?.college || 'Unknown College',
            };
        });

        const filteredSubmissions = collegeFilter
            ? enrichedSubmissions.filter(s => s.college === collegeFilter)
            : enrichedSubmissions;

        const sortedSubmissions = filteredSubmissions.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

        return sortedSubmissions.map((submission, index) => ({
            ...submission,
            rank: index + 1,
        }));
    }, [submissions, teams, collegeFilter]);
    
    return (
        <div className="animate-fade-in-up">
            <Section title="Leaderboard" subtitle="Track the top performing teams in real-time.">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                        {/* Round Filters */}
                        <div className="bg-secondary p-2 rounded-full flex">
                            <button onClick={() => setActiveRound('Round 1')} className={`px-6 py-2 rounded-full font-semibold transition-colors ${activeRound === 'Round 1' ? 'bg-accent text-white' : 'text-dark-text'}`}>
                                Round 1
                            </button>
                            <button disabled className="px-6 py-2 rounded-full font-semibold transition-colors text-dark-text/50 cursor-not-allowed">
                                Round 2
                            </button>
                            <button disabled className="px-6 py-2 rounded-full font-semibold transition-colors text-dark-text/50 cursor-not-allowed">
                                Final Results
                            </button>
                        </div>
                         {/* College Filter */}
                        <div className="relative">
                             <select
                                value={collegeFilter}
                                onChange={e => setCollegeFilter(e.target.value)}
                                className="bg-secondary text-dark-text font-semibold rounded-full py-3 pl-6 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                                aria-label="Filter by college"
                            >
                                <option value="">All Colleges</option>
                                {colleges.map(college => (
                                    <option key={college} value={college}>{college}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-dark-text">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-secondary rounded-lg shadow-lg overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-secondary/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Team Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">College</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary">
                                {leaderboardData.length > 0 ? leaderboardData.map((team, index) => (
                                    <tr key={team.teamId} className={`transition-colors ${index < 3 ? 'bg-accent/20' : 'hover:bg-accent/10'}`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-lg font-bold">{team.rank}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{team.teamName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-dark-text">{team.college}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-accent font-semibold">{team.score}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-dark-text">
                                            {collegeFilter ? `No teams from ${collegeFilter} have scores yet.` : 'No scores calculated yet. The leaderboard will update once the admin evaluates submissions.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default LeaderboardPage;