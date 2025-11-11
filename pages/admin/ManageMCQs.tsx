import React, { useState } from 'react';
import { useContest } from '../../hooks/useContest';
import { MCQ, MCQOption } from '../../types';

const ManageMCQs: React.FC = () => {
    const { mcqs, codingProblems, addMcq, addCodingProblem } = useContest();
    
    // State for new MCQ form
    const [newMcqQuestion, setNewMcqQuestion] = useState('');
    const [newMcqOptions, setNewMcqOptions] = useState<MCQOption[]>([ {id: 'a', text: ''}, {id: 'b', text: ''} ]);
    const [correctAnswerId, setCorrectAnswerId] = useState('a');

    // State for new Coding Problem form
    const [newProblemTitle, setNewProblemTitle] = useState('');
    const [newProblemDesc, setNewProblemDesc] = useState('');

    const handleAddOption = () => {
        if(newMcqOptions.length < 4) {
            const nextChar = String.fromCharCode(97 + newMcqOptions.length); // a, b, c, d
            setNewMcqOptions([...newMcqOptions, { id: nextChar, text: '' }]);
        }
    };

    const handleOptionTextChange = (id: string, text: string) => {
        setNewMcqOptions(newMcqOptions.map(opt => opt.id === id ? { ...opt, text } : opt));
    };

    const handleAddMcq = (e: React.FormEvent) => {
        e.preventDefault();
        const mcqToAdd: Omit<MCQ, 'id'> = {
            question: newMcqQuestion,
            options: newMcqOptions,
            correctAnswerId,
        };
        addMcq(mcqToAdd);
        setNewMcqQuestion('');
        setNewMcqOptions([{id: 'a', text: ''}, {id: 'b', text: ''}]);
        setCorrectAnswerId('a');
    };
    
    const handleAddCodingProblem = (e: React.FormEvent) => {
        e.preventDefault();
        addCodingProblem({ title: newProblemTitle, description: newProblemDesc });
        setNewProblemTitle('');
        setNewProblemDesc('');
    };

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold text-white mb-8">Manage Round 1 Content</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* MCQ Management */}
                <div className="space-y-8">
                    <div className="bg-primary p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-white mb-4">Add New MCQ</h3>
                        <form onSubmit={handleAddMcq} className="space-y-4">
                            <textarea value={newMcqQuestion} onChange={e => setNewMcqQuestion(e.target.value)} placeholder="Question Text" required className="w-full bg-secondary p-2 rounded-md border-transparent focus:ring-accent focus:border-accent" />
                            {newMcqOptions.map((opt, index) => (
                                <div key={opt.id} className="flex items-center gap-2">
                                    <input type="radio" name="correctAnswer" value={opt.id} checked={correctAnswerId === opt.id} onChange={(e) => setCorrectAnswerId(e.target.value)} />
                                    <input type="text" value={opt.text} onChange={e => handleOptionTextChange(opt.id, e.target.value)} placeholder={`Option ${opt.id.toUpperCase()}`} required className="flex-grow bg-secondary p-2 rounded-md border-transparent focus:ring-accent focus:border-accent" />
                                </div>
                            ))}
                             <button type="button" onClick={handleAddOption} disabled={newMcqOptions.length >= 4} className="text-sm text-accent hover:text-highlight disabled:opacity-50">+ Add Option</button>
                            <button type="submit" className="w-full bg-accent hover:bg-accent/80 text-white font-bold py-2 px-4 rounded">Add MCQ</button>
                        </form>
                    </div>
                     <div className="bg-primary p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-white mb-4">Existing MCQs ({mcqs.length})</h3>
                        <ul className="space-y-2 text-sm">
                            {mcqs.map(mcq => <li key={mcq.id} className="p-2 bg-secondary rounded">{mcq.question}</li>)}
                        </ul>
                    </div>
                </div>

                {/* Coding Problem Management */}
                <div className="space-y-8">
                    <div className="bg-primary p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-white mb-4">Add New Coding Problem</h3>
                        <form onSubmit={handleAddCodingProblem} className="space-y-4">
                             <input type="text" value={newProblemTitle} onChange={e => setNewProblemTitle(e.target.value)} placeholder="Problem Title" required className="w-full bg-secondary p-2 rounded-md border-transparent focus:ring-accent focus:border-accent" />
                            <textarea value={newProblemDesc} onChange={e => setNewProblemDesc(e.target.value)} placeholder="Problem Description" required rows={4} className="w-full bg-secondary p-2 rounded-md border-transparent focus:ring-accent focus:border-accent" />
                            <button type="submit" className="w-full bg-accent hover:bg-accent/80 text-white font-bold py-2 px-4 rounded">Add Coding Problem</button>
                        </form>
                    </div>
                    <div className="bg-primary p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-white mb-4">Existing Coding Problems ({codingProblems.length})</h3>
                        <ul className="space-y-2 text-sm">
                            {codingProblems.map(p => <li key={p.id} className="p-2 bg-secondary rounded">{p.title}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageMCQs;
