import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw, X, ArrowDown, Move, Keyboard, FileText, Copy, ArrowRight, Lock, Unlock, ArrowRightLeft } from 'lucide-react';

// --- KONFIGURASI ENIGMA ---
const ROTOR_DATA = {
  I:   { wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' },
  II:  { wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' },
  III: { wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' },
  REFLECTOR_B: { wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT' }
};

export default function EnigmaMachine() {
  // State untuk mesin
  const [rotors, setRotors] = useState([
    { type: 'I', pos: 0 },   // Kiri (Slow)
    { type: 'II', pos: 0 },  // Tengah (Medium)
    { type: 'III', pos: 0 }  // Kanan (Fast)
  ]);
  
  const [plugboard, setPlugboard] = useState({}); 
  const [activeLamp, setActiveLamp] = useState(null); 
  const [pressedKey, setPressedKey] = useState(null); 
  const [history, setHistory] = useState([]); 
  const [showSettings, setShowSettings] = useState(false);
  const [tempPlug, setTempPlug] = useState(''); 
  
  // Mode: 'keyboard' atau 'text'
  const [mode, setMode] = useState('text'); // Default ke text mode sesuai request user
  
  // State Terpisah untuk Enkripsi dan Dekripsi
  const [encryptInput, setEncryptInput] = useState('');
  const [encryptOutput, setEncryptOutput] = useState('');
  const [decryptInput, setDecryptInput] = useState('');
  const [decryptOutput, setDecryptOutput] = useState('');
  
  // Feedback visual saat copy
  const [copyFeedback, setCopyFeedback] = useState(null);

  // --- LOGIKA MURNI (PURE FUNCTIONS) ---
  const toIndex = (char) => char.charCodeAt(0) - 65;
  const toChar = (index) => String.fromCharCode(((index % 26 + 26) % 26) + 65);

  const processRotorStep = (currentRotors) => {
    const newRotors = currentRotors.map(r => ({ ...r }));
    const r1 = newRotors[0]; 
    const r2 = newRotors[1]; 
    const r3 = newRotors[2]; 

    const notch3 = toIndex(ROTOR_DATA[r3.type].notch);
    const notch2 = toIndex(ROTOR_DATA[r2.type].notch);

    let rotate1 = false;
    let rotate2 = false;
    let rotate3 = true; 

    if (r2.pos === notch2) {
      rotate1 = true;
      rotate2 = true; 
    } else if (r3.pos === notch3) {
      rotate2 = true;
    }

    if (rotate1) r1.pos = (r1.pos + 1) % 26;
    if (rotate2) r2.pos = (r2.pos + 1) % 26;
    if (rotate3) r3.pos = (r3.pos + 1) % 26;

    return newRotors;
  };

  const processCharEncryption = (char, currentRotors, currentPlugboard) => {
    let signal = toIndex(char);

    // 1. Plugboard In
    if (currentPlugboard[toChar(signal)]) {
      signal = toIndex(currentPlugboard[toChar(signal)]);
    }

    // 2. Rotors (Right to Left)
    for (let i = 2; i >= 0; i--) {
      const { type, pos } = currentRotors[i];
      const wiring = ROTOR_DATA[type].wiring;
      const entryIndex = (signal + pos) % 26;
      const wiredChar = wiring[entryIndex];
      const wiredIndex = toIndex(wiredChar);
      signal = (wiredIndex - pos + 26) % 26;
    }

    // 3. Reflector
    const reflectorWiring = ROTOR_DATA.REFLECTOR_B.wiring;
    signal = toIndex(reflectorWiring[signal]);

    // 4. Rotors (Left to Right)
    for (let i = 0; i <= 2; i++) {
      const { type, pos } = currentRotors[i];
      const wiring = ROTOR_DATA[type].wiring;
      const entryIndex = (signal + pos) % 26;
      const charToFind = toChar(entryIndex);
      const wiringIndex = wiring.indexOf(charToFind);
      signal = (wiringIndex - pos + 26) % 26;
    }

    // 5. Plugboard Out
    if (currentPlugboard[toChar(signal)]) {
      signal = toIndex(currentPlugboard[toChar(signal)]);
    }

    return toChar(signal);
  };

  // --- HANDLERS INTERAKTIF ---

  // Handler Keyboard (Manual Step-by-Step)
  const handleKeyPress = (char) => {
    if (pressedKey) return; 
    setPressedKey(char);

    const nextRotors = processRotorStep(rotors);
    setRotors(nextRotors); // Di mode manual, rotor visual ikut berubah

    setTimeout(() => {
      const encryptedChar = processCharEncryption(char, nextRotors, plugboard);
      setActiveLamp(encryptedChar);
      setHistory(prev => [{ in: char, out: encryptedChar }, ...prev].slice(0, 10));

      setTimeout(() => {
        setActiveLamp(null);
        setPressedKey(null);
      }, 500);
    }, 50);
  };

  // Handler Teks (Batch Processing - Smart Mode)
  const handleBatchProcess = (type) => {
    // Clone rotor dari posisi visual SAAT INI (Posisi Awal)
    let tempRotors = rotors.map(r => ({ ...r })); 
    let result = '';

    // Pilih input berdasarkan tipe
    const rawInput = type === 'encrypt' ? encryptInput : decryptInput;
    const inputChars = rawInput.toUpperCase().split('');
    
    inputChars.forEach(char => {
      if (char >= 'A' && char <= 'Z') {
        tempRotors = processRotorStep(tempRotors);
        const enc = processCharEncryption(char, tempRotors, plugboard);
        result += enc;
      } else {
        result += char;
      }
    });

    // Set output ke kotak yang sesuai
    if (type === 'encrypt') {
      setEncryptOutput(result);
    } else {
      setDecryptOutput(result);
    }
    
    // PENTING: Kita TIDAK update state 'rotors' utama (setRotors).
    // Ini agar posisi rotor tetap di "Posisi Awal" untuk memudahkan dekripsi ulang.
  };

  // --- UTILS ---
  const addPlug = () => {
    const input = tempPlug.toUpperCase().replace(/[^A-Z]/g, '');
    if (input.length !== 2) return;
    const a = input[0]; const b = input[1];
    if (a === b || plugboard[a] || plugboard[b]) { alert("Konflik koneksi!"); return; }
    setPlugboard(prev => ({ ...prev, [a]: b, [b]: a }));
    setTempPlug('');
  };

  const clearPlugs = () => setPlugboard({});
  
  const resetMachine = () => {
    setRotors([{ type: 'I', pos: 0 }, { type: 'II', pos: 0 }, { type: 'III', pos: 0 }]);
    setHistory([]);
    setActiveLamp(null);
    setEncryptInput('');
    setEncryptOutput('');
    setDecryptInput('');
    setDecryptOutput('');
  };

  const copyToClipboard = (text, type) => {
    // Fallback: Membuat elemen textarea sementara untuk copy di lingkungan iframe yang ketat
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Pastikan elemen tidak terlihat tapi ada di DOM
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopyFeedback(type);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      console.error('Gagal menyalin teks', err);
      alert("Gagal menyalin otomatis. Silakan seleksi teks manual.");
    }
    
    document.body.removeChild(textArea);
  };

  const manualRotate = (index, direction) => {
    setRotors(prev => {
      const newRotors = [...prev];
      newRotors[index].pos = (newRotors[index].pos + direction + 26) % 26;
      return newRotors;
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-mono p-4 flex flex-col items-center select-none">
      
      {/* HEADER */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-500 tracking-widest">ENIGMA</h1>
          <p className="text-xs text-slate-400">M3 / NOvA DUAL-PROCESSOR</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 bg-slate-800 rounded hover:text-amber-400 transition" title="Pengaturan Kabel">
            <Settings size={20} />
          </button>
          <button onClick={resetMachine} className="p-2 bg-slate-800 rounded hover:text-red-400 transition" title="Reset Mesin">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* ROTOR CONTROL (PUSAT KONTROL) */}
      <div className="w-full max-w-4xl bg-slate-800 p-4 rounded-xl mb-6 shadow-xl border border-slate-700">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-amber-500 font-bold">
            <Lock size={20} />
            <span>POSISI AWAL ROTOR (KUNCI):</span>
          </div>
          
          <div className="flex gap-4">
            {rotors.map((rotor, idx) => (
              <div key={idx} className="flex flex-col items-center bg-black/30 p-2 rounded">
                <div className="text-[10px] text-slate-500 mb-1">ROTOR {['I','II','III'][idx]}</div>
                <div className="flex items-center gap-2">
                   <button onClick={() => manualRotate(idx, 1)} className="p-1 hover:bg-slate-700 rounded text-slate-400">▲</button>
                   <div className="text-2xl font-bold font-serif text-amber-400 w-8 text-center">{toChar(rotor.pos)}</div>
                   <button onClick={() => manualRotate(idx, -1)} className="p-1 hover:bg-slate-700 rounded text-slate-400">▼</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-xs text-slate-400 w-48 text-right hidden md:block">
            *Atur kunci ini sebelum melakukan enkripsi atau dekripsi.
          </div>
        </div>
      </div>

      {/* TABS MODE */}
      <div className="w-full max-w-4xl flex mb-4 bg-slate-800 rounded-lg p-1">
        <button 
          onClick={() => setMode('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition ${mode === 'text' ? 'bg-amber-600 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <FileText size={18} /> Pesan Teks (Otomatis)
        </button>
        <button 
          onClick={() => setMode('keyboard')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition ${mode === 'keyboard' ? 'bg-amber-600 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Keyboard size={18} /> Manual (Satu-satu)
        </button>
      </div>

      <div className="w-full max-w-4xl">
        
        {/* OVERLAY SETTINGS */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 p-6 rounded-xl border border-amber-500/50 w-full max-w-lg shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl text-amber-500 font-bold">Plugboard</h3>
                <button onClick={() => setShowSettings(false)}><X className="text-slate-400" /></button>
              </div>
              <div className="flex gap-2 items-center mb-4">
                <input 
                  type="text" value={tempPlug} onChange={(e) => setTempPlug(e.target.value.toUpperCase())}
                  placeholder="AB" maxLength={2} className="bg-slate-800 border border-slate-600 p-2 rounded w-20 text-center text-lg uppercase focus:border-amber-500 outline-none"
                />
                <button onClick={addPlug} className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded text-black font-bold">Sambung</button>
                <button onClick={clearPlugs} className="text-red-400 text-sm ml-auto hover:underline">Reset</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(plugboard).length === 0 && <span className="text-slate-500 italic">Kosong...</span>}
                {Object.keys(plugboard).map(k => (
                  plugboard[k] > k ? (
                    <div key={k} className="bg-slate-700 px-3 py-1 rounded-full flex items-center gap-2 border border-slate-600">
                      <span className="text-amber-400 font-bold">{k}</span><Move size={14} /><span className="text-amber-400 font-bold">{plugboard[k]}</span>
                    </div>
                  ) : null
                ))}
              </div>
            </div>
          </div>
        )}

        {mode === 'text' ? (
          /* --- MODE TEKS (DUAL PANEL) --- */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* PANEL ENKRIPSI */}
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col gap-3 shadow-lg">
              <div className="flex items-center gap-2 text-green-400 font-bold border-b border-slate-700 pb-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                ENKRIPSI (BUAT SANDI)
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase">Input Pesan Asli</label>
                <textarea 
                  value={encryptInput}
                  onChange={(e) => setEncryptInput(e.target.value)}
                  placeholder="Ketik pesan rahasia..."
                  className="w-full h-24 bg-slate-900/50 text-slate-200 border border-slate-600 rounded p-3 focus:border-green-500 outline-none resize-none font-mono text-sm"
                />
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={() => handleBatchProcess('encrypt')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded shadow transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <ArrowDown size={16} /> ENKRIPSI PESAN
                </button>
              </div>

              <div className="space-y-1 relative">
                <label className="text-[10px] text-slate-500 uppercase flex justify-between">
                  <span>Output Sandi (Ciphertext)</span>
                  {copyFeedback === 'encrypt' && <span className="text-green-400 animate-pulse">Tersalin!</span>}
                </label>
                <textarea 
                  readOnly
                  value={encryptOutput}
                  placeholder="Hasil sandi akan muncul di sini..."
                  className="w-full h-24 bg-black/40 text-green-400 border border-slate-700 rounded p-3 outline-none resize-none font-mono text-sm font-bold"
                />
                {encryptOutput && (
                  <button 
                    onClick={() => copyToClipboard(encryptOutput, 'encrypt')}
                    className="absolute top-7 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-300"
                    title="Salin"
                  >
                    <Copy size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* PANEL DEKRIPSI */}
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col gap-3 shadow-lg">
              <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-700 pb-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                DEKRIPSI (BACA SANDI)
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase">Input Pesan Sandi</label>
                <textarea 
                  value={decryptInput}
                  onChange={(e) => setDecryptInput(e.target.value)}
                  placeholder="Tempel kode rahasia di sini..."
                  className="w-full h-24 bg-slate-900/50 text-slate-200 border border-slate-600 rounded p-3 focus:border-cyan-500 outline-none resize-none font-mono text-sm"
                />
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={() => handleBatchProcess('decrypt')}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 rounded shadow transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <ArrowDown size={16} /> DEKRIPSI PESAN
                </button>
              </div>

              <div className="space-y-1 relative">
                <label className="text-[10px] text-slate-500 uppercase flex justify-between">
                  <span>Output Terjemahan (Plaintext)</span>
                  {copyFeedback === 'decrypt' && <span className="text-cyan-400 animate-pulse">Tersalin!</span>}
                </label>
                <textarea 
                  readOnly
                  value={decryptOutput}
                  placeholder="Pesan terbaca akan muncul di sini..."
                  className="w-full h-24 bg-black/40 text-cyan-400 border border-slate-700 rounded p-3 outline-none resize-none font-mono text-sm font-bold"
                />
                {decryptOutput && (
                  <button 
                    onClick={() => copyToClipboard(decryptOutput, 'decrypt')}
                    className="absolute top-7 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-300"
                    title="Salin"
                  >
                    <Copy size={14} />
                  </button>
                )}
              </div>
            </div>

          </div>
        ) : (
          /* --- MODE KEYBOARD (MANUAL) --- */
          <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700">
             {/* LAMPBOARD & KEYBOARD (Seperti sebelumnya) */}
             <div className="mb-8">
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-2">
                {'QWERTYUIOP'.split('').map(char => <Lamp key={char} char={char} active={activeLamp === char} />)}
              </div>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-6 mt-2 md:mt-4">
                {'ASDFGHJKL'.split('').map(char => <Lamp key={char} char={char} active={activeLamp === char} />)}
              </div>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-10 mt-2 md:mt-4">
                {'ZXCVBNM'.split('').map(char => <Lamp key={char} char={char} active={activeLamp === char} />)}
              </div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg border-t border-slate-700">
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {'QWERTYUIOP'.split('').map(char => <KeyButton key={char} char={char} onPressed={handleKeyPress} isPressed={pressedKey === char} />)}
              </div>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-2 md:mt-3 px-4">
                {'ASDFGHJKL'.split('').map(char => <KeyButton key={char} char={char} onPressed={handleKeyPress} isPressed={pressedKey === char} />)}
              </div>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-2 md:mt-3 px-8">
                {'ZXCVBNM'.split('').map(char => <KeyButton key={char} char={char} onPressed={handleKeyPress} isPressed={pressedKey === char} />)}
              </div>
            </div>
            
            {/* Live History */}
            <div className="mt-6">
                <h3 className="text-slate-500 text-sm mb-2 flex items-center gap-2">
                    <ArrowDown size={14} /> RIWAYAT MANUAL
                </h3>
                <div className="bg-amber-100 text-slate-900 font-mono p-4 rounded shadow-inner min-h-[80px] max-h-[120px] overflow-y-auto border-t-4 border-dashed border-slate-300">
                    {history.length === 0 ? (
                    <span className="opacity-50 text-sm">Menunggu input keyboard...</span>
                    ) : (
                    history.map((item, idx) => (
                        <div key={idx} className="flex gap-4 border-b border-amber-200/50 py-1 text-sm">
                        <span className="w-16">In: <b>{item.in}</b></span>
                        <span className="text-amber-700">➜</span>
                        <span className="w-16 text-amber-900">Out: <b>{item.out}</b></span>
                        </div>
                    ))
                    )}
                </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// --- KOMPONEN KECIL ---
function Lamp({ char, active }) {
  return (
    <div className={`
      w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-200
      ${active 
        ? 'bg-amber-400 text-amber-900 border-amber-200 shadow-[0_0_25px_5px_rgba(251,191,36,0.8)] scale-105 z-10' 
        : 'bg-slate-700 text-slate-500 border-slate-600 opacity-60 shadow-inner'}
    `}>
      {char}
    </div>
  );
}

function KeyButton({ char, onPressed, isPressed }) {
  return (
    <button
      onMouseDown={() => onPressed(char)}
      onTouchStart={(e) => { e.preventDefault(); onPressed(char); }}
      className={`
        w-10 h-10 md:w-12 md:h-12 rounded-full font-bold text-lg border-b-4 transition-all duration-75 active:border-b-0 active:translate-y-1
        ${isPressed 
          ? 'bg-slate-300 text-slate-900 border-slate-400 translate-y-1 border-b-0' 
          : 'bg-slate-600 text-slate-200 border-slate-800 hover:bg-slate-500'}
      `}
    >
      {char}
    </button>
  );
}