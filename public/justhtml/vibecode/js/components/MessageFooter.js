// Message Footer Component
const MessageFooter = ({ modelId, usage, cost }) => {
    if (!usage || !cost) return null;

    const m = window.MODEL_REGISTRY[modelId] || window.MODEL_REGISTRY['unknown'];

    return (
        <div className="mt-2 pt-2 border-t border-white/5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-gray-500 select-none">
            <span className="flex items-center gap-1 text-gray-400"><i data-lucide="cpu" className="w-3 h-3"></i> {m.name}</span>
            <span title="In/Out Tokens">T: {usage.prompt_tokens} / {usage.completion_tokens}</span>
            <span className="ml-auto text-brand-success font-bold bg-brand-success/5 px-1.5 rounded border border-brand-success/10">${cost.total.toFixed(5)}</span>
        </div>
    );
};

// Export for use in app
window.MessageFooter = MessageFooter;
