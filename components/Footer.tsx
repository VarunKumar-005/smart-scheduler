
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-gray-200/80 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-apple-blue rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl font-space">L2E</span>
            </div>
            <span className="text-2xl font-bold text-black dark:text-white font-poppins">Learn2Earn</span>
          </div>
          <p className="text-apple-gray dark:text-gray-400 mb-6 font-inter">
            Making career decisions easier with interactive comparisons and personalized suggestions.
          </p>
          <div className="text-apple-gray dark:text-gray-500 text-sm font-inter">
            © 2025 Learn2Earn Pro. All rights reserved. | Data updated: September 2025
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
