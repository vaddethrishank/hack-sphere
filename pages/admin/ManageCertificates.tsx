import React, { useState, useMemo } from 'react';
import { useContest } from '../../hooks/useContest';
import { useAuth } from '../../hooks/useAuth';
import { CertificateType } from '../../types';

const ManageCertificates: React.FC = () => {
    const { submissions, certificates, awardCertificate } = useContest();
    const { teams } = useAuth();
    
    const [selectedTeamId, setSelectedTeamId] = useState<string>('');
    const [selectedCertType, setSelectedCertType] = useState<CertificateType>('Participation');
    
    // Populate dropdown only with teams that have made a submission
    const eligibleTeams = teams.filter(team => submissions.some(sub => sub.teamId === team.id));

    // Get unique teams with scores for auto-award calculation
    const teamsWithScores = teams
        .filter(team => submissions.some(sub => sub.teamId === team.id && typeof sub.score === 'number'))
        .map(team => {
            const submission = submissions.find(s => s.teamId === team.id && typeof s.score === 'number');
            return { team, score: submission?.score ?? 0 };
        })
        .sort((a, b) => b.score - a.score);

    // Calculate certificate categories
    const certificateBreakdown = useMemo(() => {
        const top75PercentCount = Math.ceil(teamsWithScores.length * 0.75);
        const top10PercentCount = Math.ceil(teamsWithScores.length * 0.1);

        const participation = eligibleTeams;
        const appreciation = teamsWithScores.slice(0, top75PercentCount).map(({ team }) => team);
        const outstanding = teamsWithScores
            .slice(0, top10PercentCount)
            .filter(({ score }) => score >= 80)
            .map(({ team }) => team);

        return { participation, appreciation, outstanding };
    }, [teamsWithScores, eligibleTeams]);

    const autoAwardCertificates = () => {
        if (teamsWithScores.length === 0) {
            alert('No teams with scores found. Run "Calculate Scores" first.');
            return;
        }

        let awardedCount = 0;

        // Award Participation to all teams with submissions
        eligibleTeams.forEach(team => {
            awardCertificate(team.id, team.name, 'Participation');
            awardedCount++;
        });

        // Award Appreciation to top 75%
        const top75PercentCount = Math.ceil(teamsWithScores.length * 0.75);
        teamsWithScores.slice(0, top75PercentCount).forEach(({ team }) => {
            awardCertificate(team.id, team.name, 'Appreciation');
            awardedCount++;
        });

        // Award Outstanding Performance to top 10% with score >= 80
        const top10PercentCount = Math.ceil(teamsWithScores.length * 0.1);
        teamsWithScores
            .slice(0, top10PercentCount)
            .filter(({ score }) => score >= 80)
            .forEach(({ team }) => {
                awardCertificate(team.id, team.name, 'Outstanding Performance');
                awardedCount++;
            });

        alert(`✅ Automatically awarded ${awardedCount} certificates!\n\n` +
            `• Participation: ${eligibleTeams.length} teams\n` +
            `• Appreciation (Top 75%): ${Math.min(top75PercentCount, teamsWithScores.length)} teams\n` +
            `• Outstanding Performance (Top 10% + Score ≥80): ${teamsWithScores.slice(0, top10PercentCount).filter(({ score }) => score >= 80).length} teams`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeamId) {
            alert('Please select a team.');
            return;
        }
        const team = teams.find(t => t.id === selectedTeamId);
        if (team) {
            awardCertificate(selectedTeamId, team.name, selectedCertType);
            setSelectedTeamId('');
            alert(`✅ Certificate awarded to ${team.name}`);
        }
    };

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold text-white mb-8">Manage Certificates</h1>

            {/* Award Button Section */}
            <div className="bg-primary p-8 rounded-lg mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={autoAwardCertificates}
                        className="flex-1 bg-highlight hover:bg-highlight/80 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
                    >
                        🎖️ Auto-Award All Certificates
                    </button>
                    <button 
                        type="button"
                        className="flex-1 bg-accent hover:bg-accent/80 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
                        onClick={() => document.getElementById('manual-award')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        ➕ Award Single Certificate
                    </button>
                </div>
            </div>

            {/* Certificate Categories Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Participation Certificate */}
                <div className="bg-primary p-6 rounded-lg border-l-4 border-blue-500">
                    <h3 className="text-xl font-bold text-blue-400 mb-4">🎯 Participation</h3>
                    <p className="text-dark-text text-sm mb-4">All registered participants</p>
                    <div className="bg-secondary p-4 rounded-md max-h-64 overflow-y-auto">
                        <p className="text-xs font-semibold text-gray-400 mb-3">Eligible Teams ({certificateBreakdown.participation.length})</p>
                        <ul className="space-y-2">
                            {certificateBreakdown.participation.length > 0 ? (
                                certificateBreakdown.participation.map(team => (
                                    <li key={team.id} className="text-sm text-white bg-accent/10 p-2 rounded flex items-center justify-between">
                                        <span>{team.name}</span>
                                        {certificates.some(c => c.teamId === team.id && c.type === 'Participation') && (
                                            <span className="text-xs text-green-400">✓</span>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <p className="text-xs text-dark-text">No teams with submissions yet.</p>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Appreciation Certificate */}
                <div className="bg-primary p-6 rounded-lg border-l-4 border-yellow-500">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4">⭐ Appreciation</h3>
                    <p className="text-dark-text text-sm mb-4">Ranking in top 75%</p>
                    <div className="bg-secondary p-4 rounded-md max-h-64 overflow-y-auto">
                        <p className="text-xs font-semibold text-gray-400 mb-3">Eligible Teams ({certificateBreakdown.appreciation.length})</p>
                        <ul className="space-y-2">
                            {certificateBreakdown.appreciation.length > 0 ? (
                                certificateBreakdown.appreciation.map(team => {
                                    const submission = submissions.find(s => s.teamId === team.id && typeof s.score === 'number');
                                    return (
                                        <li key={team.id} className="text-sm text-white bg-yellow-500/10 p-2 rounded flex items-center justify-between">
                                            <span className="flex-1">{team.name}</span>
                                            <span className="text-xs text-gray-400 mr-2">({submission?.score})</span>
                                            {certificates.some(c => c.teamId === team.id && c.type === 'Appreciation') && (
                                                <span className="text-xs text-green-400">✓</span>
                                            )}
                                        </li>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-dark-text">No teams qualify yet.</p>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Outstanding Performance Certificate */}
                <div className="bg-primary p-6 rounded-lg border-l-4 border-green-500">
                    <h3 className="text-xl font-bold text-green-400 mb-4">🏆 Outstanding Performance</h3>
                    <p className="text-dark-text text-sm mb-4">Top 10% (Score ≥80)</p>
                    <div className="bg-secondary p-4 rounded-md max-h-64 overflow-y-auto">
                        <p className="text-xs font-semibold text-gray-400 mb-3">Eligible Teams ({certificateBreakdown.outstanding.length})</p>
                        <ul className="space-y-2">
                            {certificateBreakdown.outstanding.length > 0 ? (
                                certificateBreakdown.outstanding.map(team => {
                                    const submission = submissions.find(s => s.teamId === team.id && typeof s.score === 'number');
                                    return (
                                        <li key={team.id} className="text-sm text-white bg-green-500/10 p-2 rounded flex items-center justify-between">
                                            <span className="flex-1">{team.name}</span>
                                            <span className="text-xs text-gray-400 mr-2">({submission?.score})</span>
                                            {certificates.some(c => c.teamId === team.id && c.type === 'Outstanding Performance') && (
                                                <span className="text-xs text-green-400">✓</span>
                                            )}
                                        </li>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-dark-text">No teams qualify yet.</p>
                            )}
                        </ul>
                    </div>
                </div>

            </div>

            {/* Manual Award Section */}
            <div id="manual-award" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-primary p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-6">Award Single Certificate</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="team-select" className="block text-sm font-medium text-dark-text mb-2">Select Team</label>
                            <select
                                id="team-select"
                                value={selectedTeamId}
                                onChange={e => setSelectedTeamId(e.target.value)}
                                className="w-full bg-secondary p-3 rounded-md border-transparent focus:ring-accent focus:border-accent"
                            >
                                <option value="" disabled>-- Select a team --</option>
                                {eligibleTeams.map(team => (
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="cert-type" className="block text-sm font-medium text-dark-text mb-2">Certificate Type</label>
                            <select
                                id="cert-type"
                                value={selectedCertType}
                                onChange={e => setSelectedCertType(e.target.value as CertificateType)}
                                className="w-full bg-secondary p-3 rounded-md border-transparent focus:ring-accent focus:border-accent"
                            >
                                <option>Participation</option>
                                <option>Appreciation</option>
                                <option>Outstanding Performance</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-accent hover:bg-accent/80 text-white font-bold py-3 rounded-md transition-colors">
                            Award Certificate
                        </button>
                    </form>
                </div>

                <div className="bg-primary p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-6">Awarded Certificates ({certificates.length})</h3>
                    {certificates.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {certificates.map((cert, index) => (
                                <div key={index} className="bg-secondary p-4 rounded-md">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-bold text-white">{cert.teamName}</p>
                                        <span className="text-xs font-semibold px-2 py-1 rounded bg-accent/30 text-accent">{cert.type}</span>
                                    </div>
                                    <p className="text-xs text-dark-text">Awarded: {cert.awardedAt.toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-dark-text text-center mt-8">No certificates awarded yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageCertificates;
