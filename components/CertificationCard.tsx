import React from 'react';
import { Certification } from '../types';

interface CertificationCardProps {
  certification: Certification;
  isBookmarked: boolean;
  onBookmarkToggle: (certification: Certification) => void;
  reasoning?: string;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => <span key={`f_${i}`} className="text-yellow-400">★</span>)}
      {halfStar && <span className="text-yellow-400">★</span>}
      {[...Array(emptyStars)].map((_, i) => <span key={`e_${i}`} className="text-gray-300 dark:text-gray-600">★</span>)}
    </div>
  );
};


const CertificationCard: React.FC<CertificationCardProps> = ({ certification, isBookmarked, onBookmarkToggle, reasoning }) => {
  const { name, provider, icon, description, rating, reviewCount, difficulty, duration } = certification;

  const difficultyColors = {
    Beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const createCourseSearchUrl = () => {
    const searchQuery = `${name} course on Coursera or Udemy or edX or NPTEL`;
    return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="relative flex flex-col bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-gray-400/10 dark:hover:shadow-apple-blue/10 hover:-translate-y-2">
      <button
        onClick={() => onBookmarkToggle(certification)}
        className="absolute top-4 right-4 text-gray-400 hover:text-apple-blue z-10 transition-colors"
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-all duration-200 ${isBookmarked ? 'text-apple-blue' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" />
        </svg>
      </button>

      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-black dark:text-white font-poppins pr-6">{name}</h3>
          <p className="text-sm text-apple-gray dark:text-gray-400">{provider}</p>
        </div>
      </div>
      
      {reasoning && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200 font-medium">
            <span className="font-bold">Recommendation:</span> {reasoning}
          </p>
        </div>
      )}

      <p className="text-sm text-apple-gray dark:text-gray-300 flex-grow mb-4">{description}</p>
      
      <div className="space-y-3 text-sm mb-6">
        <div className="flex justify-between items-center">
          <span className="text-apple-gray dark:text-gray-400 font-medium">Rating</span>
          <div className="flex items-center gap-2">
            <StarRating rating={rating} />
            <span className="font-semibold text-black dark:text-white">{rating.toFixed(1)}</span>
            <span className="text-xs text-apple-gray dark:text-gray-500">({(reviewCount/1000).toFixed(1)}k)</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-apple-gray dark:text-gray-400 font-medium">Duration</span>
          <span className="font-semibold text-black dark:text-white">{duration}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-apple-gray dark:text-gray-400 font-medium">Difficulty</span>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${difficultyColors[difficulty]}`}>{difficulty}</span>
        </div>
      </div>
      
      <div className="mt-auto">
          <a
              href={createCourseSearchUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center bg-apple-blue/10 dark:bg-apple-blue/20 text-apple-blue dark:text-blue-300 px-4 py-3 rounded-lg font-semibold hover:bg-apple-blue hover:text-white dark:hover:bg-apple-blue dark:hover:text-white transition-all duration-300 group"
          >
             <span className="group-hover:text-white transition-colors duration-300">View Course</span>
          </a>
      </div>

    </div>
  );
};

export default CertificationCard;