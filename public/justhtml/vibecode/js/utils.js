// Utility functions for chat export and operations

/**
 * Format chat messages to plain text
 */
const formatChatAsText = (messages, title = 'Chat') => {
    const timestamp = new Date().toLocaleString('id-ID');
    let text = `${title}\n`;
    text += `Exported: ${timestamp}\n`;
    text += `${'='.repeat(50)}\n\n`;

    messages.filter(m => m.role !== 'system').forEach((msg, idx) => {
        const role = msg.role === 'user' ? 'USER' : 'ASSISTANT';
        text += `[${role}]\n`;

        if (msg.thought) {
            text += `\n--- Thinking Process ---\n${msg.thought}\n--- End Thinking ---\n\n`;
        }

        text += `${msg.content}\n`;

        if (msg.usage && msg.costDetails) {
            text += `\n(Tokens: ${msg.usage.prompt_tokens}/${msg.usage.completion_tokens} | Cost: $${msg.costDetails.total.toFixed(5)})\n`;
        }

        text += `\n${'-'.repeat(50)}\n\n`;
    });

    return text;
};

/**
 * Format chat messages to Markdown
 */
const formatChatAsMarkdown = (messages, title = 'Chat') => {
    const timestamp = new Date().toLocaleString('id-ID');
    let md = `# ${title}\n\n`;
    md += `**Exported:** ${timestamp}\n\n`;
    md += `---\n\n`;

    messages.filter(m => m.role !== 'system').forEach((msg, idx) => {
        const role = msg.role === 'user' ? '👤 User' : '🤖 Assistant';
        md += `## ${role}\n\n`;

        if (msg.thought) {
            md += `<details>\n<summary>💭 Thinking Process</summary>\n\n\`\`\`\n${msg.thought}\n\`\`\`\n\n</details>\n\n`;
        }

        md += `${msg.content}\n\n`;

        if (msg.usage && msg.costDetails) {
            const modelName = window.MODEL_REGISTRY[msg.modelUsed]?.name || msg.modelUsed;
            md += `<sub>📊 ${modelName} • Tokens: ${msg.usage.prompt_tokens}/${msg.usage.completion_tokens} • Cost: $${msg.costDetails.total.toFixed(5)}</sub>\n\n`;
        }

        md += `---\n\n`;
    });

    return md;
};

/**
 * Copy text to clipboard
 */
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
    }
};

/**
 * Download text as file
 */
const downloadAsFile = (content, filename, mimeType = 'text/plain') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Generate safe filename from chat title
 */
const generateFilename = (title, extension) => {
    const safeTitle = title
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase()
        .substring(0, 50);
    const timestamp = new Date().toISOString().split('T')[0];
    return `${safeTitle}_${timestamp}.${extension}`;
};

/**
 * Show toast notification with animation
 */
const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

    toast.className = `toast-animation fixed bottom-20 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-[70] text-sm font-medium flex items-center gap-2`;
    toast.innerHTML = `<span class="text-lg">${icon}</span> ${message}`;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 10px)';
        toast.style.transition = 'all 0.3s ease-out';
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 2000);
};

// Export functions to window
window.formatChatAsText = formatChatAsText;
window.formatChatAsMarkdown = formatChatAsMarkdown;
window.copyToClipboard = copyToClipboard;
window.downloadAsFile = downloadAsFile;
window.generateFilename = generateFilename;
window.showToast = showToast;
