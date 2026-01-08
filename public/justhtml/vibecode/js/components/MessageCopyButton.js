const { useState } = React;

// Individual Message Copy Button Component - Minimal & Elegant
const MessageCopyButton = ({ message, isUserMessage = false, isDark = true, className = '' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const textToCopy = message.content;
        const success = await window.copyToClipboard(textToCopy);

        if (success) {
            setCopied(true);
            window.showToast('Copied!', 'success');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`
                inline-flex items-center gap-1
                px-1.5 py-0.5
                text-[10px] font-medium
                rounded
                transition-all duration-200
                ${copied
                    ? (isUserMessage
                        ? 'text-white/90 bg-white/20'
                        : (isDark ? 'text-green-400' : 'text-green-600'))
                    : (isUserMessage
                        ? 'text-white/60 hover:text-white'
                        : (isDark ? 'text-gray-600 hover:text-gray-400' : 'text-stone-400 hover:text-stone-600'))
                }
                active:scale-95
                ${className}
            `}
            title={copied ? 'Copied!' : 'Copy'}
        >
            <i data-lucide={copied ? "check" : "copy"} className="w-3 h-3"></i>
        </button>
    );
};

window.MessageCopyButton = MessageCopyButton;
