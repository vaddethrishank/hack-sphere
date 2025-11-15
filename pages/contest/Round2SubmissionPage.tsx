import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Section from '../../components/Section';
import { useContest } from '../../hooks/useContest';
import { useAuth } from '../../hooks/useAuth';

const Round2SubmissionPage: React.FC = () => {
    const [solutionFile, setSolutionFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const { round2Problem, getRoundById, submitRound2, getTeamRound2Submission } = useContest();
    const { user, teams } = useAuth();
    
    const team = user?.teamId ? teams.find(t => t.id === user.teamId) : null;
    const round2 = getRoundById(2);
    const alreadySubmitted = user?.teamId ? getTeamRound2Submission(user.teamId) : null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSolutionFile(e.target.files[0]);
            setError('');
        }
    };

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (!solutionFile) {
    //         setError('Please select a solution file.');
    //         return;
    //     }

    //     if (!user?.teamId) {
    //         setError('You must be part of a team to submit.');
    //         return;
    //     }

    //     setIsSubmitting(true);
    //     setError('');

    //     try {
    //         // Upload solution file to Supabase storage
    //         const fileName = `round2-solution-${user.teamId}-${Date.now()}.zip`;
    //         const { data: uploadData, error: uploadError } = await (await import('../../lib/supabaseClient')).supabase
    //             .storage
    //             .from('round2_solutions')
    //             .upload(fileName, solutionFile);

    //         if (uploadError) {
    //             setError('Failed to upload solution file: ' + (uploadError.message || JSON.stringify(uploadError)));
    //             setIsSubmitting(false);
    //             return;
    //         }

    //         // Get public URL
    //         const { data: publicUrl } = (await import('../../lib/supabaseClient')).supabase
    //             .storage
    //             .from('round2_solutions')
    //             .getPublicUrl(fileName);

    //         if (!publicUrl?.publicUrl) {
    //             setError('Failed to get public URL for solution file.');
    //             setIsSubmitting(false);
    //             return;
    //         }

    //         // Save submission to database via context
    //         await submitRound2({
    //             teamId: user.teamId,
    //             solutionFileUrl: publicUrl.publicUrl,
    //         });

    //         setIsSubmitted(true);
    //         setSolutionFile(null);
    //     } catch (err: any) {
    //         setError(err.message || 'Failed to submit solution.');
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!solutionFile) {
        setError("Please select a CSV file.");
        return;
    }

    if (!user?.teamId) {
        setError("You must be part of a team to submit.");
        return;
    }

    setIsSubmitting(true);
    setError("");

    try {
        const supabase = (await import("../../lib/supabaseClient")).supabase;

        // 1. Upload CSV file to Supabase Storage
        const fileName = `round2-${user.teamId}-${Date.now()}.csv`;

        const { error: uploadError } = await supabase
            .storage
            .from("round2_solutions")
            .upload(fileName, solutionFile, {
                contentType: "text/csv"
            });

        if (uploadError) {
            setError("Failed to upload CSV file: " + uploadError.message);
            setIsSubmitting(false);
            return;
        }

        // 2. Get public URL for the CSV file
        const { data: urlData } = supabase
            .storage
            .from("round2_solutions")
            .getPublicUrl(fileName);

        if (!urlData?.publicUrl) {
            setError("Failed to fetch public CSV file URL.");
            setIsSubmitting(false);
            return;
        }

        const solutionFileUrl = urlData.publicUrl;

        // 3. Save submission via context (will persist to `team_submission` table)
        try {
            await submitRound2({ teamId: user.teamId, solutionFileUrl });
            setIsSubmitted(true);
            setSolutionFile(null);
        } catch (e: any) {
            setError('Failed to save submission: ' + (e?.message || String(e)));
            setIsSubmitting(false);
            return;
        }

    } catch (err: any) {
        setError(err.message || "Failed to submit solution.");
    } finally {
        setIsSubmitting(false);
    }
};

    
    if (team?.status !== 'Approved') {
        return (
           <Section title="Round 2: Project Submission">
               <div className="text-center bg-secondary p-8 rounded-lg max-w-md mx-auto">
                   <h3 className="text-2xl font-bold text-yellow-400">Team Not Approved</h3>
                   <p className="text-dark-text mt-2">Your team must be approved by an administrator before you can participate in this round.</p>
                   <NavLink to="/dashboard" className="mt-8 inline-block text-frozen-ice hover:underline">
                        &larr; Back to Dashboard
                    </NavLink>
               </div>
           </Section>
       );
   }
    
    if (round2?.status !== 'Active') {
        return (
           <Section title="Round 2: Project Submission">
               <div className="text-center bg-secondary p-8 rounded-lg max-w-md mx-auto">
                   <h3 className="text-2xl font-bold text-yellow-400">
                        {
                            round2?.status === 'Finished' ? 'Round 2 has ended.' :
                            round2?.status === 'Not Started' ? 'Round 2 has not started yet.' :
                            'Round 2 is currently locked.'
                        }
                   </h3>
                   <p className="text-dark-text mt-2">
                       { round2?.status === 'Locked' ? 'This round will be unlocked after Round 1 is complete.' : 'Please wait for an announcement from the event organizers.'}
                    </p>
               </div>
           </Section>
       );
   }

    return (
        <div className="animate-fade-in-up">
            <Section title="Round 2: Project Submission">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-secondary p-8 rounded-lg shadow-lg mb-8">
                        <h3 className="text-2xl font-bold text-frozen-ice mb-4">{round2Problem.title}</h3>
                        <p className="text-dark-text space-y-4 whitespace-pre-wrap">
                           {round2Problem.description}
                        </p>
                        {round2Problem.url && (
                            <div className="mt-6">
                                <a
                                    href={round2Problem.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block bg-frozen-ice hover:bg-frozen-ice/80 text-white font-bold py-2 px-4 rounded-md transition-colors"
                                    aria-label="Download project docs"
                                >
                                    📥 Project Docs
                                </a>
                            </div>
                        )}
                        {round2Problem.problemFileUrl && (
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-white mb-2">Problem File:</h4>
                                <a 
                                    href={round2Problem.problemFileUrl}
                                    download
                                    className="inline-block bg-frozen-ice hover:bg-frozen-ice/80 text-white font-bold py-2 px-4 rounded-md transition-colors"
                                >
                                    📥 Download Problem File
                                </a>
                            </div>
                        )}
                    </div>

                    {alreadySubmitted ? (
                         <div className="text-center p-8 bg-primary rounded-md">
                            <h4 className="text-xl font-semibold text-green-400">Solution Submitted Successfully!</h4>
                            <p className="text-dark-text mt-2">Your Round 2 solution has been received. Thank you for participating!</p>
                            <p className="text-sm text-gray-400 mt-4">Submitted at: {new Date(alreadySubmitted.submittedAt).toLocaleString()}</p>
                        </div>
                    ) : isSubmitted ? (
                         <div className="text-center p-8 bg-primary rounded-md">
                            <h4 className="text-xl font-semibold text-green-400">Solution Submitted Successfully!</h4>
                            <p className="text-dark-text mt-2">Your Round 2 solution has been received. Good luck!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-secondary p-8 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-white mb-4">Submit Your Solution</h3>
                            {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md text-center mb-4">{error}</p>}
                            <p className="text-sm text-gray-400 mb-4">Please upload your solution as a single CSV file (<code>.csv</code>).</p>
                            <div>
                                <label htmlFor="solutionFile" className="sr-only">Upload Solution File</label>
                                <input 
                                    type="file" 
                                    id="solutionFile" 
                                    onChange={handleFileChange} 
                                    required 
                                    accept=".csv"
                                    className="w-full text-sm text-dark-text file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-christmas-red file:text-white hover:file:bg-christmas-red/80" 
                                />
                            </div>
                            <div className="text-center mt-6">
                                <button type="submit" className="bg-christmas-green hover:bg-christmas-green/80 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 disabled:opacity-50" disabled={!solutionFile || isSubmitting}>
                                    {isSubmitting ? 'Uploading...' : 'Submit Solution'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </Section>
        </div>
    );
};

export default Round2SubmissionPage;