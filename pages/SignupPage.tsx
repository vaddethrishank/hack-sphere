
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, NavLink } from 'react-router-dom';
import Section from '../components/Section';

const SignupPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        try {
            await auth.signup(name, email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to sign up');
        }
    };

    return (
        <div className="animate-fade-in-up">
            <Section title="Create an Account" subtitle="Join Hackathon 2026.">
                <div className="max-w-md mx-auto bg-secondary p-8 rounded-lg shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                         {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md text-center">{error}</p>}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-dark-text mb-2">Full Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-primary p-3 rounded-md border border-secondary focus:ring-accent focus:border-accent" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-2">Email Address</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-primary p-3 rounded-md border border-secondary focus:ring-accent focus:border-accent" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-dark-text mb-2">Password</label>
                            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-primary p-3 rounded-md border border-secondary focus:ring-accent focus:border-accent" />
                        </div>
                        <button type="submit" className="w-full bg-accent hover:bg-accent/80 text-white font-bold py-3 px-4 rounded-md transition-colors">
                            Sign Up
                        </button>
                    </form>
                    <p className="text-center text-sm text-dark-text mt-6">
                        Already have an account? <NavLink to="/login" className="font-medium text-accent hover:underline">Log In</NavLink>
                    </p>
                </div>
            </Section>
        </div>
    );
};

export default SignupPage;
