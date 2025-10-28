'use client';

import React from 'react';
import { BaseComponentProps } from '../../types';

interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  fullScreen = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const spinnerClasses = [
    'spinner',
    sizeClasses[size],
    className,
  ].filter(Boolean).join(' ');

  const content = (
    <div className="flex flex-col items-center justify-center">
      <div className={spinnerClasses} />
      {text && (
        <p className="loading-text mt-2 text-sm text-gray-600">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
