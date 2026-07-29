import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
   theme: {
	   lineHeight: {
		   none: '1.25', // 1 * 1.25
		   tight: '1.375', // 1.1 * 1.25
		   snug: '1.5', // 1.2 * 1.25
		   normal: '1.75', // 1.4 * 1.25
		   relaxed: '2', // 1.6 * 1.25
		   loose: '2.25', // 2 * 1.25
		   '3': '.9375rem', // 0.75rem * 1.25
		   '4': '1.25rem', // 1rem * 1.25
		   '5': '1.5rem', // 1.25rem * 1.25
		   '6': '1.75rem', // 1.5rem * 1.25
		   '7': '2.25rem', // 1.75rem * 1.25
		   '8': '2.5rem', // 2rem * 1.25
		   '9': '2.75rem', // 2.25rem * 1.25
		   '10': '3.125rem', // 2.5rem * 1.25
		   '5xl': '2', // text-5xl
	   },
	   extend: {
		   fontFamily: {
			   sans: ['Open Sans', 'Arial', 'Helvetica', 'sans-serif'],
			   googletitre: ['"Nunito"', 'sans-serif'],
			   googletexte: ['"Inter"', 'sans-serif'],
		   },
		fontWeight: {
			light: '300',
			normal: '400',
			regular: '500',
			medium: '600',
			semibold: '700',
			bold: '800',
			extrabold: '900'
		},
  		colors: {
			darkblue: '#020F59',	
			mediumblue: '#021373',
			regularblue: '#1F54BF',
			lightblue: '#719ED9',
			extralightblue: '#D0DCF2',
			white: '#FFFFFF',
			orange: '#F29F05',
			coral: '#FF6B6B',
			lightyellow: '#F2E57E',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
			
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
