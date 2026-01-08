const { useState } = React;

// Chat Actions Menu Component
const ChatActionsMenu = ({ isOpen, onClose, chatTitle, messages, isDark = true }) => {
    if (!isOpen) return null;

    const handleCopyChat = async () => {
        const text = window.formatChatAsText(messages, chatTitle);
        const success = await window.copyToClipboard(text);
        if (success) {
            window.showToast('Chat berhasil dicopy!');
            onClose();
        } else {
            window.showToast('Gagal copy chat', 'error');
        }
    };

    const handleDownloadMarkdown = () => {
        const md = window.formatChatAsMarkdown(messages, chatTitle);
        const filename = window.generateFilename(chatTitle, 'md');
        window.downloadAsFile(md, filename, 'text/markdown');
        window.showToast('Chat berhasil didownload sebagai MD!');
        onClose();
    };

    const handleDownloadText = () => {
        const text = window.formatChatAsText(messages, chatTitle);
        const filename = window.generateFilename(chatTitle, 'txt');
        window.downloadAsFile(text, filename, 'text/plain');
        window.showToast('Chat berhasil didownload sebagai TXT!');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className={`w-full max-w-sm rounded-xl shadow-2xl animate-slide-up border ${isDark ? 'bg-dark-surface border-dark-border' : 'bg-light-surface border-light-border'}`} onClick={e => e.stopPropagation()}>
                <div className={`p-4 border-b flex justify-between items-center ${isDark ? 'border-dark-border' : 'border-light-border'}`}>
                    <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <i data-lucide="download" className="w-4 h-4 text-brand-primary"></i>
                        Export Chat
                    </h3>
                    <button onClick={onClose} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                        <i data-lucide="x" className="w-5 h-5"></i>
                    </button>
                </div>

                <div className="p-4 space-y-2">
                    {/* Copy Chat */}
                    <button
                        onClick={handleCopyChat}
                        className={`w-full flex items-center gap-3 p-3 border rounded-lg transition-all group ${isDark ? 'bg-dark-bg hover:bg-dark-active border-dark-border' : 'bg-slate-50 hover:bg-light-active border-light-border'}`}
                    >
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                            <i data-lucide="copy" className="w-5 h-5 text-blue-400"></i>
                        </div>
                        <div className="flex-1 text-left">
                            <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Copy Chat</div>
                            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>Salin ke clipboard</div>
                        </div>
                        <i data-lucide="chevron-right" className={`w-4 h-4 ${isDark ? 'text-gray-600 group-hover:text-gray-400' : 'text-slate-400 group-hover:text-slate-600'}`}></i>
                    </button>

                    {/* Download as Markdown */}
                    <button
                        onClick={handleDownloadMarkdown}
                        className={`w-full flex items-center gap-3 p-3 border rounded-lg transition-all group ${isDark ? 'bg-dark-bg hover:bg-dark-active border-dark-border' : 'bg-slate-50 hover:bg-light-active border-light-border'}`}
                    >
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                            <i data-lucide="file-text" className="w-5 h-5 text-purple-400"></i>
                        </div>
                        <div className="flex-1 text-left">
                            <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Download Markdown</div>
                            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>Format .md dengan syntax highlighting</div>
                        </div>
                        <i data-lucide="chevron-right" className={`w-4 h-4 ${isDark ? 'text-gray-600 group-hover:text-gray-400' : 'text-slate-400 group-hover:text-slate-600'}`}></i>
                    </button>

                    {/* Download as Text */}
                    <button
                        onClick={handleDownloadText}
                        className={`w-full flex items-center gap-3 p-3 border rounded-lg transition-all group ${isDark ? 'bg-dark-bg hover:bg-dark-active border-dark-border' : 'bg-slate-50 hover:bg-light-active border-light-border'}`}
                    >
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                            <i data-lucide="file-down" className="w-5 h-5 text-green-400"></i>
                        </div>
                        <div className="flex-1 text-left">
                            <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Download Text</div>
                            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>Plain text .txt file</div>
                        </div>
                        <i data-lucide="chevron-right" className={`w-4 h-4 ${isDark ? 'text-gray-600 group-hover:text-gray-400' : 'text-slate-400 group-hover:text-slate-600'}`}></i>
                    </button>
                </div>

                <div className={`p-3 border-t ${isDark ? 'border-dark-border bg-dark-bg/50' : 'border-light-border bg-slate-50'}`}>
                    <div className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                        {messages.filter(m => m.role !== 'system').length} pesan akan di-export
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export for use in app
window.ChatActionsMenu = ChatActionsMenu;
