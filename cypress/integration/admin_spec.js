describe('Admin behaviour', () => {
    it('Login as admin', () => {
        cy.visit("/")
        cy.get("input[name='email']").type("admin")
        cy.get("input[type='Password']").type("admin")
        cy.get('button').contains("Login").click()
        cy.url().should('contain', 'admin')
    })

    it('List contains admin, student and lecturer', () => {
        cy.get("tr").get('tr>td').contains('student')
        cy.get("tr").get('tr>td').contains('lecturer')
        cy.get("tr").get('tr>td').contains('admin')
    })

    it('Show student edit page', () => {
        cy.get("tr").get('tr>td').eq(0).contains('student').get('tr>td').eq(5).click()

        //todo check if everything is there
    })

    it('Can not edit role', () => {
        // check that I can not change role
        cy.get("input[type='radio']").should('be.disabled')
    })

    it('Can not edit username', () => {
        // check that I can not change my username
        cy.get("input[id='userName']").invoke('attr', 'readonly').should("exist")
    })

    it('Invalid email address will show validation error', () => {
        cy.get("input[name='email']").clear().type("fail")
        cy.get("button").contains("Save Changes").click()
        
        cy.get("input[name='email']").siblings().get("p").invoke('hasClass', 'error-message')

        cy.get("input[name='email']").clear().type("valid@valid.de")
    })

    it('Check birthdate updating correctly', () => {

    })
})