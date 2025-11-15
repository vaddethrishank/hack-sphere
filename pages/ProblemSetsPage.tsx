import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Code2, BookOpen, Zap, Trophy } from 'lucide-react';

interface ProblemSet {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  problems: number;
  examples: ProblemExample[];
  icon: React.ComponentType<{ className: string }>;
}

interface ProblemExample {
  id: string;
  title: string;
  description: string;
  input: string;
  output: string;
  explanation: string;
}

const ProblemSetsPage: React.FC = () => {
  const [expandedSet, setExpandedSet] = useState<string | null>(null);

  const problemSets: ProblemSet[] = [
    {
      id: 'set1',
      title: 'Array Manipulation',
      description: 'Master the fundamentals of array operations and transformations',
      difficulty: 'Easy',
      problems: 5,
      icon: Code2,
      examples: [
        {
          id: '1',
          title: 'Reverse an Array',
          description: 'Reverse the elements of an array in place',
          input: '[1, 2, 3, 4, 5]',
          output: '[5, 4, 3, 2, 1]',
          explanation: 'Use two pointers approach to swap elements from both ends moving towards center',
        },
        {
          id: '2',
          title: 'Find Maximum Element',
          description: 'Find the maximum element in an unsorted array',
          input: '[3, 7, 2, 9, 1]',
          output: '9',
          explanation: 'Iterate through the array and keep track of the maximum value',
        },
        {
          id: '3',
          title: 'Remove Duplicates',
          description: 'Remove duplicate elements while maintaining order',
          input: '[1, 2, 2, 3, 4, 4, 5]',
          output: '[1, 2, 3, 4, 5]',
          explanation: 'Use a Set to track seen elements or two-pointer technique',
        },
      ],
    },
    {
      id: 'set2',
      title: 'String Processing',
      description: 'Work with string manipulation, parsing, and pattern matching',
      difficulty: 'Medium',
      problems: 6,
      icon: BookOpen,
      examples: [
        {
          id: '1',
          title: 'Palindrome Check',
          description: 'Check if a string is a palindrome',
          input: '"racecar"',
          output: 'true',
          explanation: 'Compare characters from start and end moving towards center',
        },
        {
          id: '2',
          title: 'Anagram Detection',
          description: 'Determine if two strings are anagrams',
          input: '"listen", "silent"',
          output: 'true',
          explanation: 'Sort both strings and compare, or use character frequency maps',
        },
        {
          id: '3',
          title: 'Word Frequency',
          description: 'Count frequency of each word in a sentence',
          input: '"the quick brown fox jumps over the lazy dog"',
          output: '{ "the": 2, "quick": 1, ... }',
          explanation: 'Use a map/dictionary to count occurrences of each word',
        },
      ],
    },
    {
      id: 'set3',
      title: 'Dynamic Programming',
      description: 'Solve complex problems by breaking them into overlapping subproblems',
      difficulty: 'Hard',
      problems: 4,
      icon: Zap,
      examples: [
        {
          id: '1',
          title: 'Fibonacci Sequence',
          description: 'Calculate the nth Fibonacci number efficiently',
          input: 'n = 10',
          output: '55',
          explanation: 'Use memoization or tabulation to avoid recalculating subproblems',
        },
        {
          id: '2',
          title: 'Longest Common Subsequence',
          description: 'Find the longest common subsequence between two strings',
          input: '"ABCDGH", "AEDFHR"',
          output: '"ADH" (length 3)',
          explanation: 'Build a 2D DP table to track common characters',
        },
        {
          id: '3',
          title: '0/1 Knapsack Problem',
          description: 'Maximize value with weight constraint',
          input: 'weights: [2,3,4,5], values: [3,4,5,6], W: 5',
          output: '10',
          explanation: 'Use 2D DP table where dp[i][w] represents max value with i items and weight w',
        },
      ],
    },
    {
      id: 'set4',
      title: 'Graph Algorithms',
      description: 'Explore graph traversal, shortest paths, and connectivity problems',
      difficulty: 'Hard',
      problems: 5,
      icon: Trophy,
      examples: [
        {
          id: '1',
          title: 'Breadth-First Search',
          description: 'Find shortest path in an unweighted graph',
          input: 'Graph with edges: 0-1, 0-2, 1-3, 2-3',
          output: 'Path from 0 to 3: [0, 1, 3]',
          explanation: 'Use a queue to explore nodes level by level',
        },
        {
          id: '2',
          title: 'Dijkstra\'s Algorithm',
          description: 'Find shortest path in a weighted graph',
          input: 'Weighted graph with source node',
          output: 'Shortest distances from source to all nodes',
          explanation: 'Use priority queue to always process closest unvisited node',
        },
        {
          id: '3',
          title: 'Cycle Detection',
          description: 'Detect if there\'s a cycle in a graph',
          input: 'Directed graph with edges',
          output: 'true/false',
          explanation: 'Use DFS with color marking (white, gray, black)',
        },
      ],
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-christmas-green/20 text-christmas-green';
      case 'Medium':
        return 'bg-frozen-ice/20 text-frozen-ice';
      case 'Hard':
        return 'bg-christmas-red/20 text-christmas-red';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <div className="animate-fade-in-up min-h-screen py-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Problem <span className="text-frozen-ice">Collections</span>
          </h1>
          <p className="text-lg text-dark-text max-w-3xl mx-auto">
            Explore curated problem sets covering fundamental to advanced algorithms. Each set includes detailed examples and explanations to help you master coding challenges.
          </p>
        </div>

        {/* Problem Sets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {problemSets.map((set) => {
            const Icon = set.icon;
            const isExpanded = expandedSet === set.id;

            return (
              <div
                key={set.id}
                className="group card-glass rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Header */}
                <div
                  className="p-6 cursor-pointer border-b border-white/10 hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedSet(isExpanded ? null : set.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-accent/20">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{set.title}</h3>
                        <p className="text-sm text-dark-text">{set.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(set.difficulty)}`}>
                      {set.difficulty}
                    </span>
                    <span className="text-xs text-dark-text/70">
                      📚 {set.problems} Problems
                    </span>
                    <span className="text-xs text-dark-text/70 ml-auto">
                      {isExpanded ? '▼ Hide Examples' : '▶ Show Examples'}
                    </span>
                  </div>
                </div>

                {/* Expandable Examples */}
                {isExpanded && (
                  <div className="p-6 space-y-6 bg-secondary/30">
                    {set.examples.map((example) => (
                      <div
                        key={example.id}
                        className="p-4 rounded-lg bg-primary/50 border border-white/5 space-y-3"
                      >
                        <div>
                          <h4 className="text-base font-semibold text-white mb-1">
                            {example.id}. {example.title}
                          </h4>
                          <p className="text-sm text-dark-text">{example.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-frozen-ice mb-1">Input:</p>
                            <div className="bg-primary rounded p-2 font-mono text-xs text-white/80 break-words">
                              {example.input}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-christmas-green mb-1">Output:</p>
                            <div className="bg-primary rounded p-2 font-mono text-xs text-white/80 break-words">
                              {example.output}
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-dark-text/70 mb-1">Explanation:</p>
                          <p className="text-xs text-dark-text/70 leading-relaxed">{example.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-lg text-dark-text mb-6">
            Ready to practice these problems?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink
              to="/"
              className="inline-flex items-center gap-2 bg-frozen-ice hover:bg-frozen-ice/80 text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
              Back to Home
            </NavLink>
            <NavLink
              to="/about"
              className="inline-flex items-center gap-2 border border-frozen-ice text-frozen-ice hover:bg-frozen-ice/10 font-bold py-3 px-8 rounded-full transition-colors"
            >
              Learn More
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSetsPage;
