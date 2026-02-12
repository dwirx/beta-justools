import React, { useState } from 'react';

export const appMeta = {
  name: 'Game Tebak-Tebakan',
  description: 'Game interaktif untuk menebak angka yang benar.',
  category: 'Education' as const,
  icon: '🎲',
  featured: false,
  addedAt: '2026-02-13',
};

const GuessingGame: React.FC = () => {
  const [target] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const checkGuess = () => {
    const userGuess = parseInt(guess, 10);
    if (userGuess < target) {
      setFeedback('Terlalu rendah! Coba angka yang lebih besar.');
    } else if (userGuess > target) {
      setFeedback('Terlalu tinggi! Coba angka yang lebih kecil.');
    } else {
      setFeedback('Selamat! Tebakanmu benar 🎉');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-300">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-6 text-yellow-700">Game Tebak-Tebakan</h1>
        <p className="text-xl mb-4 font-medium text-gray-700">Tebak angka antara 1 sampai 100</p>
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className="border rounded p-3 mb-4 w-full text-lg"
          placeholder="Masukkan Tebakan"
        />
        <button
          onClick={checkGuess}
          className="bg-yellow-500 text-white px-5 py-3 rounded-lg hover:bg-yellow-600 font-medium shadow-md"
        >
          Submit
        </button>
        {feedback && (
          <p className={`mt-5 text-lg font-semibold ${feedback.includes('benar') ? 'text-green-500' : 'text-red-500'}`}>{feedback}</p>
        )}
      </div>
    </div>
  );
};

export default GuessingGame;