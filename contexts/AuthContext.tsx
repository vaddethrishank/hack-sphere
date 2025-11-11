import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, UserRole, Team, TeamMember } from '../types';
import { mockUsers, mockTeams } from '../data/mockData';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [teams, setTeams] = useState<Team[]>(mockTeams);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>(mockUsers); // Local copy for signup simulation

    useEffect(() => {
        // Simulate loading session from localStorage
        try {
            const storedUser = localStorage.getItem('hackathon-user');
            if (storedUser) {
                const parsedUser: User = JSON.parse(storedUser);
                // Make sure the user from storage exists in our mock users
                if(users.some(u => u.id === parsedUser.id)) {
                    setUser(parsedUser);
                }
            }
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
            localStorage.removeItem('hackathon-user');
        }
        setLoading(false);
    }, []);

    const login = async (email: string, pass: string): Promise<User> => {
        const foundUser = users.find(u => u.email === email);

        if (!foundUser || foundUser.password !== pass) {
            throw new Error('Invalid email or password.');
        }
        
        // Don't store password in state or localStorage
        const { password, ...userToStore } = foundUser;

        setUser(userToStore as User);
        localStorage.setItem('hackathon-user', JSON.stringify(userToStore));
        return userToStore as User;
    };

    const signup = async (name: string, email: string, pass: string): Promise<void> => {
        if (users.some(u => u.email === email)) {
            throw new Error('An account with this email already exists.');
        }
        const newUser: User = {
            id: `user-${Date.now()}`,
            name,
            email,
            role: UserRole.GUEST,
            password: pass,
        };
        setUsers(prev => [...prev, newUser]);
        
        // Don't store password in state or localStorage
        const { password, ...userToStore } = newUser;
        setUser(userToStore);
        localStorage.setItem('hackathon-user', JSON.stringify(userToStore));
    };
    
    const signupAdmin = async (name: string, email: string, pass: string): Promise<void> => {
        if (users.some(u => u.role === UserRole.ADMIN)) {
            throw new Error("An admin account already exists.");
        }
         if (users.some(u => u.email === email)) {
            throw new Error('An account with this email already exists.');
        }
        const newAdmin: User = {
            id: `admin-${Date.now()}`,
            name,
            email,
            role: UserRole.ADMIN,
            password: pass,
        };
        setUsers(prev => [...prev, newAdmin]);
        
        // Don't store password in state or localStorage
        const { password, ...userToStore } = newAdmin;
        setUser(userToStore);
        localStorage.setItem('hackathon-user', JSON.stringify(userToStore));
    };

    const registerTeam = async (teamName: string, college: string, members: TeamMember[], paymentScreenshot: File): Promise<string> => {
        if (!user) throw new Error("You must be logged in to register a team.");
        if (user.teamId) throw new Error("You are already part of a team.");

        const newTeamId = `team-${Date.now()}`;
        const newTeam: Team = {
            id: newTeamId,
            name: teamName,
            college,
            members,
            paymentScreenshotUrl: URL.createObjectURL(paymentScreenshot),
            status: 'Pending',
        };
        
        setTeams(prev => [...prev, newTeam]);
        
        const updatedUser = { ...user, role: UserRole.TEAM_LEADER, teamId: newTeamId };
        setUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? updatedUser : u));
        localStorage.setItem('hackathon-user', JSON.stringify(updatedUser));
        
        return newTeamId;
    };
    
    const approveTeam = async (teamId: string) => {
        setTeams(prev => prev.map(t => t.id === teamId ? { ...t, status: 'Approved' } : t));
    };

    const rejectTeam = async (teamId:string) => {
        setTeams(prev => prev.map(t => t.id === teamId ? { ...t, status: 'Rejected' } : t));
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('hackathon-user');
    };

    return (
        <AuthContext.Provider value={{ user, teams, login, signup, signupAdmin, logout, loading, registerTeam, approveTeam, rejectTeam }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};