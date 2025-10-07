
import React, { useState, useMemo } from 'react';
import { Certification, StudyPlan } from '../types';
import { generateStudyPlan } from '../services/geminiService';

interface SchedulerPageProps {
  bookmarkedCerts: Map<string, Certification>;
  onPlanGenerated: (plan: StudyPlan, certs: Certification[]) => void;
}

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const SchedulerPage: React.FC<SchedulerPageProps> = ({ bookmarkedCerts, onPlanGenerated }) => {
    const [selectedCerts, setSelectedCerts] = useState<Set<string>>(new Set());
    const [dailyHours, setDailyHours] = useState<{ [key: string]: number }>({
        monday: 2, tuesday: 2, wednesday: 2, thursday: 2, friday: 2, saturday: 4, sunday: 0
    });
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const bookmarkedCertsList = useMemo(() => {
        return Array.from(bookmarkedCerts.values());
    }, [bookmarkedCerts]);
    
    const handleCertToggle = (certId: string) => {
        setSelectedCerts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(certId)) newSet.delete(certId);
            else newSet.add(certId);
            return newSet;
        });
    };

    const handleDailyHoursChange = (day: string, value: string) => {
        const hours = Math.max(0, Math.min(24, Number(value) || 0));
        setDailyHours(prev => ({...prev, [day]: hours }));
    };

    const handleGeneratePlan = async () => {
        if (selectedCerts.size === 0) {
            setError("Please select at least one certification to plan for.");
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const certsToStudy = bookmarkedCertsList.filter(c => selectedCerts.has(c.id));
            const result = await generateStudyPlan(certsToStudy, dailyHours, startDate);
            onPlanGenerated(result, certsToStudy);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setIsLoading(false);
        }
    };
    
    return (
        <div className="animate-fadeInUp space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2 font-poppins">
                    <span className="font-emoji">🗓️</span> AI Study Scheduler
                </h1>
                <p className="text-lg text-apple-gray dark:text-gray-400">
                    Generate a personalized study plan based on your goals and daily schedule.
                </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 space-y-8">
                {/* Step 1: Select Certifications */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">1. Select Certifications to Plan</h3>
                    {bookmarkedCertsList.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {bookmarkedCertsList.map(cert => (
                                <label key={cert.id} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${selectedCerts.has(cert.id) ? 'border-apple-blue bg-blue-50 dark:bg-blue-900/50' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                                    <input type="checkbox" checked={selectedCerts.has(cert.id)} onChange={() => handleCertToggle(cert.id)} className="h-5 w-5 rounded border-gray-300 text-apple-blue focus:ring-apple-blue"/>
                                    <span className="font-emoji mr-1">{cert.icon}</span>
                                    <span className="text-sm font-medium text-black dark:text-white">{cert.name}</span>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <p className="text-apple-gray dark:text-gray-400">You have no bookmarked certifications. Please add some from the feed first.</p>
                    )}
                </div>

                {/* Step 2: Set Preferences */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">2. Set Your availability for Each day in the week (hours )</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-4">
                        {daysOfWeek.map(day => (
                            <div key={day}>
                                <label htmlFor={day} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">{day}</label>
                                <input type="number" id={day} value={dailyHours[day]} onChange={e => handleDailyHoursChange(day, e.target.value)} min="0" max="24" className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-apple-blue"/>
                            </div>
                        ))}
                    </div>
                     <div>
                        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                        <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full md:w-1/3 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-apple-blue"/>
                    </div>
                </div>
                {error && <p className="text-red-600 dark:text-red-300 text-center -my-4">{error}</p>}
                {/* Step 3: Generate Button */}
                <button onClick={handleGeneratePlan} disabled={isLoading || bookmarkedCertsList.length === 0} className="w-full bg-apple-blue text-white px-6 py-4 rounded-lg font-semibold font-poppins text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating Plan...
                        </>
                    ) : 'Generate My Study Plan'}
                </button>
            </div>
        </div>
    );
};

export default SchedulerPage;