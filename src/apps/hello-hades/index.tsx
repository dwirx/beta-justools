import { useState } from 'react';

export default function HelloHades() {
  const [clickCount, setClickCount] = useState(0);

  const getGreeting = () => {
    if (clickCount >= 20) return 'Hello Hades! LEGENDARY! ⚡🔥⚡';
    if (clickCount >= 10) return 'Hello Hades! UNSTOPPABLE! 🔥🔥🔥';
    if (clickCount >= 5) return 'Hello Hades! You are on fire! 🔥🔥';
    return 'Hello Hades! 🔥';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800">
      <div className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl">
        <h1 className="text-5xl font-bold mb-4 text-white animate-pulse">
          {getGreeting()}
        </h1>
        <p className="text-xl mb-6 text-white/80">Welcome to the Underworld</p>
        <button
          onClick={() => setClickCount(clickCount + 1)}
          className="px-8 py-4 text-lg bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full hover:scale-105 active:scale-95 transition-transform shadow-lg hover:shadow-red-500/50 mb-4"
        >
          Click Me!
        </button>
        <p className="text-2xl font-bold text-white mt-4">
          Clicks: {clickCount}
        </p>
      </div>
    </div>
  );
}
