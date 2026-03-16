import { useState } from 'react';

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (newValue: number) => void;
  disabled?: boolean;
}

const QuantityStepper = ({ value, min = 1, max = 99, onChange, disabled = false }: QuantityStepperProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDecrease = async () => {
    if (value > min && !isUpdating) {
      setIsUpdating(true);
      await onChange(value - 1);
      setIsUpdating(false);
    }
  };

  const handleIncrease = async () => {
    if (value < max && !isUpdating) {
      setIsUpdating(true);
      await onChange(value + 1);
      setIsUpdating(false);
    }
  };

  return (
    <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
      <button
        onClick={handleDecrease}
        disabled={value <= min || disabled || isUpdating}
        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:bg-gray-200"
        aria-label="Decrease quantity"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>

      <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold text-gray-900 border-x border-gray-200">
        {isUpdating ? '...' : value}
      </span>

      <button
        onClick={handleIncrease}
        disabled={value >= max || disabled || isUpdating}
        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:bg-gray-200"
        aria-label="Increase quantity"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default QuantityStepper;
