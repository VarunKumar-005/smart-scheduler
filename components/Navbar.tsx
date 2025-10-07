
import React from 'react';
import ThemeToggle from './ThemeToggle';
import { Page } from '../types';

interface NavbarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const NavLink: React.FC<{ page: Page; activePage: Page; onNavigate: (page: Page) => void; children: React.ReactNode }> = ({ page, activePage, onNavigate, children }) => {
  const isActive = activePage === page;
  return (
    <button 
      onClick={() => onNavigate(page)}
      className={`px-4 py-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-apple-blue text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
    >
      {children}
    </button>
  );
};


const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate, theme, onThemeToggle }) => {
  return (
    <nav className="bg-apple-light/80 backdrop-blur-md fixed w-full z-40 top-0 border-b border-apple-light dark:bg-apple-dark/80 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('feed'); }} className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-apple-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg font-space">L2E</span>
              </div>
              <span className="text-xl font-bold text-black dark:text-white font-poppins select-text">Learn2Earn</span>
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink page="feed" activePage={activePage} onNavigate={onNavigate}>Feed</NavLink>
            <NavLink page="bookmarks" activePage={activePage} onNavigate={onNavigate}>My Bookmarks</NavLink>
            <NavLink page="scheduler" activePage={activePage} onNavigate={onNavigate}>AI Scheduler</NavLink>
            <NavLink page="studyPlan" activePage={activePage} onNavigate={onNavigate}>My Study Plan</NavLink>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;