import React, { useState } from 'react';

export const appMeta = {
  name: 'Game Penjumlahan',
  description: 'Game interaktif untuk latihan penjumlahan.',
  category: 'Education' as const,
  icon: '➕',
  featured: false,
  addedAt: '2026-02-13',
};

const AdditionGame: React.FC = () => {
  const [num1] = useState(Math.floor(Math.random() * 50));
  const [num2] = useState(Math.floor(Math.random() * 50));
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const checkAnswer = () => {
    const userAnswer = parseInt(answer, 10);
    if (userAnswer === num1 + num2) {
      setResult('Benar!');
    } else {
      setResult('Salah, coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Game Penjumlahan</h1>
        <p className="text-xl mb-4 font-medium text-gray-700">{num1} + {num2} = ?</p>
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="border rounded p-3 mb-4 w-full text-lg"
          placeholder="Masukkan Jawaban"
        />
        <button
          onClick={checkAnswer}
          className="bg-green-500 text-white px-5 py-3 rounded-lg hover:bg-green-600 font-medium shadow-md"
        >
          Submit
        </button>
        {result && (
          <p className={`mt-5 text-lg font-semibold ${result === 'Benar!' ? 'text-green-500' : 'text-red-500'}`}>{result}</p>
        )}
      </div>
    </div>
  );
};

export default AdditionGame;