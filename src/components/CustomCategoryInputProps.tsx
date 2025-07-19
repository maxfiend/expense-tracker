import React from "react";

interface CustomCategoryInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isVisible: boolean; // новый пропс для управления анимацией
}

export const CustomCategoryInput: React.FC<CustomCategoryInputProps> = ({
  value,
  onChange,
  onSubmit,
  isVisible,
}) => {
  return (
    <div
      className={`transition-[max-height,opacity] duration-700 ease-in-out overflow-hidden flex flex-col sm:flex-row gap-2
        ${isVisible ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
      `}
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit();
          }
        }}
        className="flex-1 px-4 py-3 cyber-input rounded-md font-mono text-cyan-300
          transition-all duration-300 ease-in-out focus:ring-2 focus:ring-cyan-500"
        placeholder="Введіть власну категорію"
        required
      />
      <button
        type="button"
        onClick={onSubmit}
        className="px-4 cyber-button2 rounded-md w-full sm:w-auto neon-scan"
      >
        Додати
      </button>
    </div>
  );
};
