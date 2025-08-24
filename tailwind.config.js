import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
        
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                playfair: ["Alex Brush", 'cursive'],
            },
            colors: {
                   primary: {
                    100: '#9A4CFE', // Lightest shade
                    200: '#7F3DD3',
                    300: '#6530B8',
                    400: '#4A23A0',
                    500: '#5409DA', // Default color
                    600: '#4608C2',
                    700: '#38069A',
                    800: '#2A0473',
                    900: '#1C024C', // Darkest shade
                },
                secondary: {
                    100: '#A1A9FF', 
                    200: '#7F8EFF', 
                    300: '#5E73FF', 
                    400: '#4E71FF', // Default color
                    500: '#4164E6',
                    600: '#3651CC',
                    700: '#2A3E99',
                    800: '#1F2B66',
                    900: '#151A33',
                },
                light: {
                    100: '#B2E3FF',
                    200: '#9DD9FF',
                    300: '#8ACFFF',
                    400: '#76C5FF',
                    500: '#8DD8FF', // Default color
                    600: '#78C4FF',
                    700: '#64A9FF',
                    800: '#4F8DFF',
                    900: '#3A72FF',
                },
                yellow: {
                    100: '#FFF5A1',
                    200: '#FFF27E',
                    300: '#FFEF5A',
                    400: '#FFEC37',
                    500: '#FFF100', // Default color
                    600: '#E6D800',
                    700: '#CCB000',
                    800: '#B29900',
                    900: '#998000',
                },
            },
            keyframes: {
                "infinite-scroll": {
                    "0%": {
                        transform: "translateX(0)",
                    },
                    "100%": {
                        transform: "translateX(calc(-50% - 20px))",
                    },
                }
            },
            animation: {
                "infinite-scroll": "infinite-scroll 5s linear infinite",
            }
        },
       
    },
    

    plugins: [
        forms,
        require('@tailwindcss/line-clamp')
    ],
};
