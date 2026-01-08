const { useState } = React;

// Individual Message Copy Button Component - Minimal & Elegant
const MessageCopyButton = ({ message, isUserMessage = false, className = '' }) => {
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
                px-2 py-0.5
                text-[11px] font-medium
                rounded
                transition-all duration-200
                ${copied
                    ? (isUserMessage
                        ? 'text-white/90 bg-white/20'
                        : 'text-green-400 bg-green-500/10')
                    : (isUserMessage
                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5')
                }
                active:scale-95
                ${className}
            `}
            title={copied ? 'Copied!' : 'Copy'}
        >
            <i data-lucide={copied ? "check" : "copy"} className="w-3 h-3"></i>
            <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
    );
};

window.MessageCopyButton = MessageCopyButton;
