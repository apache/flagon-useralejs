const { defineConfig } = require('cypress')

module.exports = defineConfig({
  video: false,
  e2e: {
    specPattern: 'journey/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false
  },
})