describe('Provide Feedback Use Case', () => {

  it('PF-001 - Student can access the survey list', () => {

    cy.loginAsStudent()

    cy.contains('All Surveys')
      .should('be.visible')
      .click()

    cy.url().should('include', '/survey')

    cy.contains('Satisfaction Survey Jonathan')
      .should('be.visible')

  })


  it('PF-002 - Student can view available surveys', () => {

    cy.loginAsStudent()

    cy.contains('All Surveys').click()

    cy.contains('Satisfaction Survey Jonathan')
      .should('be.visible')

    cy.contains('Satisfaction Survey Jonathan')
      .should('be.visible')

  })


  it('PF-003 - Student can open a survey', () => {

    cy.loginAsStudent()

    cy.contains('All Surveys').click()

    cy.contains('a', 'Satisfaction Survey Jonathan')
      .should('be.visible')
      .click()

    cy.contains('Your Gender Identity')
      .should('be.visible')

  })


  it('PF-004 - Survey questions are displayed correctly', () => {

    cy.loginAsStudent()

    cy.contains('All Surveys').click()

    cy.contains('a', 'Satisfaction Survey Jonathan')
      .click()

    cy.contains('Your Gender Identity')
      .should('be.visible')

    cy.contains('Religion')
      .should('be.visible')

    cy.contains('Learning Experience')
      .should('be.visible')

    cy.contains('Total questions: 3')
      .should('be.visible')

  })


  it('PF-005 - Student can answer all survey questions', () => {

  cy.loginAsStudent()

  cy.contains('All Surveys').click()

  cy.contains('a', 'Satisfaction Survey Jonathan')
    .click()

  // Question 1
  cy.contains('Yes').click()

  // Question 2
  cy.contains('True').click()

  // Question 3 - TEXT FIELD FIX
  cy.get('input[type="text"], textarea, [contenteditable="true"]')
    .last()
    .should('be.visible')
    .clear()
    .type('The learning experience was very good.')

  // ASSERTION CORRECTE
  cy.get('input[type="text"], textarea, [contenteditable="true"]')
    .last()
    .should('have.value', 'The learning experience was very good.')

  })

  describe('Provide Feedback Use Case', () => {

  beforeEach(() => {

    cy.loginAsStudent()

    cy.contains('All Surveys').click()

    cy.contains('a', 'Arnold Project Testing Survey')
      .should('be.visible')
      .click()

    cy.contains('What is front-end web development?')
      .should('be.visible')

  })


  it('PF-006 - Student can answer first question', () => {

    cy.contains('What is front-end web development?')
      .parent()
      .within(() => {
        cy.get('input, textarea, [contenteditable="true"]')
          .type('Front-end web development is the creation of user interfaces using HTML, CSS and JavaScript.')
      })

  })


  it('PF-007 - Student can answer second question', () => {

    cy.contains('Why is working in a team important in web development?')
      .parent()
      .within(() => {
        cy.get('input, textarea, [contenteditable="true"]')
          .type('Teamwork improves code quality, collaboration and problem solving.')
      })

  })



  it('PF-008 - Student can answer third question', () => {

    cy.contains('What are the essential elements of a development platform?')
      .parent()
      .within(() => {
        cy.get('input, textarea, [contenteditable="true"]')
          .type('Code editor, version control, build tools and deployment environment.')
      })

  })


  it('PF-009 - Student can submit survey successfully', () => {

    cy.contains('What is front-end web development?')
      .parent()
      .within(() => {
        cy.get('input, textarea, [contenteditable="true"]')
          .type('Front-end web development is the creation of user interfaces.')
      })

    cy.contains('Why is working in a team important in web development?')
      .parent()
      .within(() => {
        cy.get('input, textarea, [contenteditable="true"]')
          .type('Teamwork improves collaboration.')
      })

    cy.contains('What are the essential elements of a development platform?')
      .parent()
      .within(() => {
        cy.get('input, textarea, [contenteditable="true"]')
          .type('Tools, environment and deployment systems.')
      })

    cy.contains('Submit').click()

  })


  it('PF-010 - Confirmation message is displayed', () => {

    cy.contains('Submit').click()

    cy.contains('Merci, vos réponses ont bien été enregistrées !')
      .should('be.visible')

  })


  it('PF-011 - User returns to survey list after submission', () => {

    cy.contains('Submit').click()

    cy.contains('All Surveys')
      .should('be.visible')

  })

})

})