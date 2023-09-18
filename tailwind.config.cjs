/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
		  colors: {
			main: "#F5F5F5",
			label: "363636",
			"text-input": "#CBCBCB",
			button: "#158370",
		  },
		},
	  },
	plugins: [],
}
