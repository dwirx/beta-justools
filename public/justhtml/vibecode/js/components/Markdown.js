const { useRef, useEffect } = React;

// Markdown Renderer Component
const Markdown = ({ content }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return;

        ref.current.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
        ref.current.querySelectorAll('pre').forEach(pre => {
            if (pre.querySelector('.code-header')) return;
            const code = pre.querySelector('code');
            const header = document.createElement('div');
            header.className = 'code-header';
            header.innerHTML = `<div class="flex gap-1.5"><div class="w-2.5 h-2.5 rounded-full bg-red-500"></div><div class="w-2.5 h-2.5 rounded-full bg-yellow-500"></div><div class="w-2.5 h-2.5 rounded-full bg-green-500"></div></div><button class="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 copy-btn">COPY</button>`;
            header.querySelector('.copy-btn').onclick = () => {
                navigator.clipboard.writeText(code.innerText);
                const btn = header.querySelector('.copy-btn');
                btn.innerText = 'COPIED!';
                setTimeout(() => btn.innerText = 'COPY', 2000);
            };
            pre.insertBefore(header, code);
        });
    }, [content]);

    return <div ref={ref} className="prose prose-invert max-w-none text-sm break-words" dangerouslySetInnerHTML={{ __html: marked.parse(content) }} />;
};

// Export for use in app
window.Markdown = Markdown;
