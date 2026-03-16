import { useMemo } from 'react';

interface ShippingProgressBarProps {
  subtotal: number;
  freeShippingThreshold?: number;
}

const ShippingProgressBar = ({ subtotal, freeShippingThreshold = 100 }: ShippingProgressBarProps) => {
  const progress = useMemo(() => {
    return Math.min((subtotal / freeShippingThreshold) * 100, 100);
  }, [subtotal, freeShippingThreshold]);

  const remaining = freeShippingThreshold - subtotal;
  const isEligible = subtotal >= freeShippingThreshold;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
      {isEligible ? (
        <div className="flex items-center gap-2 text-green-600 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>🎉 Chúc mừng! Bạn được Miễn Phí Vận Chuyển</span>
        </div>
      ) : (
        <div className="text-sm text-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            <span className="font-medium">
              Mua thêm <span className="text-blue-600 font-bold">${remaining.toFixed(2)}</span> để được Miễn Phí Vận Chuyển
            </span>
          </div>
        </div>
      )}
      
      {/* Progress Bar */}
      <div className="mt-3 relative">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isEligible 
                ? 'bg-gradient-to-r from-green-400 to-green-500' 
                : 'bg-gradient-to-r from-blue-400 to-purple-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 text-right mt-1">
          {progress.toFixed(0)}%
        </div>
      </div>
    </div>
  );
};

export default ShippingProgressBar;
