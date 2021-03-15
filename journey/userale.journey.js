describe('Userale logging', () => {
    beforeEach(() => {
        cy.intercept('POST', 'http://localhost:8000/').as('backend')
    })

    it('sends a page load log', () => {
        cy.visit('http://localhost:8000')
        cy.wait('@backend').then(xhr => {
            const body = xhr.request.body
            const pageLoadLog = body[0]
            expect(pageLoadLog['pageLoadTime']).to.be.greaterThan(0)
            expect(pageLoadLog).to.contain({
                logType: 'raw',
                type: 'load'
            })
        })
    });
});