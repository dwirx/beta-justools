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
    const [theme, setThemeState] = useState(window.getTheme());

    const bottomRef = useRef(null);
    const textareaRef = useRef(null);

    const handleToggleTheme = () => {
        const newTheme = window.toggleTheme();
        setThemeState(newTheme);
    };

    // Check if dark mode
    const isDark = theme === 'dark';

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
    }, [messages, chatActionsOpen, analyticsOpen, theme]);

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
        <div className={`flex h-screen overflow-hidden relative transition-colors duration-300 ${isDark ? 'bg-dark-bg text-gray-200' : 'bg-light-bg text-stone-700'}`}>
            <window.AnalyticsModal isOpen={analyticsOpen} onClose={() => setAnalyticsOpen(false)} chats={chatList} isDark={isDark} />
            <window.ChatActionsMenu
                isOpen={chatActionsOpen}
                onClose={() => setChatActionsOpen(false)}
                chatTitle={currentChatTitle}
                messages={messages}
                isDark={isDark}
            />

            {/* OVERLAY FOR MOBILE SIDEBAR */}
            {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in" onClick={() => setSidebarOpen(false)}></div>}

            {/* SIDEBAR (Responsive Drawer) */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 border-r transform transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex flex-col flex-shrink-0 shadow-2xl md:shadow-none ${isDark ? 'bg-dark-surface border-dark-border' : 'bg-light-surface border-light-border'}`}>
                <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-dark-border' : 'border-light-border'}`}>
                    <h1 className={`font-bold text-lg flex items-center gap-2 ${isDark ? 'text-white' : 'text-stone-800'}`}><span className="w-2 h-6 bg-brand-primary rounded-full"></span> VibeDev v7</h1>
                    <button onClick={() => setSidebarOpen(false)} className={`md:hidden p-1 ${isDark ? 'text-gray-400' : 'text-stone-500'}`}><i data-lucide="x"></i></button>
                </div>

                <div className="p-3">
                    <button onClick={createChat} className="w-full py-2.5 bg-brand-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                        <i data-lucide="plus" className="w-4 h-4"></i> Chat Baru
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 custom-scrollbar space-y-1">
                    {chatList.map(c => (
                        <div key={c.id} onClick={() => loadChat(c)} className={`group flex justify-between items-center p-2.5 rounded-lg text-sm cursor-pointer border transition-colors ${currChatId === c.id ? (isDark ? 'bg-dark-active border-dark-border text-white' : 'bg-light-active border-light-border text-stone-800') : (isDark ? 'border-transparent text-gray-400 hover:bg-dark-active/50' : 'border-transparent text-stone-500 hover:bg-light-active')}`}>
                            <div className="flex items-center gap-2 overflow-hidden">
                                <i data-lucide="message-square" className="w-3.5 h-3.5 flex-shrink-0"></i>
                                <span className="truncate">{c.title}</span>
                            </div>
                            <button onClick={(e) => deleteChat(e, c.id)} className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1"><i data-lucide="trash-2" className="w-3.5 h-3.5"></i></button>
                        </div>
                    ))}
                </div>

                <div className={`p-4 border-t ${isDark ? 'border-dark-border bg-dark-surface' : 'border-light-border bg-light-surface'}`}>
                    <button onClick={() => setSettingsOpen(!settingsOpen)} className={`flex items-center justify-between w-full text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-stone-500 hover:text-stone-800'}`}>
                        <span className="flex items-center gap-2"><i data-lucide="settings" className="w-4 h-4"></i> Pengaturan</span>
                        <i data-lucide="chevron-up" className={`w-4 h-4 transition-transform ${settingsOpen ? '' : 'rotate-180'}`}></i>
                    </button>
                    {settingsOpen && (
                        <div className={`mt-3 space-y-3 animate-fade-in p-2 rounded border ${isDark ? 'bg-dark-bg/50 border-dark-border' : 'bg-light-active border-light-border'}`}>
                            <div>
                                <div className={`text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-gray-500' : 'text-stone-500'}`}>API Key</div>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={e => { setApiKey(e.target.value); localStorage.setItem('vibe_key', e.target.value) }}
                                    className={`w-full rounded px-2 py-1.5 text-xs focus:border-brand-primary outline-none ${isDark ? 'bg-dark-bg border border-dark-border text-white' : 'bg-white border border-light-border text-stone-800'}`}
                                    placeholder="sk-..."
                                />
                            </div>
                            <div>
                                <div className={`text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-gray-500' : 'text-stone-500'}`}>Base URL API</div>
                                <input
                                    type="text"
                                    value={apiBaseUrl}
                                    onChange={e => handleApiBaseUrlChange(e.target.value)}
                                    className={`w-full rounded px-2 py-1.5 text-xs focus:border-brand-primary outline-none ${isDark ? 'bg-dark-bg border border-dark-border text-white' : 'bg-white border border-light-border text-stone-800'}`}
                                    placeholder={window.DEFAULT_API_BASE_URL}
                                />
                                <div className={`text-[9px] mt-1 ${isDark ? 'text-gray-600' : 'text-stone-400'}`}>Default: {window.DEFAULT_API_BASE_URL}</div>
                            </div>
                            {/* Theme Toggle */}
                            <div>
                                <div className={`text-[10px] font-bold uppercase mb-1 ${isDark ? 'text-gray-500' : 'text-stone-500'}`}>Theme</div>
                                <button
                                    onClick={handleToggleTheme}
                                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${isDark ? 'bg-dark-bg border border-dark-border text-white hover:border-brand-primary' : 'bg-white border border-light-border text-stone-800 hover:border-brand-primary'}`}
                                >
                                    <span className="flex items-center gap-2">
                                        <i data-lucide={isDark ? 'moon' : 'sun'} className="w-3.5 h-3.5"></i>
                                        {isDark ? 'Dark Mode' : 'Light Mode'}
                                    </span>
                                    <i data-lucide="refresh-cw" className="w-3 h-3"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MAIN CHAT AREA */}
            <div className={`flex-1 flex flex-col h-full relative min-w-0 ${isDark ? 'bg-dark-bg' : 'bg-light-bg'}`}>

                {/* COMPACT NAVBAR */}
                <div className={`h-12 border-b backdrop-blur flex items-center justify-between px-3 md:px-4 flex-shrink-0 z-30 ${isDark ? 'border-dark-border bg-dark-surface/90' : 'border-light-border bg-light-surface/90'}`}>
                    <div className="flex items-center gap-2 overflow-hidden">
                        <button onClick={() => setSidebarOpen(true)} className={`md:hidden p-1 ${isDark ? 'text-gray-400' : 'text-stone-500'}`}><i data-lucide="menu"></i></button>
                        <select value={model} onChange={e => setModel(e.target.value)} className={`bg-transparent text-sm font-semibold outline-none cursor-pointer hover:text-brand-primary transition-colors appearance-none ${isDark ? 'text-white' : 'text-stone-800'}`}>
                            {Object.entries(window.MODEL_REGISTRY).filter(([k]) => k !== 'unknown').map(([k, v]) => (
                                <option key={k} value={k} className={isDark ? 'bg-dark-surface' : 'bg-light-surface'}>{v.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-brand-success hidden sm:block">${sessionCost.toFixed(4)}</span>
                        <button onClick={() => setChatActionsOpen(true)} className={`p-1.5 rounded-lg transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-dark-active' : 'text-stone-500 hover:text-stone-800 hover:bg-light-active'}`} title="Export">
                            <i data-lucide="download" className="w-4 h-4"></i>
                        </button>
                        <button onClick={() => setAnalyticsOpen(true)} className={`p-1.5 rounded-lg transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-dark-active' : 'text-stone-500 hover:text-stone-800 hover:bg-light-active'}`} title="Analytics">
                            <i data-lucide="bar-chart-2" className="w-4 h-4"></i>
                        </button>
                    </div>
                </div>

                {/* MESSAGES (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-3 md:p-5 custom-scrollbar scroll-smooth">
                    <div className="max-w-3xl mx-auto space-y-4 pb-4">
                        {messages.filter(m => m.role !== 'system').map((msg, idx) => (
                            <div key={idx} className={`flex gap-2.5 animate-slide-up group ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${msg.role === 'user' ? 'bg-brand-primary text-white' : (isDark ? 'bg-dark-active text-gray-400' : 'bg-light-active text-stone-500')}`}>
                                    {msg.role === 'user' ? 'U' : 'AI'}
                                </div>
                                <div className={`flex flex-col min-w-0 max-w-[88%] md:max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`relative w-full px-3.5 py-2.5 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-brand-primary text-white rounded-tr-sm' :
                                            msg.isError ? 'bg-red-900/20 border border-red-800 text-red-100 rounded-tl-sm' :
                                                (isDark ? 'bg-dark-surface border border-dark-border text-gray-200 rounded-tl-sm' : 'bg-light-surface border border-light-border text-stone-700 rounded-tl-sm')
                                        }`}>
                                        {msg.thought && <window.Thinking text={msg.thought} />}
                                        {msg.role === 'user' ? (
                                            <div className="whitespace-pre-wrap">{msg.content}</div>
                                        ) : (
                                            <window.Markdown content={msg.content} isDark={isDark} />
                                        )}
                                    </div>
                                    {/* Minimal action row */}
                                    <div className={`flex items-center gap-2 mt-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <window.MessageCopyButton message={msg} isUserMessage={msg.role === 'user'} isDark={isDark} />
                                        {msg.role === 'assistant' && msg.costDetails && (
                                            <span className={`text-[9px] font-mono ${isDark ? 'text-gray-600' : 'text-stone-400'}`}>${msg.costDetails.total.toFixed(5)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {status === 'sending' && (
                            <div className="flex justify-center py-3 gap-1.5 opacity-50">
                                <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-brand-secondary rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-brand-success rounded-full animate-bounce delay-150"></div>
                            </div>
                        )}
                        <div ref={bottomRef} className="h-1"></div>
                    </div>
                </div>

                {/* COMPACT INPUT AREA */}
                <div className={`flex-shrink-0 border-t p-2 md:p-3 ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-light-bg border-light-border'}`}>
                    <div className="max-w-3xl mx-auto relative">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder="Ketik pesan..."
                            className={`w-full rounded-xl pl-4 pr-11 py-3 text-sm outline-none resize-none transition-all border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary ${isDark ? 'bg-dark-surface border-dark-border text-gray-200 placeholder-gray-500' : 'bg-light-surface border-light-border text-stone-700 placeholder-stone-400'}`}
                            rows="1"
                            style={{ maxHeight: '140px', overflowY: 'auto' }}
                            disabled={status === 'sending'}
                        />
                        <button
                            onClick={handleSend}
                            disabled={status === 'sending' || !input.trim()}
                            className={`absolute right-2 bottom-2 p-2 rounded-lg transition-all duration-200 ${input.trim() ? 'bg-brand-primary text-white hover:scale-105 active:scale-95' : (isDark ? 'text-gray-600' : 'text-stone-400')}`}
                        >
                            <i data-lucide="send" className="w-4 h-4"></i>
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
