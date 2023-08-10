const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    specPattern: 'journey/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false
  },
})