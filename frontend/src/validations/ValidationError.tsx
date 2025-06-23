import React from 'react';

interface ValidationErrorProps {
  error?: string | null;
  className?: string;
}

export const ValidationError: React.FC<ValidationErrorProps> = ({ 
  error, 
  className = "text-sm text-red-500" 
}) => {
  if (!error) return null;
  
  return (
    <p className={className}>
      {error}
    </p>
  );
};

export default ValidationError; 