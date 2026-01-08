const { useState } = React;

// Thinking Accordion Component
const Thinking = ({ text }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="mb-3 rounded-lg border border-purple-500/20 bg-purple-900/10 overflow-hidden">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-purple-400 uppercase tracking-wider bg-black/20 hover:bg-purple-500/10 transition-colors">
                <i data-lucide="brain-circuit" className="w-3.5 h-3.5"></i> Proses Berpikir
                <i data-lucide={open ? "chevron-up" : "chevron-down"} className="w-3.5 h-3.5 ml-auto"></i>
            </button>
            {open && <div className="p-3 bg-black/20 text-xs text-gray-300 font-mono whitespace-pre-wrap max-h-64 overflow-y-auto custom-scrollbar">{text}</div>}
        </div>
    );
};

// Export for use in app
window.Thinking = Thinking;
