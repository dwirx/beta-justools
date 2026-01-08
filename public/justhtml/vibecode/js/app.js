const { useState, useEffect, useRef, useMemo } = React;

// Main App Component
const App = () => {
    const [apiKey, setApiKey] = useState('');
    const [apiBaseUrl, setApiBaseUrlState] = useState('');
    const [model, setModel] = useState('claude-sonnet-4-5');
    const [input, setInput] = useState('');
    const [status, setStatus] = useState('idle');
    const [messages, setMessages] = useState([]);
    const [chatList, setChatList] = useState([]);
    const [currChatId, setCurrChatId] = useState(null);

    // UI States
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [analyticsOpen, setAnalyticsOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [chatActionsOpen, setChatActionsOpen] = useState(false);

    const bottomRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            const chats = await window.db.getAll();
            chats.sort((a, b) => b.timestamp - a.timestamp);
            setChatList(chats);
            if (chats.length) loadChat(chats[0]);
            else createChat();
        };
        init();

        const k = localStorage.getItem('vibe_key');
        if (k) setApiKey(k);

        const baseUrl = window.getApiBaseUrl();
        setApiBaseUrlState(baseUrl);
    }, []);

    useEffect(() => {
        lucide.createIcons();
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, chatActionsOpen, analyticsOpen]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
        }
    }, [input]);

    const createChat = async () => {
        const id = Date.now().toString();
        const newC = { id, title: 'Chat Baru', messages: [{ role: 'system', content: 'System ready.' }], timestamp: Date.now() };
        await window.db.put(newC);
        setChatList(prev => [newC, ...prev]);
        loadChat(newC);
    };

    const loadChat = (chat) => {
        setCurrChatId(chat.id);
        setMessages(chat.messages);
        setSidebarOpen(false); // Close sidebar on mobile select
    };

    const updateChat = async (msgs) => {
        setMessages(msgs);
        const title = msgs.find(m => m.role === 'user')?.content.slice(0, 30) || 'Chat Baru';
        const updated = { id: currChatId, title, messages: msgs, timestamp: Date.now() };
        await window.db.put(updated);
        setChatList(prev => prev.map(c => c.id === currChatId ? updated : c));
    };

    const deleteChat = async (e, id) => {
        e.stopPropagation();
        if (!confirm('Hapus chat ini?')) return;
        await window.db.delete(id);
        const rem = chatList.filter(c => c.id !== id);
        setChatList(rem);
        if (currChatId === id) rem.length ? loadChat(rem[0]) : createChat();
    };

    const handleApiBaseUrlChange = (url) => {
        setApiBaseUrlState(url);
        window.setApiBaseUrl(url);
    };

    const handleSend = async () => {
        if (!input.trim() || !apiKey) {
            if (!apiKey) {
                setSidebarOpen(true);
                setSettingsOpen(true);
            }
            return;
        }

        const userMsg = { role: 'user', content: input };
        const tempMsgs = [...messages, userMsg];
        setMessages(tempMsgs);
        setInput('');
        setStatus('sending');

        try {
            const apiUrl = `${apiBaseUrl}/chat/completions`;
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: model,
                    messages: tempMsgs.filter(m => m.role !== 'system').map(({ role, content }) => ({ role, content })),
                    max_tokens: 8192,
                    stream: false
                })
            });

            if (!res.ok) throw new Error((await res.json()).error?.message || 'API Error');

            const data = await res.json();
            const raw = data.choices[0].message.content;

            // Parse Thinking
            let thought = null, final = raw;
            const match = raw.match(/<thinking>([\s\S]*?)<\/thinking>/i);
            if (match) {
                thought = match[1].trim();
                final = raw.replace(match[0], '').trim();
            }

            const usage = data.usage || { prompt_tokens: Math.ceil(input.length / 4), completion_tokens: Math.ceil(raw.length / 4) };
            const costDetails = window.calculateCost(model, usage.prompt_tokens, usage.completion_tokens);

            const aiMsg = { role: 'assistant', content: final, thought, usage, costDetails, modelUsed: model };
            updateChat([...tempMsgs, aiMsg]);

        } catch (e) {
            updateChat([...tempMsgs, { role: 'assistant', content: `Error: ${e.message}`, isError: true }]);
        } finally {
            setStatus('idle');
        }
    };

    // Calculate Session Cost
    const sessionCost = useMemo(() => messages.reduce((acc, m) => acc + (m.costDetails?.total || 0), 0), [messages]);

    // Get current chat title
    const currentChatTitle = useMemo(() => {
        const chat = chatList.find(c => c.id === currChatId);
        return chat?.title || 'Chat Baru';
    }, [chatList, currChatId]);

    return (
        <div className="flex h-screen bg-dark-bg text-gray-200 overflow-hidden relative">
            <window.AnalyticsModal isOpen={analyticsOpen} onClose={() => setAnalyticsOpen(false)} chats={chatList} />
            <window.ChatActionsMenu
                isOpen={chatActionsOpen}
                onClose={() => setChatActionsOpen(false)}
                chatTitle={currentChatTitle}
                messages={messages}
            />

            {/* OVERLAY FOR MOBILE SIDEBAR */}
            {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in" onClick={() => setSidebarOpen(false)}></div>}

            {/* SIDEBAR (Responsive Drawer) */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-dark-surface border-r border-dark-border transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex flex-col flex-shrink-0 shadow-2xl md:shadow-none`}>
                <div className="p-4 border-b border-dark-border flex items-center justify-between">
                    <h1 className="font-bold text-lg flex items-center gap-2 text-white"><span className="w-2 h-6 bg-brand-primary rounded-full"></span> VibeDev v7</h1>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 p-1"><i data-lucide="x"></i></button>
                </div>

                <div className="p-3">
                    <button onClick={createChat} className="w-full py-2.5 bg-brand-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                        <i data-lucide="plus" className="w-4 h-4"></i> Chat Baru
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 custom-scrollbar space-y-1">
                    {chatList.map(c => (
                        <div key={c.id} onClick={() => loadChat(c)} className={`group flex justify-between items-center p-2.5 rounded-lg text-sm cursor-pointer border ${currChatId === c.id ? 'bg-dark-active border-dark-border text-white' : 'border-transparent text-gray-400 hover:bg-dark-active/50'}`}>
                            <div className="flex items-center gap-2 overflow-hidden">
                                <i data-lucide="message-square" className="w-3.5 h-3.5 flex-shrink-0"></i>
                                <span className="truncate">{c.title}</span>
                            </div>
                            <button onClick={(e) => deleteChat(e, c.id)} className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1"><i data-lucide="trash-2" className="w-3.5 h-3.5"></i></button>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-dark-border bg-dark-surface">
                    <button onClick={() => setSettingsOpen(!settingsOpen)} className="flex items-center justify-between w-full text-sm text-gray-400 hover:text-white transition-colors">
                        <span className="flex items-center gap-2"><i data-lucide="settings" className="w-4 h-4"></i> Pengaturan</span>
                        <i data-lucide="chevron-up" className={`w-4 h-4 transition-transform ${settingsOpen ? '' : 'rotate-180'}`}></i>
                    </button>
                    {settingsOpen && (
                        <div className="mt-3 space-y-3 animate-fade-in p-2 bg-dark-bg/50 rounded border border-dark-border">
                            <div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">API Key</div>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={e => { setApiKey(e.target.value); localStorage.setItem('vibe_key', e.target.value) }}
                                    className="w-full bg-dark-bg border border-dark-border rounded px-2 py-1.5 text-xs text-white focus:border-brand-primary outline-none"
                                    placeholder="sk-..."
                                />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Base URL API</div>
                                <input
                                    type="text"
                                    value={apiBaseUrl}
                                    onChange={e => handleApiBaseUrlChange(e.target.value)}
                                    className="w-full bg-dark-bg border border-dark-border rounded px-2 py-1.5 text-xs text-white focus:border-brand-primary outline-none"
                                    placeholder={window.DEFAULT_API_BASE_URL}
                                />
                                <div className="text-[9px] text-gray-600 mt-1">Default: {window.DEFAULT_API_BASE_URL}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MAIN CHAT AREA */}
            <div className="flex-1 flex flex-col h-full relative min-w-0 bg-dark-bg">

                {/* NAVBAR */}
                <div className="h-14 md:h-16 border-b border-dark-border bg-dark-surface/90 backdrop-blur flex items-center justify-between px-3 md:px-5 flex-shrink-0 z-30">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-400 p-1"><i data-lucide="menu"></i></button>
                        <div className="flex flex-col">
                            <select value={model} onChange={e => setModel(e.target.value)} className="bg-transparent text-sm font-bold text-white outline-none cursor-pointer hover:text-brand-primary transition-colors appearance-none pr-4">
                                {Object.entries(window.MODEL_REGISTRY).filter(([k]) => k !== 'unknown').map(([k, v]) => (
                                    <option key={k} value={k} className="bg-dark-surface">{v.name}</option>
                                ))}
                            </select>
                            <div className="text-[10px] text-gray-500 font-mono hidden sm:block">
                                ${window.MODEL_REGISTRY[model]?.in}/M In • ${window.MODEL_REGISTRY[model]?.out}/M Out
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex flex-col items-end mr-2">
                            <span className="text-[10px] text-gray-500 uppercase font-bold">Session Cost</span>
                            <span className="text-xs font-mono font-bold text-brand-success">${sessionCost.toFixed(5)}</span>
                        </div>
                        <button onClick={() => setChatActionsOpen(true)} className="p-2 bg-dark-active hover:bg-dark-border border border-dark-border rounded-lg transition-all text-gray-300 hover:text-white" title="Export Chat">
                            <i data-lucide="download" className="w-5 h-5"></i>
                        </button>
                        <button onClick={() => setAnalyticsOpen(true)} className="p-2 bg-dark-active hover:bg-dark-border border border-dark-border rounded-lg transition-all text-gray-300 hover:text-white" title="Analytics">
                            <i data-lucide="bar-chart-2" className="w-5 h-5"></i>
                        </button>
                    </div>
                </div>

                {/* MESSAGES (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-3 md:p-6 custom-scrollbar scroll-smooth">
                    <div className="max-w-4xl mx-auto space-y-6 pb-4">
                        {messages.filter(m => m.role !== 'system').map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 md:gap-4 animate-slide-up group ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold shadow-md ${msg.role === 'user' ? 'bg-brand-primary text-white' : 'bg-dark-surface border border-dark-border text-gray-400'}`}>
                                    {msg.role === 'user' ? 'U' : 'AI'}
                                </div>
                                <div className={`flex flex-col min-w-0 max-w-[85%] md:max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`relative w-full px-4 py-3 rounded-2xl shadow-sm border text-sm ${msg.role === 'user' ? 'bg-brand-primary text-white border-brand-primary rounded-tr-sm' :
                                            msg.isError ? 'bg-red-900/20 border-red-800 text-red-100 rounded-tl-sm' :
                                                'bg-dark-surface border-dark-border text-gray-200 rounded-tl-sm'
                                        }`}>
                                        {msg.thought && <window.Thinking text={msg.thought} />}
                                        {msg.role === 'user' ? (
                                            <div className="whitespace-pre-wrap">{msg.content}</div>
                                        ) : (
                                            <window.Markdown content={msg.content} />
                                        )}

                                        {/* Footer with metadata and copy */}
                                        <div className={`mt-2 pt-2 border-t ${msg.role === 'user' ? 'border-white/10' : 'border-white/5'} flex items-center justify-between gap-2 flex-wrap`}>
                                            {msg.role === 'assistant' && !msg.isError && msg.usage && msg.costDetails ? (
                                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono text-gray-500 select-none">
                                                    <span className="flex items-center gap-1 text-gray-400">
                                                        <i data-lucide="cpu" className="w-3 h-3"></i>
                                                        {window.MODEL_REGISTRY[msg.modelUsed]?.name || msg.modelUsed}
                                                    </span>
                                                    <span>T: {msg.usage.prompt_tokens} / {msg.usage.completion_tokens}</span>
                                                    <span className="text-brand-success font-bold">${msg.costDetails.total.toFixed(5)}</span>
                                                </div>
                                            ) : <div></div>}
                                            <window.MessageCopyButton message={msg} isUserMessage={msg.role === 'user'} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {status === 'sending' && (
                            <div className="flex justify-center py-4 gap-1.5 opacity-50">
                                <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-brand-secondary rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-brand-success rounded-full animate-bounce delay-150"></div>
                            </div>
                        )}
                        <div ref={bottomRef} className="h-1"></div>
                    </div>
                </div>

                {/* INPUT AREA (Sticky Footer) */}
                <div className="flex-shrink-0 bg-dark-bg/95 backdrop-blur border-t border-dark-border p-3 md:p-5 pb-safe">
                    <div className="max-w-4xl mx-auto relative group">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder="Ketik pesan..."
                            className="w-full bg-dark-surface border border-dark-border rounded-xl pl-4 pr-12 py-3.5 text-base md:text-sm text-gray-200 placeholder-gray-500 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none resize-none shadow-lg transition-all"
                            rows="1"
                            style={{ maxHeight: '160px', overflowY: 'auto' }}
                            disabled={status === 'sending'}
                        />
                        <button
                            onClick={handleSend}
                            disabled={status === 'sending' || !input.trim()}
                            className={`absolute right-2 bottom-2 p-2 rounded-lg transition-all duration-200 ${input.trim() ? 'bg-brand-primary text-white shadow-lg hover:scale-105 active:scale-95' : 'text-gray-600'}`}
                        >
                            <i data-lucide="send" className="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
