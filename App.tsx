
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import RecommendationFeed from './components/RecommendationFeed';
import BookmarksPage from './components/BookmarksPage';
import SchedulerPage from './components/SchedulerPage';
import StudyPlanPage from './components/StudyPlanPage';


import { Page, Certification, StudyPlan } from './types';

const App: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [page, setPage] = useState<Page>('feed');
    const [bookmarkedCerts, setBookmarkedCerts] = useState<Map<string, Certification>>(() => {
        try {
            const item = window.localStorage.getItem('bookmarkedCerts');
            return item ? new Map(JSON.parse(item)) : new Map();
        } catch (error) {
            console.error(error);
            return new Map();
        }
    });

    // Lifted state for study plan
    const [plan, setPlan] = useState<StudyPlan | null>(() => {
        const saved = localStorage.getItem('studyPlan');
        return saved ? JSON.parse(saved) : null;
    });
    const [completedTasks, setCompletedTasks] = useState<Set<string>>(() => {
        const saved = localStorage.getItem('completedTasks');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });
    const [certsForPlan, setCertsForPlan] = useState<Set<string>>(() => {
        const saved = localStorage.getItem('certsForPlan');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });


    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(storedTheme === 'dark' || (!storedTheme && prefersDark) ? 'dark' : 'light');
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        try {
            window.localStorage.setItem('bookmarkedCerts', JSON.stringify(Array.from(bookmarkedCerts.entries())));
        } catch (error) {
            console.error("Failed to save bookmarks", error);
        }
    }, [bookmarkedCerts]);

    // Lifted effects for study plan
    useEffect(() => {
        localStorage.setItem('studyPlan', JSON.stringify(plan));
    }, [plan]);

    useEffect(() => {
        localStorage.setItem('completedTasks', JSON.stringify(Array.from(completedTasks)));
    }, [completedTasks]);

    useEffect(() => {
        localStorage.setItem('certsForPlan', JSON.stringify(Array.from(certsForPlan)));
    }, [certsForPlan]);


    const handleThemeToggle = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    const handleNavigate = (newPage: Page) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBookmarkToggle = useCallback((cert: Certification) => {
        setBookmarkedCerts(prev => {
            const newMap = new Map(prev);
            if (newMap.has(cert.id)) {
                newMap.delete(cert.id);
            } else {
                newMap.set(cert.id, cert);
            }
            return newMap;
        });
    }, []);

    const handleToggleTask = useCallback((taskId: string) => {
        setCompletedTasks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(taskId)) {
                newSet.delete(taskId);
            } else {
                newSet.add(taskId);
            }
            return newSet;
        });
    }, []);


    const renderPage = () => {
        switch (page) {
            case 'bookmarks':
                return <BookmarksPage bookmarkedCerts={bookmarkedCerts} onBookmarkToggle={handleBookmarkToggle} />;
            case 'scheduler':
                return <SchedulerPage 
                            bookmarkedCerts={bookmarkedCerts} 
                            onPlanGenerated={(newPlan, certsInNewPlan) => {
                                setPlan(newPlan);
                                setCompletedTasks(new Set());
                                setCertsForPlan(new Set(certsInNewPlan.map(c => c.id)));
                                handleNavigate('studyPlan');
                            }}
                        />;
            case 'studyPlan':
                return <StudyPlanPage
                            plan={plan}
                            completedTasks={completedTasks}
                            certsForPlan={certsForPlan}
                            bookmarkedCerts={bookmarkedCerts}
                            onToggleTask={handleToggleTask}
                            onNavigateToScheduler={() => handleNavigate('scheduler')}
                        />;
            case 'feed':
            default:
                return <RecommendationFeed bookmarkedCerts={bookmarkedCerts} onBookmarkToggle={handleBookmarkToggle} />;
        }
    };

    return (
        <div className="min-h-screen relative overflow-x-hidden text-apple-dark dark:text-apple-light transition-colors duration-500">
            <Navbar activePage={page} onNavigate={handleNavigate} theme={theme} onThemeToggle={handleThemeToggle} />
            
            <main className="relative z-10 container mx-auto px-4 py-8 mt-16">
                {renderPage()}
            </main>

            <Footer />
            <Chatbot />
        </div>
    );
};

export default App;