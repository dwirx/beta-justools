import { useState, useEffect, useRef } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { 
  Settings, ArrowRight, 
  ChevronDown, ChevronUp, Copy, Check, RefreshCw, ArrowLeftRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- KONSTANTA CHARSETS ---
const VOWELS = "AEIOUY";
const CONSONANTS = "BCDFGHJKLMNPQRSTVWXZ";
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// --- WIRING (TABEL KABEL) ---
const WIRING_VOWEL = "YUOIEA";
const WIRING_FAST  = "TXZNBVCMQRPLKJHGFDSW";
const WIRING_MED   = "LKPJHGQMNBVCXZTRDSFW";
const WIRING_SLOW  = "RSTWQVNXZLKJHGDFMBCP";

// --- FUNGSI MATEMATIKA AMAN (SAFE MODULO) ---
const safeMod = (n: number, m: number) => ((n % m) + m) % m;

// --- FUNGSI INVERS WIRING ---
const createInverseWiring = (wiring: string, charset: string) => {
  const map = new Array(charset.length);
  for (let i = 0; i < wiring.length; i++) {
    const charInput = charset[i];
    const charOutput = wiring[i];
    const indexOutput = charset.indexOf(charOutput);
    
    if (indexOutput !== -1) {
      map[indexOutput] = charInput;
    }
  }
  return map.join('');
};

const INV_WIRING_VOWEL = createInverseWiring(WIRING_VOWEL, VOWELS);
const INV_WIRING_FAST  = createInverseWiring(WIRING_FAST, CONSONANTS);
const INV_WIRING_MED   = createInverseWiring(WIRING_MED, CONSONANTS);
const INV_WIRING_SLOW  = createInverseWiring(WIRING_SLOW, CONSONANTS);

interface TraceLog {
  index: number;
  in: string;
  out: string;
  type: string;
  fastPos: number;
  medPos: number;
  slowPos: number;
  steps: string[];
}

const PurpleCipherPage = () => {
  // --- STATE ---
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<'ENCRYPT' | 'DECRYPT'>('ENCRYPT');
  
  const [initFast, setInitFast] = useState(1);
  const [initMed, setInitMed] = useState(1);
  const [initSlow, setInitSlow] = useState(1);

  const [traceLog, setTraceLog] = useState<TraceLog[]>([]);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const charScrollRef = useRef<HTMLDivElement>(null);

  // --- CORE ENGINE ---
  const transformChar = (char: string, wiring: string, position: number, charset: string) => {
    const inputIdx = charset.indexOf(char);
    if (inputIdx === -1) return char;

    const len = charset.length;
    const offset = position - 1;

    const enterIdx = safeMod(inputIdx + offset, len);
    const wiredChar = wiring[enterIdx];
    const wiredIdx = charset.indexOf(wiredChar);
    const exitIdx = safeMod(wiredIdx - offset, len);

    return charset[exitIdx];
  };

  // --- PROSES PESAN ---
  const processMessage = () => {
    let result = "";
    const logs: TraceLog[] = [];
    
    let curFast = initFast;
    let curMed = initMed;
    let curSlow = initSlow;

    for (let i = 0; i < input.length; i++) {
      const rawChar = input[i].toUpperCase();
      
      if (!ALPHABET.includes(rawChar)) {
        result += rawChar;
        continue;
      }

      let outChar = rawChar;
      const log: TraceLog = { 
        index: i, in: rawChar, out: '', type: 'SYMBOL',
        fastPos: curFast, medPos: curMed, slowPos: curSlow,
        steps: []
      };

      if (VOWELS.includes(rawChar)) {
        log.type = 'VOWEL';
        const w = mode === 'ENCRYPT' ? WIRING_VOWEL : INV_WIRING_VOWEL;
        outChar = transformChar(rawChar, w, curFast, VOWELS); 
        log.steps.push(`Vokal (Offset ${curFast}): ${rawChar} -> ${outChar}`);
      } 
      else if (CONSONANTS.includes(rawChar)) {
        log.type = 'CONSONANT';
        let c1, c2, c3;

        if (mode === 'ENCRYPT') {
          c1 = transformChar(rawChar, WIRING_FAST, curFast, CONSONANTS);
          c2 = transformChar(c1, WIRING_MED, curMed, CONSONANTS);
          c3 = transformChar(c2, WIRING_SLOW, curSlow, CONSONANTS);
          outChar = c3;
          log.steps = [
            `SW1 (Pos ${curFast}): ${rawChar} -> ${c1}`,
            `SW2 (Pos ${curMed}): ${c1} -> ${c2}`,
            `SW3 (Pos ${curSlow}): ${c2} -> ${c3}`
          ];
        } else {
          c1 = transformChar(rawChar, INV_WIRING_SLOW, curSlow, CONSONANTS);
          c2 = transformChar(c1, INV_WIRING_MED, curMed, CONSONANTS);
          c3 = transformChar(c2, INV_WIRING_FAST, curFast, CONSONANTS);
          outChar = c3;
          log.steps = [
            `SW3 Inv (Pos ${curSlow}): ${rawChar} -> ${c1}`,
            `SW2 Inv (Pos ${curMed}): ${c1} -> ${c2}`,
            `SW1 Inv (Pos ${curFast}): ${c2} -> ${c3}`
          ];
        }

        curFast++;
        if (curFast > 20) {
          curFast = 1;
          curMed++;
          if (curMed > 20) {
            curMed = 1;
            curSlow++;
            if (curSlow > 20) curSlow = 1;
          }
        }
      }

      log.out = outChar;
      result += outChar;
      logs.push(log);
    }

    setOutput(result);
    setTraceLog(logs);
    
    if (logs.length > 0) {
      if(selectedStep === null || selectedStep >= logs.length) {
        setSelectedStep(logs.length - 1);
      }
    } else {
      setSelectedStep(null);
    }
  };

  useEffect(() => {
    processMessage();
  }, [input, mode, initFast, initMed, initSlow]);

  useEffect(() => {
    if (charScrollRef.current) {
      charScrollRef.current.scrollLeft = charScrollRef.current.scrollWidth;
    }
  }, [input.length]);

  const handleSwap = () => {
    if(!output) return;
    setInput(output);
    setMode(prev => prev === 'ENCRYPT' ? 'DECRYPT' : 'ENCRYPT');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentViz = selectedStep !== null && traceLog[selectedStep] ? traceLog[selectedStep] : null;

  return (
    <ToolLayout
      toolName="Purple Cipher"
      toolIcon="🟣"
      toolDescription="PURPLE cipher encryption/decryption simulator"
    >
      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex justify-center">
          <div className="flex bg-muted p-1 rounded-lg">
            <button
              onClick={() => setMode('ENCRYPT')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
                mode === 'ENCRYPT' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🔒 ENCRYPT
            </button>
            <button
              onClick={() => setMode('DECRYPT')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
                mode === 'DECRYPT' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🔓 DECRYPT
            </button>
          </div>
        </div>

        {/* KEYS */}
        <div className="bg-muted/50 rounded-xl p-4 border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Settings size={14} /> Daily Key
            </h2>
            <div className="font-mono text-xs bg-background px-2 py-1 rounded border border-border">
               {initFast}-{initMed}-{initSlow}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { val: initFast, set: setInitFast, label: "Switch 1 (Fast)", color: "accent-primary" },
              { val: initMed, set: setInitMed, label: "Switch 2 (Med)", color: "accent-blue-500" },
              { val: initSlow, set: setInitSlow, label: "Switch 3 (Slow)", color: "accent-teal-500" }
            ].map((s, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{s.label}</span>
                  <span className="font-mono">{s.val}</span>
                </div>
                <input 
                  type="range" min="1" max="20" 
                  value={s.val} onChange={(e) => s.set(parseInt(e.target.value))}
                  className={`w-full h-2 bg-background rounded-lg appearance-none cursor-pointer ${s.color}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* INPUT */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Input ({mode === 'ENCRYPT' ? 'Plaintext' : 'Ciphertext'})
          </label>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'ENCRYPT' ? "Ketik HELLO..." : "Paste cipher..."}
              className="w-full h-28 bg-background border border-border rounded-xl p-4 text-lg font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none uppercase"
            />
            {input && (
              <button 
                onClick={() => {setInput(''); setOutput(''); setTraceLog([]);}}
                className="absolute top-2 right-2 p-1.5 bg-muted text-muted-foreground rounded hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <RefreshCw size={14}/>
              </button>
            )}
          </div>
          
          {/* History Scroll */}
          {traceLog.length > 0 && (
            <div ref={charScrollRef} className="flex overflow-x-auto gap-1 mt-2 pb-2 scrollbar-thin">
              {traceLog.map((log, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedStep(i)}
                  className={`flex-shrink-0 w-8 h-10 rounded border flex items-center justify-center font-bold text-sm transition-all ${
                    selectedStep === i 
                      ? 'bg-primary border-primary text-primary-foreground scale-110' 
                      : 'bg-muted border-border text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {log.in}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* VISUALIZER */}
        {currentViz && (
          <div className="bg-muted/50 rounded-xl border border-border p-4">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center font-bold text-xl">
                  {currentViz.in}
                </div>
                <div className="text-xs text-muted-foreground mt-1">IN</div>
              </div>
              <ArrowRight className={`text-muted-foreground ${mode === 'DECRYPT' ? 'rotate-180' : ''}`} />
              <div className="text-center">
                <div className={`w-12 h-12 rounded-lg border flex items-center justify-center font-bold text-xl ${
                  mode === 'ENCRYPT' 
                    ? 'bg-primary/20 border-primary text-primary' 
                    : 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                }`}>
                  {currentViz.out}
                </div>
                <div className="text-xs text-muted-foreground mt-1">OUT</div>
              </div>
            </div>
             
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="w-full bg-background border border-border rounded-lg p-2 text-xs flex justify-between items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>View Process Flow</span>
              {showDetails ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            </button>
             
            {showDetails && (
              <div className="mt-2 bg-background p-3 rounded-lg border border-border text-xs font-mono text-muted-foreground space-y-1">
                {currentViz.steps.map((s, i) => <div key={i}>{i+1}. {s}</div>)}
              </div>
            )}
          </div>
        )}

        {/* OUTPUT */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Result ({mode === 'ENCRYPT' ? 'Ciphertext' : 'Plaintext'})
          </label>
          <div className={`w-full min-h-[5rem] bg-background border-2 rounded-xl p-4 text-lg font-mono break-all flex items-center ${
            mode === 'ENCRYPT' ? 'border-primary/50 text-primary' : 'border-emerald-500/50 text-emerald-400'
          }`}>
            {output || <span className="text-muted-foreground">...</span>}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <Button
              onClick={handleCopy}
              disabled={!output}
              variant="outline"
              className="gap-2"
            >
              {copied ? <Check size={16}/> : <Copy size={16}/>} Copy
            </Button>
            <Button
              onClick={handleSwap}
              disabled={!output}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeftRight size={16}/> Swap & {mode === 'ENCRYPT' ? 'Decrypt' : 'Encrypt'}
            </Button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default PurpleCipherPage;
