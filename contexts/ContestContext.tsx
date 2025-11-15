import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Round, MCQ, CodingProblem, Round1Submission, Round2Submission, ContestContextType, Round2Problem, Certificate, CertificateType } from '../types';
import { mockRounds, mockMCQs, mockCodingProblems, mockSubmissions, mockRound2Problem, mockCertificates } from '../data/mockData';
import { supabase } from '../lib/supabaseClient';

export const ContestContext = createContext<ContestContextType | undefined>(undefined);

const POINTS_PER_MCQ = 10;

interface ContestProviderProps {
  children: ReactNode;
}


export const ContestProvider: React.FC<ContestProviderProps> = ({ children }) => {
    const [rounds, setRounds] = useState<Round[]>(mockRounds);
    const [mcqs, setMcqs] = useState<MCQ[]>(mockMCQs);
    const [codingProblems, setCodingProblems] = useState<CodingProblem[]>(mockCodingProblems);
    const [submissions, setSubmissions] = useState<Round1Submission[]>(mockSubmissions);
    const [round2Problem, setRound2Problem] = useState<Round2Problem>(mockRound2Problem);
    const [round2Submissions, setRound2Submissions] = useState<Round2Submission[]>([]);
    const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);


    // Load rounds from Supabase
    const loadRounds = async () => {
        try {
            const { data, error } = await supabase.from('rounds').select('*').order('id');
            if (!error && data) {
                const mapped: Round[] = data.map(r => ({
                    id: r.id,
                    name: r.name,
                    status: r.status,
                    // Support both snake_case and camelCase column names
                    startedAt: (r as any).startedAt ?? (r as any).started_at ?? undefined,
                    durationInMinutes: (r as any).durationInMinutes ?? (r as any).duration_in_minutes ?? undefined,
                }));
                setRounds(mapped);
                return;
            }
        } catch (e) {
            console.warn('Failed to load rounds from Supabase, using mock data', e);
        }
        setRounds(mockRounds);
    };

    // Load MCQs with options from Supabase
    const loadMCQs = async () => {
        try {
            const { data, error } = await supabase.from('mcqs').select('*, mcq_options(*)');
            if (!error && data) {
                const mapped: MCQ[] = data.map(m => ({
                    id: m.id,
                    question: m.question,
                    correctAnswerId: m.correct_answer_id,
                    options: (m.mcq_options || []).map((opt: any) => ({
                        id: opt.id,
                        text: opt.text,
                    })),
                }));
                setMcqs(mapped);
                return;
            }
        } catch (e) {
            console.warn('Failed to load MCQs from Supabase, using mock data', e);
        }
        setMcqs(mockMCQs);
    };

    // Load coding problems with test cases from Supabase
    const loadCodingProblems = async () => {
        try {
            const { data, error } = await supabase.from('coding_problems').select('*, coding_problem_test_cases(*)');
            if (!error && data) {
                const mapped: CodingProblem[] = data.map(p => {
                    const allTestCases = p.coding_problem_test_cases || [];
                    return {
                        id: p.id,
                        title: p.title,
                        description: p.description,
                        displayedTestCases: allTestCases
                            .filter((tc: any) => !tc.is_hidden)
                            .map((tc: any) => ({
                                input: tc.input,
                                expectedOutput: tc.expected_output,
                            })),
                        hiddenTestCases: allTestCases
                            .filter((tc: any) => tc.is_hidden)
                            .map((tc: any) => ({
                                input: tc.input,
                                expectedOutput: tc.expected_output,
                            })),
                    };
                });
                setCodingProblems(mapped);
                return;
            }
        } catch (e) {
            console.warn('Failed to load coding problems from Supabase, using mock data', e);
        }
        setCodingProblems(mockCodingProblems);
    };

    // Load submissions from Supabase
    const loadSubmissions = async () => {
        try {
            console.log('📥 Loading submissions from Supabase...');
            // Load round1_submissions with related data
            const { data: submissionsData, error: submissionsError } = await supabase
                .from('round1_submissions')
                .select('*')
                .order('submitted_at', { ascending: false });
            
            if (submissionsError) {
                console.warn('❌ Supabase error:', submissionsError.message);
                throw submissionsError;
            }

            if (submissionsData && submissionsData.length > 0) {
                console.log(`✅ Loaded ${submissionsData.length} submissions from round1_submissions`);
                
                // For each submission, load its MCQ and coding answers
                const submissions: Round1Submission[] = [];
                
                for (const sub of submissionsData) {
                    // Load MCQ answers for this submission
                    const { data: mcqAnswersData } = await supabase
                        .from('round1_mcq_answers')
                        .select('mcq_id, answer_id')
                        .eq('submission_id', sub.id);
                    
                    // Load coding answers for this submission
                    const { data: codingAnswersData } = await supabase
                        .from('round1_coding_answers')
                        .select('problem_id, code, language, passed, total')
                        .eq('submission_id', sub.id);
                    
                    // Transform to Round1Submission format
                    const mcqAnswers: Record<string, string> = {};
                    if (mcqAnswersData) {
                        mcqAnswersData.forEach((ans: any) => {
                            mcqAnswers[ans.mcq_id] = ans.answer_id;
                        });
                    }
                    
                    const codingAnswers: Record<string, any> = {};
                    if (codingAnswersData) {
                        codingAnswersData.forEach((ans: any) => {
                            codingAnswers[ans.problem_id] = {
                                code: ans.code,
                                language: ans.language,
                                submissionResult: {
                                    passed: ans.passed || 0,
                                    total: ans.total || 0,
                                },
                            };
                        });
                    }
                    
                        submissions.push({
                            id: sub.id,
                            teamId: sub.team_id,
                            memberId: (sub as any).member_id ?? undefined,
                            submittedAt: new Date(sub.submitted_at),
                            mcqAnswers,
                            codingAnswers,
                            score: sub.score,
                            durationInMinutes: (sub as any).duration_in_minutes ?? undefined,
                        });
                }
                
                setSubmissions(submissions);
                return;
            }
        } catch (e) {
            console.warn('❌ Failed to load submissions from Supabase, using mock data', e);
        }
        console.log('📌 No submissions found in DB — using empty submissions list');
        // If there was an error we already fell back inside the catch to mock submissions.
        // But if the DB returned zero rows, we should not populate the UI with mock submissions
        // because that shows fake leaderboard data. Use an empty list instead.
        setSubmissions([]);
    };

    // Load Round 2 problem from Supabase
    const loadRound2Problem = async () => {
        try {
            const { data, error } = await supabase.from('round2_problem').select('*').limit(1).single();
            if (error) {
                console.warn('❌ Failed to load Round 2 problem from Supabase:', error);
                // Log that we're using fallback
                console.warn('ℹ️  Falling back to mock data. Make sure to:');
                console.warn('   1. Add problem_file_url column to round2_problem table if missing');
                console.warn('   2. Run: npx tsx scripts/seed.ts');
                setRound2Problem(mockRound2Problem);
                return;
            }
            if (data) {
                setRound2Problem({
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    url: data.url,
                    problemFileUrl: data.problem_file_url || null,
                });
                console.log('✅ Loaded Round 2 problem from Supabase');
                return;
            }
        } catch (e) {
            console.warn('❌ Exception loading Round 2 problem:', e);
        }
        console.warn('⚠️  Using mock Round 2 problem');
        setRound2Problem(mockRound2Problem);
    };

    // Load Round 2 submissions from Supabase (table: team_submission)
    const loadRound2Submissions = async () => {
        try {
            const { data, error } = await supabase.from('team_submission').select('*').order('created_at', { ascending: false });
            if (error) {
                console.warn('⚠️  Failed to load Round 2 submissions:', error);
                setRound2Submissions([]);
                return;
            }
            if (data && data.length > 0) {
                const mapped: Round2Submission[] = data.map((s: any) => ({
                    id: s.id,
                    teamId: s.team_id,
                    solutionFileUrl: s.solution_file_url,
                    mae: s.mae ?? null,
                    rmse: s.rmse ?? null,
                    rmsle: s.rmsle ?? null,
                    score: s.score ?? null,
                    rank: s.rank ?? null,
                    submittedAt: new Date(s.created_at || s.submitted_at),
                }));
                setRound2Submissions(mapped);
                console.log(`✅ Loaded ${mapped.length} Round 2 submissions from Supabase`);
                return;
            }
            setRound2Submissions([]);
        } catch (e) {
            console.warn('❌ Exception loading Round 2 submissions:', e);
            setRound2Submissions([]);
        }
    };

    // Load certificates from Supabase
    const loadCertificates = async () => {
        try {
            const { data, error } = await supabase.from('certificates').select('*');
            if (!error && data) {
                const mapped: Certificate[] = data.map(c => ({
                    teamId: c.team_id,
                    teamName: c.team_name,
                    type: c.type,
                    awardedAt: new Date(c.awarded_at),
                }));
                setCertificates(mapped);
                return;
            }
        } catch (e) {
            console.warn('Failed to load certificates from Supabase, using mock data', e);
        }
        setCertificates(mockCertificates);
    };

    useEffect(() => {
        let roundsChannel: any = null;
        let mcqsChannel: any = null;
        let problemsChannel: any = null;
        let submissionsChannel: any = null;
        let certificatesChannel: any = null;
        let round2SubmissionsChannel: any = null;

        const initData = async () => {
            console.log('🚀 ContestContext: Initializing data from Supabase...');
            // Load all data
            await Promise.all([
                loadRounds(),
                loadMCQs(),
                loadCodingProblems(),
                loadSubmissions(),
                loadRound2Problem(),
                loadRound2Submissions(),
                loadCertificates(),
            ]);
            console.log('✨ ContestContext: Data initialization complete');

            // Subscribe to realtime changes
            try {
                console.log('📡 Setting up realtime subscriptions...');
                roundsChannel = supabase.channel('public:rounds')
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'rounds' }, () => {
                        loadRounds();
                    })
                    .subscribe();

                mcqsChannel = supabase.channel('public:mcqs')
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'mcqs' }, () => {
                        loadMCQs();
                    })
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'mcq_options' }, () => {
                        loadMCQs();
                    })
                    .subscribe();

                problemsChannel = supabase.channel('public:problems')
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'coding_problems' }, () => {
                        loadCodingProblems();
                    })
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'coding_problem_test_cases' }, () => {
                        loadCodingProblems();
                    })
                    .subscribe();

                submissionsChannel = supabase.channel('public:submissions')
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'round1_submissions' }, () => {
                        loadSubmissions();
                    })
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'round1_mcq_answers' }, () => {
                        loadSubmissions();
                    })
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'round1_coding_answers' }, () => {
                        loadSubmissions();
                    })
                    .subscribe();

                certificatesChannel = supabase.channel('public:certificates')
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'certificates' }, () => {
                        loadCertificates();
                    })
                    .subscribe();

                round2SubmissionsChannel = supabase.channel('public:team_submission')
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'team_submission' }, () => {
                        loadRound2Submissions();
                    })
                    .subscribe();

                console.log('✅ Realtime subscriptions established');
            } catch (e) {
                console.warn('Failed to subscribe to realtime updates', e);
            }
        };

        initData();

        return () => {
            if (roundsChannel) roundsChannel.unsubscribe();
            if (mcqsChannel) mcqsChannel.unsubscribe();
            if (problemsChannel) problemsChannel.unsubscribe();
            if (submissionsChannel) submissionsChannel.unsubscribe();
            if (certificatesChannel) certificatesChannel.unsubscribe();
            if (round2SubmissionsChannel) round2SubmissionsChannel.unsubscribe();
        };
    }, []);

   const startRound = async (roundId: number) => {
    const startedAt = new Date().toISOString();

    try {
        // Try camelCase column first (startedAt), then fall back to snake_case (started_at)
        let res = await supabase
            .from('rounds')
            .update({ status: 'Active', startedAt: startedAt })
            .eq('id', roundId)
            .select();

        if ((res as any).error) {
            // Try snake_case version
            const { error } = await supabase
                .from('rounds')
                .update({ status: 'Active', started_at: startedAt })
                .eq('id', roundId)
                .select();

            if (error) {
                console.error('❌ Failed to persist startRound to Supabase (both variants):', error);
                alert('Failed to start round: ' + (error.message || JSON.stringify(error)));
                await loadRounds();
                return;
            }
        }

        // Refresh from DB to pick up the persisted change (and any triggers)
        await loadRounds();
    } catch (e) {
        console.error('❌ Error persisting startRound to Supabase:', e);
        alert('Failed to start round: ' + String(e));
        await loadRounds();
    }
};


    const endRound = async (roundId: number) => {
            try {
            // Try camelCase first
            let res = await supabase
                .from('rounds')
                .update({ status: 'Finished' })
                .eq('id', roundId)
                .select();

            if ((res as any).error) {
                // Try snake_case fallback
                const { error } = await supabase
                    .from('rounds')
                    .update({ status: 'Finished' })
                    .eq('id', roundId)
                    .select();
                if (error) {
                    console.error('❌ Failed to persist endRound to Supabase (both variants):', error);
                    alert('Failed to end round: ' + (error.message || JSON.stringify(error)));
                    await loadRounds();
                    return;
                }
            }

            if (roundId === 1) {
                // Unlock round 2: try both variants (status only, no startedAt here)
                let unlockRes = await supabase
                    .from('rounds')
                    .update({ status: 'Not Started' })
                    .eq('id', 2)
                    .select();
                if ((unlockRes as any).error) {
                    const { error: unlockErr } = await supabase
                        .from('rounds')
                        .update({ status: 'Not Started' })
                        .eq('id', 2)
                        .select();
                    if (unlockErr) {
                        console.error('❌ Failed to persist unlock of round 2 to Supabase (both variants):', unlockErr);
                        alert('Failed to unlock round 2: ' + (unlockErr.message || JSON.stringify(unlockErr)));
                    }
                }
            }

            // Refresh local state from DB
            await loadRounds();
        } catch (e) {
            console.error('❌ Error persisting endRound to Supabase:', e);
            alert('Failed to end round: ' + String(e));
            await loadRounds();
        }
    };
    
    const setRoundDuration = async (roundId: number, duration: number) => {
        try {
            // Try camelCase first, then snake_case
            let res = await supabase
                .from('rounds')
                .update({ durationInMinutes: duration })
                .eq('id', roundId)
                .select();

            if ((res as any).error) {
                const { error } = await supabase
                    .from('rounds')
                    .update({ duration_in_minutes: duration })
                    .eq('id', roundId)
                    .select();
                if (error) {
                    console.error('❌ Failed to persist setRoundDuration to Supabase (both variants):', error);
                    alert('Failed to set duration: ' + (error.message || JSON.stringify(error)));
                    await loadRounds();
                    return;
                }
            }

            await loadRounds();
        } catch (e) {
            console.error('❌ Error persisting setRoundDuration to Supabase:', e);
            alert('Failed to set duration: ' + String(e));
            await loadRounds();
        }
    };

    const addMcq = async (mcq: Omit<MCQ, 'id'>) => {
        const newMcqId = `mcq-${Date.now()}`;
        const newMcq = { ...mcq, id: newMcqId };
        
        // Optimistically update local state
        setMcqs(prev => [...prev, newMcq]);

        // Persist to Supabase
        try {
            // Insert MCQ
            const { error: mcqError } = await supabase
                .from('mcqs')
                .insert({
                    id: newMcqId,
                    question: mcq.question,
                    correct_answer_id: mcq.correctAnswerId,
                });
            if (mcqError) {
                console.error('❌ Failed to insert MCQ:', mcqError);
                alert('Failed to add MCQ: ' + (mcqError.message || JSON.stringify(mcqError)));
                // Reload from DB to revert optimistic change
                await loadMCQs();
                return;
            }

            // Insert MCQ options
            const optionsData = mcq.options.map(opt => ({
                id: opt.id,
                mcq_id: newMcqId,
                text: opt.text,
            }));
            const { error: optError } = await supabase
                .from('mcq_options')
                .insert(optionsData);
            if (optError) {
                console.error('❌ Failed to insert MCQ options:', optError);
                alert('Failed to add MCQ options: ' + (optError.message || JSON.stringify(optError)));
                await loadMCQs();
                return;
            }

            console.log('✅ MCQ saved to Supabase:', newMcqId);
        } catch (e) {
            console.error('❌ Error saving MCQ to Supabase:', e);
            alert('Error adding MCQ: ' + String(e));
            await loadMCQs();
        }
    };

    const addCodingProblem = async (problem: Omit<CodingProblem, 'id' | 'displayedTestCases' | 'hiddenTestCases'> & { displayedTestCases?: any[], hiddenTestCases?: any[] }) => {
       const newProblemId = `cp-${Date.now()}`;
       const newProblem: CodingProblem = { 
           ...problem, 
           id: newProblemId,
           displayedTestCases: problem.displayedTestCases || [], 
           hiddenTestCases: problem.hiddenTestCases || [] 
        };
       
       // Optimistically update local state
       setCodingProblems(prev => [...prev, newProblem]);

       // Persist to Supabase
       try {
           // Insert coding problem
           const { error: probError } = await supabase
               .from('coding_problems')
               .insert({
                   id: newProblemId,
                   title: problem.title,
                   description: problem.description,
               });
           if (probError) {
               console.error('❌ Failed to insert coding problem:', probError);
               alert('Failed to add coding problem: ' + (probError.message || JSON.stringify(probError)));
               await loadCodingProblems();
               return;
           }

           // Insert test cases
           const testCases = [
               ...(problem.displayedTestCases || []).map(tc => ({
                   problem_id: newProblemId,
                   input: tc.input,
                   expected_output: tc.expectedOutput,
                   is_hidden: false,
               })),
               ...(problem.hiddenTestCases || []).map(tc => ({
                   problem_id: newProblemId,
                   input: tc.input,
                   expected_output: tc.expectedOutput,
                   is_hidden: true,
               })),
           ];

           if (testCases.length > 0) {
               const { error: tcError } = await supabase
                   .from('coding_problem_test_cases')
                   .insert(testCases);
               if (tcError) {
                   console.error('❌ Failed to insert test cases:', tcError);
                   alert('Failed to add test cases: ' + (tcError.message || JSON.stringify(tcError)));
                   await loadCodingProblems();
                   return;
               }
           }

           console.log('✅ Coding problem saved to Supabase:', newProblemId);
       } catch (e) {
           console.error('❌ Error saving coding problem to Supabase:', e);
           alert('Error adding coding problem: ' + String(e));
           await loadCodingProblems();
       }
    };

    const submitRound1 = async (submission: Omit<Round1Submission, 'submittedAt'|'score'>) => {
        console.log('📤 Submitting Round 1...', { submission });
        const newSubmission: Round1Submission = { ...submission, submittedAt: new Date() };
        setSubmissions(prev => [...prev, newSubmission]);
        // Save to Supabase
        try {
            // Compute duration if round start exists
            const round1 = rounds.find(r => r.id === 1);
            let durationInMinutes = submission.durationInMinutes;
            if (round1 && round1.startedAt && !durationInMinutes) {
                try {
                    const start = new Date(round1.startedAt);
                    durationInMinutes = (newSubmission.submittedAt.getTime() - start.getTime()) / 60000;
                    console.log('📊 Calculated duration:', durationInMinutes, 'minutes');
                } catch (e) {
                    console.warn('⚠️  Failed to parse start time:', e);
                }
            }

            const insertPayload: any = {
                team_id: submission.teamId,
                submitted_at: newSubmission.submittedAt.toISOString(),
            };
            if (submission.memberId) {
                insertPayload.member_id = submission.memberId;
                console.log('👤 Adding memberId:', submission.memberId);
            }
            if (durationInMinutes !== undefined) {
                insertPayload.duration_in_minutes = Math.round(durationInMinutes);
                console.log('⏱️  Adding duration:', Math.round(durationInMinutes), 'minutes');
            }

            console.log('💾 Saving to DB:', insertPayload);

            const { data: submissionData, error: subError } = await supabase
                .from('round1_submissions')
                .insert(insertPayload)
                .select();
            if (subError) {
                console.error('❌ Error saving submission:', subError);
                throw new Error('Failed to save submission: ' + (subError.message || JSON.stringify(subError)));
            }
            const submissionId = submissionData?.[0]?.id;
            if (!submissionId) {
                console.error('❌ No submission ID returned');
                throw new Error('No submission ID returned from Supabase');
            }
            console.log('✅ Submission saved with ID:', submissionId);

            // update local submission with id and duration/memberId if present
            const savedSubmission: Round1Submission = {
                ...newSubmission,
                id: submissionId,
                memberId: submission.memberId ?? undefined,
                durationInMinutes: durationInMinutes ?? undefined,
            };

            // replace optimistic entry (we previously pushed newSubmission) with savedSubmission
            setSubmissions(prev => {
                // remove the optimistic one (matched by submittedAt) then append saved
                const filtered = prev.filter(p => p.submittedAt.getTime() !== newSubmission.submittedAt.getTime());
                return [...filtered, savedSubmission];
            });
            
            // Insert MCQ answers
            const mcqAnswersData = Object.entries(submission.mcqAnswers).map(([mcqId, optionId]) => ({
                submission_id: submissionId,
                mcq_id: mcqId,
                answer_id: optionId,
            }));
            if (mcqAnswersData.length > 0) {
                const { error: mcqError } = await supabase
                    .from('round1_mcq_answers')
                    .insert(mcqAnswersData);
                if (mcqError) {
                    console.error('❌ Error saving MCQ answers:', mcqError);
                }
            }
            
            // Insert coding answers
            const codingAnswersData = Object.entries(submission.codingAnswers).map(([problemId, answer]: [string, any]) => ({
                submission_id: submissionId,
                problem_id: problemId,
                code: answer.code,
                language: answer.language,
                passed: answer.submissionResult?.passed || 0,
                total: answer.submissionResult?.total || 0,
            }));
            if (codingAnswersData.length > 0) {
                const { error: codingError } = await supabase
                    .from('round1_coding_answers')
                    .insert(codingAnswersData);
                if (codingError) {
                    console.error('❌ Error saving coding answers:', codingError);
                }
            }
            console.log('✅ Submission successfully saved to Supabase');
        } catch (e) {
            console.error('❌ Failed to save submission:', e);
            throw e;  // Re-throw so caller knows there was an error
        }
    };
    
    const updateRound2Problem = (problem: Round2Problem) => {
        setRound2Problem(problem);
    };
    
    // Calculate score for a team submission
    const calculateRound1Score = async (teamId: string) => {
        const teamSubs = submissions.filter(s => s.teamId === teamId);
        if (teamSubs.length === 0) return;

        const updates: Array<Promise<any>> = [];
        const updatedMap: Record<string | number, number> = {};

        for (const submission of teamSubs) {
            let score = 0;
            let wrongAnswers = 0;

            // MCQ scoring (first 5 MCQs)
            const mcqEntries = Object.entries(submission.mcqAnswers || {});
            const mcqsToScore = mcqEntries.slice(0, 5);
            mcqsToScore.forEach(([mcqId, answerId]) => {
                const mcq = mcqs.find(q => q.id === mcqId);
                if (!mcq) return;
                if (mcq.correctAnswerId === answerId) {
                    score += 20; // 20 points per MCQ
                } else {
                    wrongAnswers++;
                }
            });

            // Coding scoring
            let codingScore = 0;
            let totalCases = 0;
            let passedCases = 0;
            for (const problemId in submission.codingAnswers || {}) {
                const codingAns = submission.codingAnswers[problemId];
                if (!codingAns || !codingAns.submissionResult) continue;
                passedCases += codingAns.submissionResult.passed || 0;
                totalCases += codingAns.submissionResult.total || 0;
            }
            if (totalCases > 0) {
                codingScore = (passedCases / totalCases) * 40; // 40 points for coding
            }
            score += codingScore;

            // Time scoring (if duration available)
            let minutesTaken = submission.durationInMinutes ?? 0;
            minutesTaken += wrongAnswers * 5; // penalty per wrong
            if (minutesTaken <= 10) score += 10;
            const round1 = rounds.find(r => r.id === 1);
            if (round1 && round1.durationInMinutes && minutesTaken > round1.durationInMinutes) {
                const late = minutesTaken - round1.durationInMinutes;
                score -= late * 0.2;
            }

            if (score < 0) score = 0;
            const finalScore = Math.round(score);
            // update map
            if (submission.id !== undefined) updatedMap[submission.id] = finalScore;

            // persist per-submission score if we have an id
            if (submission.id !== undefined) {
                updates.push((async () => {
                    try {
                        const res = await supabase.from('round1_submissions').update({ score: finalScore }).eq('id', submission.id).select();
                        return res;
                    } catch (e) {
                        return { error: e };
                    }
                })());
            }
        }

        // apply updates to DB
        try {
            await Promise.all(updates);
        } catch (e) {
            console.error('❌ Error saving per-submission scores:', e);
        }

        // update local state
        setSubmissions(prev => prev.map(s => {
            if (s.id !== undefined && updatedMap[s.id] !== undefined) {
                return { ...s, score: updatedMap[s.id] };
            }
            return s;
        }));

        // Log average for convenience
        const scored = Object.values(updatedMap);
        if (scored.length > 0) {
            const avg = Math.round(scored.reduce((a, b) => a + b, 0) / scored.length);
            console.log(`✅ Calculated and saved scores for team ${teamId}. Average: ${avg}`);
        }
    };
    
    const awardCertificate = (teamId: string, teamName: string, type: CertificateType) => {
        const newCertificate: Certificate = { 
            teamId, 
            teamName, 
            type, 
            awardedAt: new Date() 
        };
        setCertificates(prev => [...prev, newCertificate]);
    };

    const submitRound2 = async (submission: Omit<Round2Submission, 'submittedAt'>) => {
        const newSubmission: Round2Submission = { ...submission, submittedAt: new Date() };
        setRound2Submissions(prev => [...prev, newSubmission]);

        try {
            const { data, error } = await supabase
                .from('team_submission')
                .insert({
                    team_id: submission.teamId,
                    solution_file_url: submission.solutionFileUrl,
                    mae: (submission as any).mae ?? null,
                    rmse: (submission as any).rmse ?? null,
                    rmsle: (submission as any).rmsle ?? null,
                    score: (submission as any).score ?? null,
                    rank: (submission as any).rank ?? null,
                    created_at: newSubmission.submittedAt.toISOString(),
                })
                .select();

            console.log('📤 submitRound2 response:', { data, error });

            if (error) {
                console.error('❌ Error saving Round 2 submission to team_submission:', error);
                // remove optimistic entry
                setRound2Submissions(prev => prev.filter(p => p.submittedAt.getTime() !== newSubmission.submittedAt.getTime()));
                throw new Error(error.message || JSON.stringify(error));
            }

            const submissionRow = data?.[0];
            const submissionId = submissionRow?.id;
            if (submissionId) {
                const savedSubmission: Round2Submission = {
                    ...newSubmission,
                    id: submissionId,
                    mae: submissionRow.mae ?? null,
                    rmse: submissionRow.rmse ?? null,
                    rmsle: submissionRow.rmsle ?? null,
                    score: submissionRow.score ?? null,
                    rank: submissionRow.rank ?? null,
                    submittedAt: new Date(submissionRow.created_at || submissionRow.submitted_at || newSubmission.submittedAt),
                };
                setRound2Submissions(prev => {
                    const filtered = prev.filter(p => p.submittedAt.getTime() !== newSubmission.submittedAt.getTime());
                    return [...filtered, savedSubmission];
                });
            } else {
                // no row returned; remove optimistic entry and throw
                setRound2Submissions(prev => prev.filter(p => p.submittedAt.getTime() !== newSubmission.submittedAt.getTime()));
                throw new Error('No submission row returned from database');
            }
            console.log('✅ Round 2 submission saved to team_submission');
            return data?.[0];
        } catch (e: any) {
            console.error('❌ Failed to save Round 2 submission (throwing):', e);
            throw e;
        }
    };

    const getTeamRound2Submission = (teamId: string) => round2Submissions.find(s => s.teamId === teamId);

    const getRoundById = (roundId: number) => rounds.find(r => r.id === roundId);
    const getTeamSubmission = (teamId: string) => submissions.find(s => s.teamId === teamId);
    const getTeamMemberSubmission = (teamId: string, memberId: string) => submissions.find(s => s.teamId === teamId && s.memberId === memberId);

    const value: ContestContextType = {
        rounds, mcqs, codingProblems, submissions, round2Problem, round2Submissions, certificates,
        startRound, endRound, setRoundDuration, addMcq, addCodingProblem,
        submitRound1, submitRound2, getRoundById, getTeamSubmission, getTeamMemberSubmission, getTeamRound2Submission, updateRound2Problem,
        calculateRound1Score, awardCertificate,
    };

    return (
        <ContestContext.Provider value={value}>
            {children}
        </ContestContext.Provider>
    );
};
