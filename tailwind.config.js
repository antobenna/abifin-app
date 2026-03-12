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
            colors: {
                primary: '#0052CC',
            },
        },
    },


    darkMode: "class",


    plugins: [forms, heroui({
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
                        // Stati delle pratiche 
                        info: {
                            DEFAULT: "#7DD3FC", // Azzurrino -> Aperta
                            foreground: "#0369A1",
                        },
                        warning: {
                            DEFAULT: "#F97316", // Arancione -> In Lavorazione
                            foreground: "#FFFFFF",
                        },
                        success: {
                            DEFAULT: "#22C55E", // Verde -> Chiusa
                            foreground: "#FFFFFF",
                        },
                        // Gestione Errori e Azioni Distruttive 
                        danger: {
                            DEFAULT: "#EF4444", 
                            foreground: "#FFFFFF",
                        },
                        background: "#FFFFFF", 
                    },
                },
            },
        }),],
};