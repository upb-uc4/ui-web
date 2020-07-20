describe('Login behaviour', () => {
	it('Login as admin', () => {
		cy.visit("/")
		cy.get("input[name='email']").type("admin")
		cy.get("input[type='Password']").type("admin")
		cy.get('button').contains("Login").click()
		cy.url().should('contain', 'admin')
	})

	it('Log out', () => {
		cy.url().should('contain', 'admin')
		cy.get('li').contains("logOut").click()
	})
})