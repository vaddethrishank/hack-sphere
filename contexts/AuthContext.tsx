import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, UserRole, Team, TeamMember } from '../types';
import { supabase } from '../lib/supabaseClient';
import { mockTeams } from '../data/mockData';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [teams, setTeams] = useState<Team[]>(mockTeams);
    const [loading, setLoading] = useState(true);

    // Fetch teams from DB (fallback to mock)
    const loadTeams = async () => {
        try {
            const { data, error } = await supabase.from('teams').select('*');
            if (!error && data) {
                // Map DB rows to Team type
                const mapped: Team[] = data.map((t: any) => ({
                    id: t.id,
                    name: t.name,
                    college: t.college,
                    members: [], // team_members handled separately when needed
                    paymentScreenshotUrl: t.payment_screenshot_url || null,
                    status: t.status,
                }));
                setTeams(mapped);
                return;
            }
        } catch (e) {
            console.warn('Failed to load teams from DB, using mock teams', e);
        }
        setTeams(mockTeams);
    };

    useEffect(() => {
        let authListener: { data: { subscription: any } } | null = null;

        const init = async () => {
            // Load existing session
            try {
                const {
                    data: { session }
                } = await supabase.auth.getSession();

                if (session?.user) {
                    await hydrateUserFromProfile(session.user.id);
                }
            } catch (e) {
                console.warn('Error fetching session', e);
            }

            // Listen to auth state changes
            authListener = supabase.auth.onAuthStateChange((_event, session) => {
                if (session?.user) {
                    hydrateUserFromProfile(session.user.id);
                } else {
                    setUser(null);
                }
            });

            // Load teams
            await loadTeams();

            setLoading(false);
        };

        init();

        return () => {
            if (authListener && authListener.data && authListener.data.subscription) {
                authListener.data.subscription.unsubscribe();
            }
        };
    }, []);

    const hydrateUserFromProfile = async (authId: string): Promise<User | null> => {
        try {
            const { data, error } = await supabase.from('users').select('*').eq('id', authId).single();
            if (!error && data) {
                const profileUser: User = {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    role: data.role as UserRole,
                    teamId: data.team_id || undefined,
                };
                setUser(profileUser);
                localStorage.setItem('hackathon-user', JSON.stringify(profileUser));
                return profileUser;
            }
            // If no profile found, create a basic one using auth user metadata
            const { data: authUserResp } = await supabase.auth.getUser();
            const authUser = authUserResp?.data.user;
            const email = authUser?.email ?? '';
            const name = (authUser?.user_metadata as any)?.name ?? '';
            const newProfile = {
                id: authId,
                name,
                email,
                role: UserRole.GUEST,
                team_id: null,
            };
            await supabase.from('users').insert(newProfile);
            const createdUser: User = { id: authId, name, email, role: UserRole.GUEST };
            setUser(createdUser);
            localStorage.setItem('hackathon-user', JSON.stringify(createdUser));
            return createdUser;
        } catch (e) {
            console.error('Failed to hydrate user profile', e);
            return null;
        }
    };


    const login = async (email: string, pass: string): Promise<User> => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) {
            throw error;
        }
        if (!data?.user) throw new Error('No user in session after login');

        const profile = await hydrateUserFromProfile(data.user.id);
        if (profile) return profile;

        // fallback to localStorage
        const stored = localStorage.getItem('hackathon-user');
        if (stored) return JSON.parse(stored) as User;
        throw new Error('Failed to load user after login');
    };

    const signup = async (name: string, email: string, pass: string): Promise<void> => {
        // Use Supabase auth signUp which will send a confirmation email based on your Supabase settings
        const { data, error } = await supabase.auth.signUp({ email, password: pass, options: { data: { name } } });
        if (error) throw error;

        // If the user object is present (depending on confirm settings), create profile row
        if (data?.user?.id) {
            const profile = {
                id: data.user.id,
                name,
                email,
                role: UserRole.GUEST,
                team_id: null,
            };
            await supabase.from('users').upsert(profile);
        }

        // Do NOT log the user in here; Supabase may require email confirmation. Inform UI to check email.
    };

    const signupAdmin = async (name: string, email: string, pass: string): Promise<void> => {
        // This creates an auth user and a profile with admin role
        const { data, error } = await supabase.auth.signUp({ email, password: pass, options: { data: { name } } });
        if (error) throw error;
        if (data?.user?.id) {
            const profile = {
                id: data.user.id,
                name,
                email,
                role: UserRole.ADMIN,
                team_id: null,
            };
            await supabase.from('users').upsert(profile);
        }
    };

    const registerTeam = async (teamName: string, college: string, members: TeamMember[], paymentScreenshot: File): Promise<string> => {
        if (!user) throw new Error("You must be logged in to register a team.");
        if (user.teamId) throw new Error("You are already part of a team.");

        // Upload payment screenshot to Supabase storage (optional)
        let screenshotUrl: string | null = null;
        try {
            const fileName = `payment-${Date.now()}-${paymentScreenshot.name}`;
            const upload = await supabase.storage.from('payments').upload(fileName, paymentScreenshot);
            if (upload.error) {
                console.warn('Failed to upload screenshot', upload.error);
            } else {
                const { data } = supabase.storage.from('payments').getPublicUrl(fileName);
                screenshotUrl = data.publicUrl;
            }
        } catch (e) {
            console.warn('Error uploading screenshot', e);
        }

        const newTeamId = `team-${Date.now()}`;
        const { error } = await supabase.from('teams').insert({ id: newTeamId, name: teamName, college, payment_screenshot_url: screenshotUrl, status: 'Pending' });
        if (error) throw error;

        // Insert team members
        for (const m of members) {
            await supabase.from('team_members').insert({ team_id: newTeamId, name: m.name, email: m.email, role: m.role });
        }

        // Update user profile to be team leader
        await supabase.from('users').update({ role: UserRole.TEAM_LEADER, team_id: newTeamId }).eq('id', user.id);

        const updatedUser = { ...user, role: UserRole.TEAM_LEADER, teamId: newTeamId };
        setUser(updatedUser);
        localStorage.setItem('hackathon-user', JSON.stringify(updatedUser));

        // Refresh teams
        await loadTeams();

        return newTeamId;
    };

    const approveTeam = async (teamId: string) => {
        await supabase.from('teams').update({ status: 'Approved' }).eq('id', teamId);
        await loadTeams();
    };

    const rejectTeam = async (teamId:string) => {
        await supabase.from('teams').update({ status: 'Rejected' }).eq('id', teamId);
        await loadTeams();
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        localStorage.removeItem('hackathon-user');
    };

    return (
        <AuthContext.Provider value={{ user, teams, login, signup, signupAdmin, logout, loading, registerTeam, approveTeam, rejectTeam }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};