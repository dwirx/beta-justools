const { useState } = React;

// Chat Actions Menu Component
const ChatActionsMenu = ({ isOpen, onClose, chatTitle, messages }) => {
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
            <div className="bg-dark-surface border border-dark-border w-full max-w-sm rounded-xl shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-dark-border flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <i data-lucide="download" className="w-4 h-4 text-brand-primary"></i>
                        Export Chat
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <i data-lucide="x" className="w-5 h-5"></i>
                    </button>
                </div>

                <div className="p-4 space-y-2">
                    {/* Copy Chat */}
                    <button
                        onClick={handleCopyChat}
                        className="w-full flex items-center gap-3 p-3 bg-dark-bg hover:bg-dark-active border border-dark-border rounded-lg transition-all group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                            <i data-lucide="copy" className="w-5 h-5 text-blue-400"></i>
                        </div>
                        <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-white">Copy Chat</div>
                            <div className="text-xs text-gray-500">Salin ke clipboard</div>
                        </div>
                        <i data-lucide="chevron-right" className="w-4 h-4 text-gray-600 group-hover:text-gray-400"></i>
                    </button>

                    {/* Download as Markdown */}
                    <button
                        onClick={handleDownloadMarkdown}
                        className="w-full flex items-center gap-3 p-3 bg-dark-bg hover:bg-dark-active border border-dark-border rounded-lg transition-all group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                            <i data-lucide="file-text" className="w-5 h-5 text-purple-400"></i>
                        </div>
                        <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-white">Download Markdown</div>
                            <div className="text-xs text-gray-500">Format .md dengan syntax highlighting</div>
                        </div>
                        <i data-lucide="chevron-right" className="w-4 h-4 text-gray-600 group-hover:text-gray-400"></i>
                    </button>

                    {/* Download as Text */}
                    <button
                        onClick={handleDownloadText}
                        className="w-full flex items-center gap-3 p-3 bg-dark-bg hover:bg-dark-active border border-dark-border rounded-lg transition-all group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                            <i data-lucide="file-down" className="w-5 h-5 text-green-400"></i>
                        </div>
                        <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-white">Download Text</div>
                            <div className="text-xs text-gray-500">Plain text .txt file</div>
                        </div>
                        <i data-lucide="chevron-right" className="w-4 h-4 text-gray-600 group-hover:text-gray-400"></i>
                    </button>
                </div>

                <div className="p-3 border-t border-dark-border bg-dark-bg/50">
                    <div className="text-xs text-gray-500 text-center">
                        {messages.filter(m => m.role !== 'system').length} pesan akan di-export
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export for use in app
window.ChatActionsMenu = ChatActionsMenu;
