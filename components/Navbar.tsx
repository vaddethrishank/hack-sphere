
import React, { useState } from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { NavLink } from '../types';
import { useAuth } from '../hooks/useAuth';

const navLinks: NavLink[] = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Rounds', path: '/rounds' },
    { name: 'Prizes', path: '/prizes' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQs', path: '/faqs' },
];

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const linkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeLinkClasses = "bg-accent text-white";
    const inactiveLinkClasses = "text-dark-text/80 hover:bg-secondary hover:text-white";
    
    const AuthButtons: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
        if (user) {
            return (
                <div className={`flex items-center space-x-4 ${isMobile ? 'justify-between w-full' : ''}`}>
                    <RouterNavLink to="/dashboard" className="bg-highlight hover:bg-highlight/80 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105">
                        Dashboard
                    </RouterNavLink>
                    <button onClick={handleLogout} className="text-dark-text/80 hover:text-white font-medium">
                        Logout
                    </button>
                    {isMobile && <ThemeToggle />}
                </div>
            );
        }
        return (
            <div className={`flex items-center space-x-2 ${isMobile ? 'justify-between w-full' : ''}`}>
                <RouterNavLink to="/login" className="px-4 py-2 rounded-md text-sm font-medium text-dark-text/80 hover:bg-secondary hover:text-white transition-colors">
                    Login
                </RouterNavLink>
                <RouterNavLink to="/signup" className="bg-accent hover:bg-accent/80 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105">
                    Sign Up
                </RouterNavLink>
                {isMobile && <ThemeToggle />}
            </div>
        );
    };

    return (
        <nav className="bg-primary/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-black/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <RouterNavLink to="/" className="text-white font-bold text-xl flex items-center">
                            <span className="split-H">H</span>ACK <span className="split">S</span>PHERE '26
                        </RouterNavLink>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link) => (
                                <RouterNavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
                                >
                                    {link.name}
                                </RouterNavLink>
                            ))}
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <AuthButtons />
                        <ThemeToggle />
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="bg-secondary inline-flex items-center justify-center p-2 rounded-md text-dark-text hover:text-white hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <RouterNavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => `block ${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
                            >
                                {link.name}
                            </RouterNavLink>
                        ))}
                         <div className="pt-4 border-t border-secondary px-2">
                            <AuthButtons isMobile={true} />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
