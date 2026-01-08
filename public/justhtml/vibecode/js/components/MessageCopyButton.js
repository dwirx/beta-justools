const { useState } = React;

// Individual Message Copy Button Component
const MessageCopyButton = ({ message, className = '' }) => {
    const [copied, setCopied] = useState(false);
    const [animating, setAnimating] = useState(false);

    const handleCopy = async () => {
        const textToCopy = message.content;
        const success = await window.copyToClipboard(textToCopy);

        if (success) {
            setCopied(true);
            setAnimating(true);
            window.showToast('Copied!', 'success');

            setTimeout(() => setAnimating(false), 300);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`
                group/btn
                inline-flex
                opacity-100 md:opacity-0 md:group-hover:opacity-100
                transition-all duration-300 ease-out
                px-2.5 py-1.5
                rounded-lg
                items-center gap-1.5
                text-xs font-medium
                ${copied
                    ? 'bg-gradient-to-r from-emerald-500/90 to-teal-500/90 hover:from-emerald-600 hover:to-teal-600'
                    : 'bg-gradient-to-r from-blue-500/90 to-indigo-600/90 hover:from-blue-600 hover:to-indigo-700'
                }
                ${animating ? 'copy-success-animation' : ''}
                shadow-md hover:shadow-lg
                active:scale-95
                text-white
                backdrop-blur-sm
                border border-white/10
                overflow-hidden
                relative
                ${className}
            `}
            title={copied ? 'Copied!' : 'Copy message'}
        >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>

            {/* Content */}
            <div className="relative flex items-center gap-1.5">
                {copied ? (
                    <>
                        <i data-lucide="check" className="w-3.5 h-3.5 copy-success-slide"></i>
                        <span>Copied</span>
                    </>
                ) : (
                    <>
                        <i data-lucide="copy" className="w-3.5 h-3.5"></i>
                        <span>Copy</span>
                    </>
                )}
            </div>
        </button>
    );
};

window.MessageCopyButton = MessageCopyButton;
