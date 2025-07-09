import React from 'react';

interface SoundWaveAnimationProps {
  isPlaying: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SoundWaveAnimation: React.FC<SoundWaveAnimationProps> = ({ isPlaying, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const barHeights = {
    sm: ['h-1', 'h-2', 'h-1.5', 'h-2.5', 'h-1'],
    md: ['h-1', 'h-3', 'h-2', 'h-4', 'h-1.5'],
    lg: ['h-2', 'h-4', 'h-3', 'h-5', 'h-2']
  };

  return (
    <div className={`flex items-center justify-center space-x-0.5 ${sizeClasses[size]}`}>
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className={`w-0.5 bg-current transition-all duration-150 ${
            isPlaying 
              ? `${barHeights[size][index]} animate-pulse` 
              : 'h-1'
          }`}
          style={{
            animationDelay: isPlaying ? `${index * 0.1}s` : '0s',
            animationDuration: isPlaying ? `${0.5 + (index * 0.1)}s` : '0s'
          }}
        />
      ))}
    </div>
  );
};

export default SoundWaveAnimation;