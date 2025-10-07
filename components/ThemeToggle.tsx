
import React from 'react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <div className="flex items-center">
      <span className="text-sm text-apple-gray dark:text-gray-400 mr-2">☀️</span>
      <label htmlFor="theme-toggle" className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          id="theme-toggle" 
          className="sr-only peer" 
          checked={theme === 'dark'}
          onChange={onToggle}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-apple-blue/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-apple-blue"></div>
      </label>
      <span className="text-sm text-apple-gray dark:text-gray-400 ml-2">🌙</span>
    </div>
  );
};

export default ThemeToggle;
