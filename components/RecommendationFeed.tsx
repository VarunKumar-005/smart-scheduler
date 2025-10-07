
import React, { useState } from 'react';
import { Certification, PathwayStep } from '../types';
import { generateLearningPathway } from '../services/geminiService';
import CertificationCard from './CertificationCard';

interface RecommendationFeedProps {
  bookmarkedCerts: Map<string, Certification>;
  onBookmarkToggle: (cert: Certification) => void;
}

const RecommendationFeed: React.FC<RecommendationFeedProps> = ({ bookmarkedCerts, onBookmarkToggle }) => {
    const [domainQuery, setDomainQuery] = useState('');
    const [pathway, setPathway] = useState<PathwayStep[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [openStep, setOpenStep] = useState<number | null>(null);

    const handleToggleStep = (stepNumber: number) => {
        setOpenStep(prev => (prev === stepNumber ? null : stepNumber));
    };

    const handleGeneratePathway = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!domainQuery.trim()) {
            setError("Please enter a domain you're interested in.");
            return;
        }

        setIsLoading(true);
        setError('');
        setPathway(null);
        setOpenStep(null);
        try {
            const result = await generateLearningPathway(domainQuery);
            setPathway(result);
            if (result.length > 0) {
                setOpenStep(result[0].step);
            }
        } catch (err) {
            setError('Could not generate a learning pathway. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const LoadingSkeleton = () => (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-12 animate-fadeInUp">
            <div>
                <h1 className="text-4xl font-bold text-center text-black dark:text-white mb-4 font-poppins">
                    <span className="font-emoji">🗺️</span> Chart Your Learning Pathway
                </h1>
                <p className="text-lg text-center text-apple-gray dark:text-gray-400 max-w-2xl mx-auto">
                    Enter any skill, domain, or career path, and our AI will generate a step-by-step roadmap to guide your learning journey.
                </p>
            </div>

            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleGeneratePathway} className="flex flex-col sm:flex-row items-center gap-4 p-2 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg shadow-gray-200/50 dark:shadow-black/20">
                    <input
                        type="text"
                        value={domainQuery}
                        onChange={(e) => setDomainQuery(e.target.value)}
                        placeholder="e.g., Full Stack Development, Game Design, AI..."
                        className="w-full flex-1 p-4 bg-transparent border-none focus:ring-0 text-lg dark:text-white placeholder:text-apple-gray dark:placeholder:text-gray-500"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-apple-blue text-white px-8 py-4 rounded-full font-semibold font-poppins hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? 'Generating...' : 'Create Pathway'}
                    </button>
                </form>
            </div>

            <div className="mt-12">
                {isLoading && <LoadingSkeleton />}
                {error && (
                    <div className="text-center p-8 bg-red-50 dark:bg-red-900/50 rounded-2xl">
                        <p className="text-red-600 dark:text-red-300">{error}</p>
                    </div>
                )}
                {pathway && (
                    <div className="space-y-4">
                        {pathway.map((step) => {
                            const isOpen = openStep === step.step;
                            return (
                                <div key={step.step} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl transition-all duration-300 ease-in-out">
                                    <div className="flex justify-between items-center p-6 cursor-pointer" onClick={() => handleToggleStep(step.step)}>
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-black dark:text-white font-poppins">{step.title}</h2>
                                            <p className="text-apple-gray dark:text-gray-400 mt-1">{step.description}</p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-apple-gray transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                                        <div className="px-6 pb-6 pt-2 border-t border-gray-200 dark:border-gray-700 space-y-6">
                                            <p className="text-gray-600 dark:text-gray-300">{step.detailedDescription}</p>

                                            <div className="space-y-3">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-black dark:text-white mb-2">Key Topics:</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {step.keyTopics.map((topic, index) => (
                                                            <span key={index} className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full">{topic}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                 {step.prerequisites && step.prerequisites.length > 0 && (
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-black dark:text-white mb-2">Requires:</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {step.prerequisites.map((prereq, index) => (
                                                                <span key={index} className="px-3 py-1 text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full">{prereq}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-semibold text-black dark:text-white mb-4">Recommended Resources:</h4>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {step.resources.map((resource) => (
                                                        <CertificationCard
                                                            key={resource.id}
                                                            certification={resource}
                                                            isBookmarked={bookmarkedCerts.has(resource.id)}
                                                            onBookmarkToggle={onBookmarkToggle}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendationFeed;