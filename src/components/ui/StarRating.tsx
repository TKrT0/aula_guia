'use client';

import React, { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ 
  value, 
  onChange, 
  label,
  size = 'md' 
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            className={`
              ${sizeClasses[size]}
              transition-all duration-150 cursor-pointer
              hover:scale-110 active:scale-95
              ${(hoverValue || value) >= star 
                ? 'text-yellow-400 drop-shadow-sm' 
                : 'text-slate-200 dark:text-slate-600'
              }
            `}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-sm text-slate-400 self-center">
          {hoverValue || value || 0}/5
        </span>
      </div>
    </div>
  );
}
