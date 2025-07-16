import React from 'react';

interface ToggleBurgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  ariaLabel: string;
}

export const ToggleBurgerButton: React.FC<ToggleBurgerButtonProps> = ({ isOpen, onClick, ariaLabel }) => {
  return (
    <button
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      onClick={onClick}
      className="burger-button relative w-8 h-8 flex flex-col justify-center items-center gap-1"
    >
      <span className={`burger-line top ${isOpen ? 'open' : ''}`} />
      <span className={`burger-line middle ${isOpen ? 'open' : ''}`} />
      <span className={`burger-line bottom ${isOpen ? 'open' : ''}`} />
    </button>
  );
};