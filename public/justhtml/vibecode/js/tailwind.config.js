tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Dark mode colors
                dark: {
                    bg: '#09090b',
                    surface: '#121215',
                    border: '#27272a',
                    active: '#27272a'
                },
                // Light mode colors (warm tones)
                light: {
                    bg: '#faf8f5',
                    surface: '#fffefa',
                    border: '#e8e4dd',
                    active: '#f5f2ed'
                },
                // Brand colors
                brand: {
                    primary: '#3b82f6',
                    secondary: '#8b5cf6',
                    success: '#10b981',
                    warning: '#f59e0b',
                    danger: '#ef4444'
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-in': 'slideIn 0.3s ease-out'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 }
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 }
                },
                slideIn: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' }
                }
            }
        }
    }
};
