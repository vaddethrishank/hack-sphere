import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
    const linkClasses = "flex items-center px-4 py-3 text-dark-text/80 rounded-lg hover:bg-secondary hover:text-white transition-colors";
    const activeLinkClasses = "bg-accent text-white";

    const links = [
        { path: '/admin', name: 'Overview', exact: true },
        { path: '/admin/rounds', name: 'Manage Rounds' },
        { path: '/admin/teams', name: 'Manage Teams' },
        { path: '/admin/mcqs', name: 'Manage Round 1' },
        { path: '/admin/problems', name: 'Manage Round 2' },
        { path: '/admin/results', name: 'Manage Results' },
        { path: '/admin/certificates', name: 'Manage Certificates' },
    ];
    
    return (
        <aside className="w-64 bg-primary text-white flex-shrink-0 p-4">
            <div className="mb-8 text-center">
                 <RouterNavLink to="/" className="text-white font-bold text-xl">
                    HACKATHON '26
                 </RouterNavLink>
                <p className="text-sm text-accent">Admin Panel</p>
            </div>
            <nav className="space-y-2">
                {links.map(link => (
                    <RouterNavLink
                        key={link.name}
                        to={link.path}
                        end={link.exact}
                        className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                    >
                        {/* Icons can be added here later */}
                        <span className="ml-3">{link.name}</span>
                    </RouterNavLink>
                ))}
            </nav>
            <div className="mt-auto pt-4 border-t border-secondary">
                 <RouterNavLink to="/" className="text-sm text-dark-text/60 hover:text-accent transition-colors">
                    &larr; Back to Main Site
                 </RouterNavLink>
            </div>
        </aside>
    );
};

export default AdminSidebar;
