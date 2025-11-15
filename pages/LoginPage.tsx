import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import Section from '../components/Section';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/dashboard";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const loggedInUser = await auth.login(email, password);
            if (loggedInUser.role === UserRole.ADMIN) {
                navigate('/admin', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } catch (err: any) {
            setError(err.message || 'Failed to log in');
        }
    };

    return (
        <div className="animate-fade-in-up">
            <Section title="Login" subtitle="Access your dashboard.">
                <div className="max-w-md mx-auto bg-secondary p-8 rounded-lg shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md text-center">{error}</p>}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-2">Email Address</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-primary p-3 rounded-md border border-secondary focus:ring-accent focus:border-accent" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-dark-text mb-2">Password</label>
                            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-primary p-3 rounded-md border border-secondary focus:ring-accent focus:border-accent" />
                        </div>
                            <button type="submit" className="w-full bg-frozen-ice hover:bg-frozen-ice/80 text-white font-bold py-3 px-4 rounded-md transition-colors">
                            Log In
                        </button>
                    </form>
                        <p className="text-center text-sm text-dark-text mt-6">
                            Don't have an account? <NavLink to="/signup" className="font-medium text-frozen-ice hover:underline">Sign Up</NavLink>
                        </p>
                </div>
            </Section>
        </div>
    );
};

export default LoginPage;