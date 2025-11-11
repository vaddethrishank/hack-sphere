import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Team } from '../../types';

const TeamCard: React.FC<{ team: Team }> = ({ team }) => {
    const { approveTeam, rejectTeam } = useAuth();

    const getStatusClasses = (status: Team['status']) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-600/20 text-green-400';
            case 'Pending':
                return 'bg-yellow-600/20 text-yellow-400';
            case 'Rejected':
                return 'bg-red-600/20 text-red-400';
        }
    };
    
    return (
        <details className="bg-primary rounded-lg shadow-lg overflow-hidden">
            <summary className="p-6 cursor-pointer flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold text-white">{team.name}</h3>
                    <p className="text-sm text-gray-400">{team.college}</p>
                </div>
                <div className="flex items-center gap-4">
                     <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(team.status)}`}>
                        {team.status}
                    </span>
                    <span className="text-sm font-medium text-accent">{team.members.length} Members</span>
                </div>
            </summary>
            <div className="bg-secondary p-6 border-t border-primary">
                <h4 className="font-semibold text-white mb-4">Team Members:</h4>
                <ul className="space-y-3">
                    {team.members.map(member => (
                        <li key={member.id} className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-medium text-dark-text">{member.name}</p>
                                <p className="text-gray-400">{member.email}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${member.role === 'Leader' ? 'bg-highlight/20 text-highlight' : 'bg-accent/20 text-accent'}`}>
                                {member.role}
                            </span>
                        </li>
                    ))}
                </ul>
                 <div className="mt-4 pt-4 border-t border-primary/50 flex justify-between items-center">
                    <div>
                        <h4 className="font-semibold text-white mb-2">Payment Status:</h4>
                        {team.paymentScreenshotUrl ? (
                            <a 
                                href={team.paymentScreenshotUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded transition-colors"
                            >
                                View Screenshot
                            </a>
                        ) : (
                            <p className="text-sm text-yellow-400">Screenshot Not Provided</p>
                        )}
                    </div>
                    {team.status === 'Pending' && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => approveTeam(team.id)}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                            >
                                Approve
                            </button>
                             <button
                                onClick={() => rejectTeam(team.id)}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </details>
    );
};

type FilterStatus = 'Pending' | 'Approved' | 'Rejected' | 'All';

const ManageTeams: React.FC = () => {
    const { teams } = useAuth();
    const [filter, setFilter] = useState<FilterStatus>('Pending');
    const [currentTeams, setCurrentTeams] = useState<Team[]>(teams);

    useEffect(() => {
        setCurrentTeams(teams);
    }, [teams]);


    const filteredTeams = useMemo(() => {
        if (filter === 'All') {
            return currentTeams;
        }
        return currentTeams.filter(team => team.status === filter);
    }, [currentTeams, filter]);

    const getCount = (status: FilterStatus) => {
        if (status === 'All') return currentTeams.length;
        return currentTeams.filter(team => team.status === status).length;
    };

    const FilterButton: React.FC<{ status: FilterStatus }> = ({ status }) => (
        <button
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full font-semibold transition-colors text-sm ${
                filter === status
                    ? 'bg-accent text-white'
                    : 'bg-primary text-dark-text hover:bg-secondary'
            }`}
        >
            {status} ({getCount(status)})
        </button>
    );

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold text-white mb-4">Manage Teams</h1>
            
            <div className="flex items-center gap-2 mb-8 p-2 bg-secondary rounded-full w-fit">
                <FilterButton status="Pending" />
                <FilterButton status="Approved" />
                <FilterButton status="Rejected" />
                <FilterButton status="All" />
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-300 mb-6">{filter} Teams ({filteredTeams.length})</h2>

            {filteredTeams.length > 0 ? (
                <div className="space-y-6">
                    {filteredTeams.map(team => (
                        <TeamCard key={team.id} team={team} />
                    ))}
                </div>
            ) : (
                <div className="text-center bg-primary p-8 rounded-lg">
                    <p className="text-dark-text">No teams found for the "{filter}" filter.</p>
                </div>
            )}
        </div>
    );
};

export default ManageTeams;
