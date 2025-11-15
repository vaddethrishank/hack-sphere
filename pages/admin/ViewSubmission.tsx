import React from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useContest } from '../../hooks/useContest';
import { MCQ } from '../../types';

const ViewSubmission: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const { teams } = useAuth();
    const { submissions, mcqs, codingProblems } = useContest();

    const team = teams.find(t => t.id === teamId);
    const submission = submissions.find(s => s.teamId === teamId);

    if (!team || !submission) {
        return (
            <div className="text-center">
                <h1 className="text-2xl text-white">Submission not found.</h1>
                <NavLink to="/admin/results" className="text-accent hover:underline mt-4 inline-block">
                    &larr; Back to Results
                </NavLink>
            </div>
        );
    }

    const renderMcqAnswer = (mcq: MCQ) => {
        const userAnswerId = submission.mcqAnswers[mcq.id];
        const isCorrect = userAnswerId === mcq.correctAnswerId;
        const userAnswerText = mcq.options.find(opt => opt.id === userAnswerId)?.text || 'Not Answered';
        const correctAnswerText = mcq.options.find(opt => opt.id === mcq.correctAnswerId)?.text;

        return (
            <div key={mcq.id} className="p-4 bg-secondary rounded-lg">
                <p className="font-semibold text-dark-text mb-2">{mcq.question}</p>
                <p className={`text-sm ${isCorrect ? 'text-christmas-green' : 'text-christmas-red'}`}>
                    Your Answer: <span className="font-mono p-1 bg-primary rounded">{userAnswerText}</span>
                </p>
                {!isCorrect && (
                    <p className="text-sm text-yellow-400 mt-1">
                        Correct Answer: <span className="font-mono p-1 bg-primary rounded">{correctAnswerText}</span>
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="animate-fade-in-up">
            <div className="mb-8">
                <NavLink to="/admin/results" className="text-sm text-accent hover:underline">
                    &larr; Back to Submissions
                </NavLink>
                <h1 className="text-4xl font-bold text-white mt-2">Submission Details</h1>
                <p className="text-gray-400">Team: <span className="font-semibold text-highlight">{team.name}</span></p>
            </div>

            <div className="space-y-8">
                {/* MCQ Answers */}
                <div className="bg-primary p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">MCQ Answers</h3>
                    <div className="space-y-4">
                        {mcqs.map(renderMcqAnswer)}
                    </div>
                </div>

                {/* Coding Problem Submissions */}
                <div className="bg-primary p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Coding Submissions</h3>
                     <div className="space-y-6">
                        {codingProblems.map(problem => {
                            const codingAnswer = submission.codingAnswers[problem.id];
                            return (
                                <div key={problem.id}>
                                    <div className="flex justify-between items-baseline">
                                        <h4 className="font-semibold text-accent">{problem.title}</h4>
                                        <span className="text-xs font-mono bg-highlight/20 text-highlight px-2 py-1 rounded">
                                            Language: {codingAnswer?.language || 'N/A'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 my-2 whitespace-pre-wrap">{problem.description}</p>
                                    <pre className="bg-secondary p-4 rounded-md text-sm text-dark-text overflow-x-auto">
                                        <code>
                                            {codingAnswer?.code || '// No code submitted for this problem.'}
                                        </code>
                                    </pre>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewSubmission;