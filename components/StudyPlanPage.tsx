
import React, { useMemo, useRef } from 'react';
import { Certification, StudyPlan } from '../types';
import { CERTIFICATION_DATA } from '../constants';
import MarkdownRenderer from './MarkdownRenderer';

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface StudyPlanPageProps {
    plan: StudyPlan | null;
    completedTasks: Set<string>;
    certsForPlan: Set<string>;
    bookmarkedCerts: Map<string, Certification>;
    onToggleTask: (taskId: string) => void;
    onNavigateToScheduler: () => void;
}

const ProgressTracker: React.FC<{
    plan: StudyPlan;
    completedTasks: Set<string>;
    certsInPlan: Certification[];
}> = ({ plan, completedTasks, certsInPlan }) => {
    const { totalTasks, overallProgress, certProgress } = useMemo(() => {
        let total = 0;
        const certTaskCounts: { [key: string]: { total: number, completed: number } } = {};

        certsInPlan.forEach(cert => {
            certTaskCounts[cert.id] = { total: 0, completed: 0 };
        });

        plan.weeklyPlan.forEach(week => {
            week.dailyBreakdown.forEach(day => {
                day.tasks.forEach((taskText, taskIndex) => {
                    total++;
                    const taskId = `week-${week.week}-day-${day.day}-task-${taskIndex}`;
                    
                    certsInPlan.forEach(cert => {
                        const certKeywords = [cert.name, ...cert.provider.split(' '), ...cert.name.split(' ').filter(s => s.length > 3)];
                        if (certKeywords.some(keyword => keyword && taskText.toLowerCase().includes(keyword.toLowerCase()))) {
                             certTaskCounts[cert.id].total++;
                             if (completedTasks.has(taskId)) {
                                 certTaskCounts[cert.id].completed++;
                             }
                        }
                    });
                });
            });
        });

        const overall = total > 0 ? Math.round((completedTasks.size / total) * 100) : 0;
        
        const certP = certsInPlan.map(cert => ({
            ...cert,
            progress: certTaskCounts[cert.id].total > 0
                ? Math.round((certTaskCounts[cert.id].completed / certTaskCounts[cert.id].total) * 100)
                : 0,
        }));

        return {
            totalTasks: total,
            overallProgress: overall,
            certProgress: certP,
        };
    }, [plan, completedTasks, certsInPlan]);

    return (
        <div className="space-y-6 mb-8 p-6 bg-apple-light dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-black dark:text-white">Overall Plan Progress</h4>
                    <span className="font-mono text-sm font-medium text-apple-blue dark:text-blue-400">{overallProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative overflow-hidden">
                    <div className="bg-apple-blue h-4 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }}></div>
                </div>
                <span className="text-xs text-apple-gray dark:text-gray-400 mt-1 block">{completedTasks.size} of {totalTasks} tasks completed</span>
            </div>
            {certProgress.length > 1 && certProgress.some(c => c.progress > 0) && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-black dark:text-white">Progress per Certification</h4>
                    {certProgress.map(cert => (
                        <div key={cert.id}>
                             <div className="flex justify-between items-center mb-1">
                                <p className="text-sm font-medium text-black dark:text-white">{cert.icon} {cert.name}</p>
                                <span className="text-xs font-mono text-green-600 dark:text-green-400">{cert.progress}%</span>
                             </div>
                             <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                 <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${cert.progress}%` }}></div>
                             </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const StudyPlanPage: React.FC<StudyPlanPageProps> = ({ plan, completedTasks, certsForPlan, bookmarkedCerts, onToggleTask, onNavigateToScheduler }) => {
    const planRef = useRef<HTMLDivElement>(null);

    const certsInPlan = useMemo(() => {
        const allCerts = [...CERTIFICATION_DATA, ...Array.from(bookmarkedCerts.values())];
        const uniqueCerts = Array.from(new Map(allCerts.map(c => [c.id, c])).values());
        return uniqueCerts.filter(c => certsForPlan.has(c.id));
    }, [certsForPlan, bookmarkedCerts]);

    const handleDownloadPdf = () => {
        if (!planRef.current || !window.jspdf || !window.html2canvas) {
            console.error("PDF generation library not loaded or element not found.");
            alert("Sorry, the PDF generator is not available. Please try again later.");
            return;
        }

        const planElement = planRef.current;
        const isDark = document.documentElement.classList.contains('dark');
        
        // Temporarily switch to light mode for PDF generation for better readability
        if (isDark) {
            document.documentElement.classList.remove('dark');
        }

        window.html2canvas(planElement, { 
            scale: 2, 
            backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
            onclone: (doc) => {
                 // On the cloned document, force text colors to be readable
                 doc.querySelectorAll('.dark\\:text-white').forEach(el => (el as HTMLElement).style.color = '#000');
                 doc.querySelectorAll('.dark\\:text-gray-200').forEach(el => (el as HTMLElement).style.color = '#333');
                 doc.querySelectorAll('.dark\\:text-gray-300').forEach(el => (el as HTMLElement).style.color = '#555');
                 doc.querySelectorAll('.dark\\:text-gray-400').forEach(el => (el as HTMLElement).style.color = '#777');
            }
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            const imgHeight = pdfWidth / ratio;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            
            pdf.save('Learn2Earn-Study-Plan.pdf');

            // Switch back to dark mode if it was originally enabled
            if (isDark) {
                document.documentElement.classList.add('dark');
            }
        });
    };

    if (!plan) {
        return (
            <div className="animate-fadeInUp text-center py-20 bg-apple-light dark:bg-gray-800/50 rounded-2xl">
                <h1 className="text-3xl font-bold text-black dark:text-white mb-4 font-poppins">
                    <span className="font-emoji">🧭</span> You don't have a study plan yet.
                </h1>
                <p className="text-apple-gray dark:text-gray-400 max-w-md mx-auto mb-8">
                    Go to the AI Scheduler to generate a personalized plan based on your bookmarked certifications and weekly schedule.
                </p>
                <button
                    onClick={onNavigateToScheduler}
                    className="bg-apple-blue text-white px-8 py-4 rounded-lg font-semibold font-poppins hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                >
                    Create a Plan
                </button>
            </div>
        );
    }

    return (
        <div className="animate-fadeInUp space-y-8">
            <div>
                 <h1 className="text-4xl font-bold text-black dark:text-white mb-2 font-poppins">
                    <span className="font-emoji">🚀</span> My Study Plan
                </h1>
                <p className="text-lg text-apple-gray dark:text-gray-400">
                    Track your progress and stay on top of your learning goals.
                </p>
            </div>
             <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                <div>
                     <div ref={planRef} className="text-black dark:text-white">
                        <ProgressTracker plan={plan} completedTasks={completedTasks} certsInPlan={certsInPlan} />
                        <div className="prose max-w-none dark:prose-invert">
                            <MarkdownRenderer text={plan.introduction} />
                            {plan.weeklyPlan.map(week => (
                                <details key={week.week} className="bg-apple-light dark:bg-gray-800 p-4 rounded-lg mb-4" open>
                                    <summary className="font-bold text-lg cursor-pointer text-black dark:text-white">Week {week.week}</summary>
                                    <div className="mt-4 pl-4 border-l-2 border-apple-blue space-y-4">
                                        <p className="italic text-gray-600 dark:text-gray-400">{week.weeklySummary}</p>
                                        {week.dailyBreakdown.map(dayPlan => (
                                            dayPlan.hours > 0 && (
                                                <div key={dayPlan.day}>
                                                    <h4 className="font-semibold text-black dark:text-white">{dayPlan.day} ({dayPlan.hours} {dayPlan.hours === 1 ? 'hour' : 'hours'})</h4>
                                                    <ul className="list-none p-0 space-y-2">
                                                        {dayPlan.tasks.map((task, i) => {
                                                            const taskId = `week-${week.week}-day-${dayPlan.day}-task-${i}`;
                                                            const isCompleted = completedTasks.has(taskId);
                                                            return (
                                                                <li key={i}>
                                                                    <label htmlFor={taskId} className="flex items-start gap-3 cursor-pointer group">
                                                                        <input 
                                                                            id={taskId}
                                                                            type="checkbox" 
                                                                            className="mt-1 h-5 w-5 flex-shrink-0 rounded border-gray-300 text-apple-blue focus:ring-apple-blue cursor-pointer"
                                                                            checked={isCompleted}
                                                                            onChange={() => onToggleTask(taskId)}
                                                                        />
                                                                        <span className={`transition-colors ${isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white'}`}>
                                                                            {task}
                                                                        </span>
                                                                    </label>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </details>
                            ))}
                            <MarkdownRenderer text={plan.conclusion} />
                        </div>
                    </div>
                    <div className="text-center mt-8">
                        <button
                            onClick={handleDownloadPdf}
                            className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold font-poppins hover:bg-green-700 transition-colors flex items-center gap-2.5 mx-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Download as PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyPlanPage;
