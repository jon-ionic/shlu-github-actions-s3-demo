describe('Confirm header renders', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('#demo-header', 'Demo')
  })
})