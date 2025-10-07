
import React from 'react';
import { Certification } from '../types';
import CertificationCard from './CertificationCard';

interface BookmarksPageProps {
  bookmarkedCerts: Map<string, Certification>;
  onBookmarkToggle: (cert: Certification) => void;
}

const BookmarksPage: React.FC<BookmarksPageProps> = ({ bookmarkedCerts, onBookmarkToggle }) => {
    const bookmarkedList = Array.from(bookmarkedCerts.values());

    return (
        <div className="animate-fadeInUp space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2 font-poppins">
                    <span className="font-emoji">🔖</span> My Bookmarks
                </h1>
                <p className="text-lg text-apple-gray dark:text-gray-400">
                    Your saved certifications. Use these to generate a study plan in the AI Scheduler.
                </p>
            </div>
            
            {bookmarkedList.length > 0 ? (
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {bookmarkedList.map(cert => (
                        <CertificationCard
                            key={cert.id}
                            certification={cert}
                            isBookmarked={true}
                            onBookmarkToggle={onBookmarkToggle}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-apple-light dark:bg-gray-800/50 rounded-2xl">
                    <h2 className="text-2xl font-bold text-black dark:text-white mb-4">No Bookmarks Yet!</h2>
                    <p className="text-apple-gray dark:text-gray-400 max-w-md mx-auto">
                        Go to the Feed to explore certifications and click the bookmark icon to save them here.
                    </p>
                </div>
            )}
        </div>
    );
};

export default BookmarksPage;
