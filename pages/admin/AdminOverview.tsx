import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useContest } from '../../hooks/useContest';

const AdminOverview: React.FC = () => {
    const { teams } = useAuth();
    const { submissions, mcqs, codingProblems, certificates } = useContest();

    const stats = [
        { label: 'Total Registrations', value: `${teams.length} Teams` },
        { label: 'Round 1 Submissions', value: `${submissions.length} Teams` },
        { label: 'Active R1 Problems', value: mcqs.length + codingProblems.length },
        { label: 'Certificates Awarded', value: certificates.length },
    ];

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold text-white mb-8">Admin Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stat => (
                    <div key={stat.label} className="bg-primary p-6 rounded-lg shadow-lg">
                        <h3 className="text-sm font-medium text-gray-400">{stat.label}</h3>
                        <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>
            <div className="mt-12 bg-primary p-6 rounded-lg">
                <h2 className="text-xl font-bold text-white">Quick Actions</h2>
                <p className="text-gray-400 mt-2">Use the sidebar to manage rounds, add content, calculate results, and award certificates.</p>
            </div>
        </div>
    );
};

export default AdminOverview;