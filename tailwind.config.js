import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            
            borderRadius: {
                'sm': '8px',
                'md': '14px',
                'lg': '20px',
            }
        },
    },

    darkMode: "class",

    plugins: [
        forms, 
        heroui({
            
            layout: {
                radius: {
                    small:  "8px",
                    medium: "14px",
                    large:  "20px",
                },
            },
            themes: {
                light: {
                    colors: {
                        primary: {
                            DEFAULT: "#0052CC",
                            foreground: "#FFFFFF",
                        },
                        secondary: {
                            DEFAULT: "#9CA3AF", 
                            foreground: "#FFFFFF",
                        },
                        info: {
                            DEFAULT: "#7DD3FC",
                            foreground: "#0369A1",
                        },
                        warning: {
                            DEFAULT: "#F97316",
                            foreground: "#FFFFFF",
                        },
                        success: {
                            DEFAULT: "#22C55E",
                            foreground: "#FFFFFF",
                        },
                        danger: {
                            DEFAULT: "#EF4444", 
                            foreground: "#FFFFFF",
                        },
                        background: "#FFFFFF", 
                    },
                },
            },
        }),
    ],
};