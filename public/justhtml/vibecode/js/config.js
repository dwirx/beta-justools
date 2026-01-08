// Configuration & Data
const MODEL_REGISTRY = {
    'claude-sonnet-4-5': { name: 'Claude Sonnet 4.5', in: 3.00, out: 15.00, color: 'text-blue-400' },
    'claude-sonnet-4-5-thinking': { name: 'Claude Sonnet 4.5 (Thinking)', in: 3.00, out: 15.00, color: 'text-purple-400' },
    'claude-opus-4-5-thinking': { name: 'Claude Opus 4.5 (Thinking)', in: 15.00, out: 75.00, color: 'text-red-400' },
    'gemini-3-pro-preview': { name: 'Gemini 3 Pro', in: 1.25, out: 5.00, color: 'text-blue-400' },
    'gemini-3-flash-preview': { name: 'Gemini 3 Flash', in: 0.075, out: 0.30, color: 'text-orange-400' },
    'gemini-2.5-flash': { name: 'Gemini 2.5 Flash', in: 0.075, out: 0.30, color: 'text-green-400' },
    'unknown': { name: 'Unknown Model', in: 0, out: 0, color: 'text-gray-400' }
};

// Default API Base URL
const DEFAULT_API_BASE_URL = 'https://api.vibe-dev.web.id/v1';

// Get API Base URL from localStorage or use default
const getApiBaseUrl = () => {
    return localStorage.getItem('vibe_api_base_url') || DEFAULT_API_BASE_URL;
};

// Set API Base URL
const setApiBaseUrl = (url) => {
    localStorage.setItem('vibe_api_base_url', url);
};

// Calculate cost based on model and tokens
const calculateCost = (modelId, promptT, compT) => {
    const m = MODEL_REGISTRY[modelId] || MODEL_REGISTRY['unknown'];
    const inCost = (promptT / 1_000_000) * m.in;
    const outCost = (compT / 1_000_000) * m.out;
    return { in: inCost, out: outCost, total: inCost + outCost };
};

// Theme Management
const getTheme = () => {
    return localStorage.getItem('vibe_theme') || 'dark';
};

const setTheme = (theme) => {
    localStorage.setItem('vibe_theme', theme);
    document.documentElement.className = theme;
};

const toggleTheme = () => {
    const current = getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    return next;
};

// Initialize theme on load
const initTheme = () => {
    const theme = getTheme();
    document.documentElement.className = theme;
};

// Export for use in other modules
window.MODEL_REGISTRY = MODEL_REGISTRY;
window.DEFAULT_API_BASE_URL = DEFAULT_API_BASE_URL;
window.getApiBaseUrl = getApiBaseUrl;
window.setApiBaseUrl = setApiBaseUrl;
window.calculateCost = calculateCost;
window.getTheme = getTheme;
window.setTheme = setTheme;
window.toggleTheme = toggleTheme;
window.initTheme = initTheme;

// Auto init theme
initTheme();
