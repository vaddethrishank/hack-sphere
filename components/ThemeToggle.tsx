
import React from 'react';
import { useTheme } from '../hooks/useTheme';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
    >
      {theme === 'light' ? (
        <MoonIcon className="w-5 h-5 text-dark-text" />
      ) : (
        <SunIcon className="w-5 h-5 text-yellow-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
