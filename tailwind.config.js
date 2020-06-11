module.exports = {
    purge: [
        './src/**/*.html',
        './src/**/*.vue',
    ],
  theme: {
    extend: {},
  },
  variants: {
    opacity: ['responsive', 'hover', 'focus', 'disabled'],
    backgroundColor: ['responsive', 'hover', 'focus', 'disabled'],
    cursor: ['responsive', 'disabled']
  },
  plugins: [
      require('@tailwindcss/custom-forms')
  ]
}