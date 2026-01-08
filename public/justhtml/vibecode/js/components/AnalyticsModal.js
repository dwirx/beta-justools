const { useMemo } = React;

// Responsive Analytics Modal Component
const AnalyticsModal = ({ isOpen, onClose, chats, isDark = true }) => {
    if (!isOpen) return null;

    const stats = useMemo(() => {
        const data = {};
        chats.forEach(chat => {
            chat.messages.forEach(msg => {
                if (msg.role === 'assistant' && msg.usage && msg.modelUsed) {
                    if (!data[msg.modelUsed]) data[msg.modelUsed] = { count: 0, inTokens: 0, outTokens: 0, cost: 0 };
                    data[msg.modelUsed].count += 1;
                    data[msg.modelUsed].inTokens += msg.usage.prompt_tokens;
                    data[msg.modelUsed].outTokens += msg.usage.completion_tokens;
                    data[msg.modelUsed].cost += (msg.costDetails?.total || 0);
                }
            });
        });
        return data;
    }, [chats]);

    const totalCost = Object.values(stats).reduce((acc, curr) => acc + curr.cost, 0);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className={`w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[85vh] animate-slide-up border ${isDark ? 'bg-dark-surface border-dark-border' : 'bg-light-surface border-light-border'}`} onClick={e => e.stopPropagation()}>
                <div className={`p-4 border-b flex justify-between items-center ${isDark ? 'border-dark-border bg-dark-bg/50' : 'border-light-border bg-slate-50'}`}>
                    <h2 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}><i data-lucide="bar-chart-2" className="text-brand-primary"></i> Analytics</h2>
                    <button onClick={onClose}><i data-lucide="x" className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}></i></button>
                </div>
                <div className="p-4 overflow-y-auto custom-scrollbar space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="text-[10px] uppercase text-blue-400 font-bold">Total Cost</div>
                            <div className={`text-xl font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>${totalCost.toFixed(5)}</div>
                        </div>
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <div className="text-[10px] uppercase text-purple-400 font-bold">Requests</div>
                            <div className={`text-xl font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{Object.values(stats).reduce((acc,c) => acc+c.count,0)}</div>
                        </div>
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg col-span-2 md:col-span-1">
                            <div className="text-[10px] uppercase text-green-400 font-bold">Tokens</div>
                            <div className={`text-xl font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{(Object.values(stats).reduce((acc,c) => acc+c.inTokens+c.outTokens,0)/1000).toFixed(1)}k</div>
                        </div>
                    </div>
                    <div>
                        <h3 className={`text-xs font-bold mb-3 uppercase ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Model Breakdown</h3>
                        <div className="space-y-3">
                            {Object.entries(stats).map(([id, data]) => (
                                <div key={id} className={`p-3 rounded-lg border ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-slate-50 border-light-border'}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs font-bold ${window.MODEL_REGISTRY[id]?.color || 'text-gray-400'}`}>{window.MODEL_REGISTRY[id]?.name || id}</span>
                                        <span className={`text-xs font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>${data.cost.toFixed(5)}</span>
                                    </div>
                                    <div className={`text-[10px] font-mono ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                                        In: {data.inTokens.toLocaleString()} • Out: {data.outTokens.toLocaleString()} • {data.count} Reqs
                                    </div>
                                </div>
                            ))}
                            {Object.keys(stats).length === 0 && <div className={`text-center text-sm italic py-4 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>Belum ada data penggunaan.</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export for use in app
window.AnalyticsModal = AnalyticsModal;
