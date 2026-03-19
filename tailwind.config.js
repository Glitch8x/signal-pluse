/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'mtn-yellow': '#ffcc00',
                'airtel-red': '#ff0000',
                'glo-green': '#009933',
                'nine-mobile-green': '#adc808',
                'signal-strong': '#00e676',
                'signal-good': '#c6ff00',
                'signal-fair': '#ffea00',
                'signal-weak': '#ff3d00',
                'glass-bg': 'rgba(255, 255, 255, 0.03)',
                'glass-border': 'rgba(255, 255, 255, 0.08)',
            },
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
            },
            animation: {
                'pulse-glow': 'pulseGlow 2s infinite',
                'drift1': 'drift1 20s infinite alternate ease-in-out',
                'drift2': 'drift2 25s infinite alternate ease-in-out',
            },
            keyframes: {
                pulseGlow: {
                    '0%': { boxShadow: '0 0 0 0 rgba(0, 230, 118, 0.7)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(0, 230, 118, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(0, 230, 118, 0)' },
                },
                drift1: {
                    '0%': { transform: 'translate(0, 0) scale(1)' },
                    '100%': { transform: 'translate(10%, 10%) scale(1.2)' },
                },
                drift2: {
                    '0%': { transform: 'translate(0, 0) scale(1.2)' },
                    '100%': { transform: 'translate(-10%, -10%) scale(1)' },
                }
            }
        },
    },
    plugins: [],
}
