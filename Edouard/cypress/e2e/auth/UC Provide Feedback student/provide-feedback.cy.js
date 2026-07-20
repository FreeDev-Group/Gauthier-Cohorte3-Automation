describe('Provide Feedback Use Case', () => {

    it('PF-001 - Student can access All Surveys', () => {

        cy.loginAsStudent()

        cy.contains('All Surveys')
            .should('be.visible')
            .click()

        cy.url().should('include', '/survey')

    })


it('PF-002 - Student can find the survey', () => {

    cy.loginAsStudent()

    cy.openSurveyByName('Personnal information Edouard team')

    cy.contains('Personnal information Edouard team')
        .should('be.visible')

})


it('PF-003 - Student can open the survey', () => {

    cy.loginAsStudent()

    cy.openSurveyByName('Personnal information Edouard team')

    cy.contains('What is your name ?')
        .should('be.visible')

})


it('PF-004 - Survey questions are displayed correctly', () => {

    cy.loginAsStudent()

    cy.openSurveyByName('Personnal information Edouard team')

    cy.contains('What is your name ?')
        .should('be.visible')

    cy.contains('Whicth city is your origin')
        .should('be.visible')

    cy.contains('Total questions: 2')
        .should('be.visible')

})


it('PF-005 - Student can answer the text question', () => {

    cy.loginAsStudent()

    cy.openSurveyByName('Personnal information Edouard team')

    cy.get('input[type="text"], textarea')
        .first()
        .clear()
        .type('Bag3 Student')

    cy.get('input[type="text"], textarea')
        .first()
        .should('have.value', 'Bag3 Student')

})


it('PF-006 - Student can answer the multiple choice question', () => {

    cy.loginAsStudent()

    cy.openSurveyByName('Personnal information Edouard team')

    cy.contains('Bukavu')
        .click()

    cy.contains('Bukavu')
        .parent()
        .find('input')
        .should('be.checked')

})

})