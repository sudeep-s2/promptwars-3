import React from 'react';

interface ScoreRingProps {
  score: number;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({ score }): React.ReactElement => {
  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  // Score is 0-100 (where 100 is best / lowest emissions)
  const offset = circumference - (score / 100) * circumference;

  // Determine color and description based on score (early returns)
  const getScoreMetadata = (): { strokeGradient: string; scoreClass: string; rating: string; ratingDesc: string } => {
    if (score < 50) {
      return {
        strokeGradient: 'url(#scoreGradientRed)',
        scoreClass: 'text-rose-500',
        rating: 'High Impact',
        ratingDesc: 'Considerable reduction possible.'
      };
    }
    if (score < 80) {
      return {
        strokeGradient: 'url(#scoreGradientAmber)',
        scoreClass: 'text-amber-400',
        rating: 'Moderate Impact',
        ratingDesc: 'On the path to sustainability.'
      };
    }
    return {
      strokeGradient: 'url(#scoreGradientGreen)',
      scoreClass: 'text-emerald-400',
      rating: 'Eco Champion',
      ratingDesc: 'Minimal environmental footprint.'
    };
  };

  const { strokeGradient, scoreClass, rating, ratingDesc } = getScoreMetadata();

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-darkbg-800/40 backdrop-blur-md border border-darkbg-700/50 rounded-2xl shadow-glass">
      <h3 className="text-gray-400 text-sm font-medium tracking-wide uppercase mb-4">Carbon Score</h3>
      <div className="relative flex items-center justify-center w-52 h-52">
        <svg className="w-full h-full transform -rotate-90">
          <defs>
            <linearGradient id="scoreGradientGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="scoreGradientAmber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="scoreGradientRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>
          {/* Background circle */}
          <circle
            cx="104"
            cy="104"
            r={radius}
            className="stroke-darkbg-700/60 fill-none"
            strokeWidth={strokeWidth}
          />
          {/* Animated score ring */}
          <circle
            cx="104"
            cy="104"
            r={radius}
            className="fill-none transition-all duration-1000 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke={strokeGradient}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-6xl font-bold font-sans tracking-tight ${scoreClass}`}>
            {score}
          </span>
          <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">/ 100</span>
        </div>
      </div>
      <div className="text-center mt-4">
        <span className={`text-lg font-semibold ${scoreClass}`}>{rating}</span>
        <p className="text-xs text-gray-400 mt-1">{ratingDesc}</p>
      </div>
    </div>
  );
};
