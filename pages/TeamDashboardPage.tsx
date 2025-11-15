import React from 'react';
import { NavLink } from 'react-router-dom';
import Section from '../components/Section';
import { useAuth } from '../hooks/useAuth';
import { useContest } from '../hooks/useContest';
import { Team, RoundStatus } from '../types';

interface StatCardProps {
    label: string;
    value: string | number;
    valueClassName?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, valueClassName }) => (
    <div className="bg-primary p-6 rounded-lg shadow-lg text-center flex flex-col justify-center">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</h3>
        <p className={`mt-2 font-extrabold ${valueClassName || 'text-4xl text-accent'}`}>{value}</p>
    </div>
);

const TeamDashboardPage: React.FC = () => {
    const { user, teams } = useAuth();
    const { getTeamSubmission, submissions, getRoundById } = useContest();
    
    const team = user?.teamId ? teams.find(t => t.id === user.teamId) : null;
    const submission = user?.teamId ? getTeamSubmission(user.teamId) : undefined;
    const round1 = getRoundById(1);
    const round2 = getRoundById(2);
    
    // Compute team-average scores for ranking (handles multiple member submissions)
    const teamScoresMap: Record<string, number[]> = {};
    submissions.forEach(s => {
        if (typeof s.score === 'number') {
            teamScoresMap[s.teamId] = teamScoresMap[s.teamId] || [];
            teamScoresMap[s.teamId].push(s.score as number);
        }
    });

    const teamScores: { teamId: string; avg: number }[] = Object.entries(teamScoresMap).map(([teamId, scores]) => ({
        teamId,
        avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }));

    // sort descending by average
    teamScores.sort((a, b) => b.avg - a.avg);

    // Determine rank and qualification
    let rank: number | string = '-';
    if (submission) {
        const entryIndex = teamScores.findIndex(t => t.teamId === submission.teamId);
        if (entryIndex !== -1) {
            rank = entryIndex + 1;
        }
    }

    // compute qualifiers: top 75% (at least 1)
    const totalTeamsWithScores = teamScores.length;
    const qualifiersCount = Math.max(1, Math.ceil(totalTeamsWithScores * 0.75));
    const isQualified = typeof rank === 'number' && rank > 0 && rank <= qualifiersCount;

    const getStatusClass = (status?: RoundStatus): string => {
        const baseClass = 'text-3xl'; // Smaller font for text status
        switch (status) {
            case 'Active': return `text-green-400 ${baseClass}`;
            case 'Finished': return `text-gray-400 ${baseClass}`;
            case 'Not Started': return `text-yellow-400 ${baseClass}`;
            case 'Locked': return `text-gray-500 ${baseClass}`;
            default: return `text-gray-500 ${baseClass}`;
        }
    };

    if (!team) {
        return (
             <Section title="Team Dashboard">
                 <div className="max-w-md mx-auto text-center bg-secondary p-8 rounded-lg shadow-lg">
                     <h3 className="text-2xl font-bold text-white">Let's Get You Started!</h3>
                     <p className="mt-4 text-dark-text">You haven't formed a team yet. Register your team to kickstart your Hackathon 2026 journey.</p>
                     <NavLink 
                         to="/registration" 
                         className="mt-8 inline-block bg-accent hover:bg-accent/80 text-white font-bold py-3 px-6 rounded-full transition-colors transform hover:scale-105"
                     >
                         Register Your Team
                     </NavLink>
                 </div>
             </Section>
        );
    }

    if (team.status === 'Pending') {
        return (
            <Section title="Registration Pending" subtitle="Thank you for registering!">
                <div className="max-w-md mx-auto text-center bg-secondary p-8 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-yellow-400">Your Team's Approval is Pending</h3>
                    <p className="mt-4 text-dark-text">Our team is currently reviewing your registration details and payment screenshot. You will be notified once your team is approved. Please check back later.</p>
                </div>
            </Section>
        );
    }

    if (team.status === 'Rejected') {
        return (
            <Section title="Registration Status" subtitle="There was an issue with your registration.">
                <div className="max-w-md mx-auto text-center bg-secondary p-8 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-red-400">Your Team Registration was Rejected</h3>
                    <p className="mt-4 text-dark-text">Unfortunately, there was an issue with your team's registration. Please contact the event coordinators for more details.</p>
                     <NavLink to="/contact" className="mt-8 inline-block text-accent hover:underline">
                        Contact Organizers
                    </NavLink>
                </div>
            </Section>
        );
    }
    
    return (
        <div className="animate-fade-in-up">
            <Section title="Team Dashboard" subtitle={`Welcome, ${team.name}!`}>
                {/* Status badge: display under team name */}
                {(() => {
                    const isRound2Locked = round2?.status === 'Locked';
                    if (isRound2Locked) {
                        if (submission) {
                            return (
                                <div className="max-w-5xl mx-auto mb-4">
                                    <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-yellow-500 text-white">Results Coming Soon</span>
                                </div>
                            );
                        }
                        return null;
                    }

                    // Round 2 unlocked
                    if (isQualified) {
                        return (
                            <div className="max-w-5xl mx-auto mb-4">
                                <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-green-600 text-white">Selected For Round 2</span>
                            </div>
                        );
                    }
                    return (
                        <div className="max-w-5xl mx-auto mb-4">
                            <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-gray-600 text-white">Not Selected For Round 2</span>
                        </div>
                    );
                })()}

                <div className="max-w-5xl mx-auto space-y-12">
                    {/* Scores and Rank Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard 
                            label="Round 1 Status" 
                            value={round1?.status ?? 'Locked'} 
                            valueClassName={getStatusClass(round1?.status)}
                        />
                        <StatCard label="Round 1 Score" value={typeof submission?.score === 'number' ? submission.score : '—'} />
                        <StatCard label="Current Rank" value={typeof rank === 'number' && rank > 0 ? `#${rank}` : '-'} />
                        <StatCard 
                            label="Round 2 Status" 
                            value={round2?.status ?? 'Locked'} 
                            valueClassName={getStatusClass(round2?.status)}
                        />
                    </div>

                    {/* Competition Actions Section */}
                    <div className="bg-secondary p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-white mb-6">Competition Actions</h3>
                        <div className="flex flex-col md:flex-row gap-6">
                           {(() => {
                                const hasSubmitted = !!submission;
                                const isRound1Active = round1?.status === 'Active';
                                const isRound1Finished = round1?.status === 'Finished';
                                const isRound2Locked = round2?.status === 'Locked';

                                // When Round 2 is unlocked, avoid showing a disabled "Round 1 Submitted" message.
                                // Instead show a link to view the team's Round 1 submission if they submitted.
                                if (!isRound2Locked && hasSubmitted) {
                                    return (
                                        <NavLink to="/contest/round1" className={`flex-1 text-center font-bold py-4 px-6 rounded-lg bg-secondary hover:bg-secondary/90 text-white`}> 
                                            View Round 1 Submission
                                        </NavLink>
                                    );
                                }

                                // Default Round 1 button behavior when Round 2 is locked or team hasn't submitted yet
                                let buttonText = 'Go to Round 1 Contest';
                                let buttonClass = 'bg-gray-600 text-gray-300 cursor-not-allowed';
                                let isDisabled = true;

                                if (hasSubmitted) {
                                    buttonText = 'Round 1 Submitted';
                                } else if (isRound1Active) {
                                    buttonText = 'Start Round 1 Contest';
                                    buttonClass = 'bg-accent hover:bg-accent/80 text-white animate-pulse';
                                    isDisabled = false;
                                } else if (isRound1Finished) {
                                    buttonText = 'Round 1 Finished';
                                } else { // Not started or locked
                                    buttonText = 'Round 1 Not Started';
                                }

                                return (
                                    <NavLink 
                                        to="/contest/round1" 
                                        className={`flex-1 text-center font-bold py-4 px-6 rounded-lg transition-transform transform hover:scale-105 ${buttonClass}`}
                                        onClick={(e) => isDisabled && e.preventDefault()}
                                        aria-disabled={isDisabled}
                                    >
                                        {buttonText}
                                    </NavLink>
                                );
                            })()}
                             {(() => {
                                const isRound2Active = round2?.status === 'Active';
                                const isRound2Locked = round2?.status === 'Locked';

                                // Behavior:
                                // - If round2 is Locked: only teams that submitted Round1 and are in top 75% see enabled link.
                                //   Teams that submitted but are not qualified see 'Not qualified for Round 2'.
                                //   Teams that haven't submitted see 'Round 1 Not Submitted'.
                                // - If round2 is unlocked: teams not in top75% see 'Not qualified for Round 2'.

                                if (isRound2Locked) {
                                    // When Round 2 is locked we do NOT show a "Go to Round 2" link for anyone.
                                    // If the team has submitted Round 1, show a friendly message that results are coming soon.
                                    if (submission) {
                                        return (
                                            <div className="flex-1 text-center font-bold py-4 px-6 rounded-lg bg-secondary text-gray-200">
                                                Results Coming Soon
                                            </div>
                                        );
                                    }
                                    // If team hasn't submitted, show nothing (no action)
                                    return null;
                                }

                                // Round 2 is unlocked: only qualified teams may access it
                                if (!isQualified) {
                                    return (
                                        <div className="flex-1 text-center font-bold py-4 px-6 rounded-lg bg-gray-600 text-gray-300">
                                            Not Selected For Round 2
                                        </div>
                                    );
                                }

                                // Qualified teams: show only the Round 2 link (no inline badge)
                                return (
                                    <NavLink to="/contest/round2" className="flex-1 text-center font-bold py-3 px-6 rounded-lg bg-highlight hover:bg-highlight/80 text-white hover:scale-105">
                                        Go to Round 2 Submission
                                    </NavLink>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Team Members Section */}
                    <div className="bg-secondary p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-white mb-6">Team Members</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="border-b border-primary">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-primary">
                                    {team.members.map((member) => (
                                        <tr key={member.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{member.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-dark-text">{member.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                    member.role === 'Leader' ? 'bg-highlight/20 text-highlight' : 'bg-accent/20 text-accent'
                                                }`}>
                                                    {member.role}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default TeamDashboardPage;