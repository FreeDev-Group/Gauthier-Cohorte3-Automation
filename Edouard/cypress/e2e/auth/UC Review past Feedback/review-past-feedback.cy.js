describe('Review Past Feedback Use Case', () => {


  it('RPF-001 - Student can access completed surveys page', () => {

    cy.loginAsStudent()

    cy.visit('https://student.michaelkentburns.com/my-completed-surveys/')

    cy.contains('Surveys You Have Completed')
      .should('be.visible')

  })


  it('RPF-002 - Completed surveys are displayed', () => {

    cy.loginAsStudent()

    cy.visit('https://student.michaelkentburns.com/my-completed-surveys/')

    cy.contains('Arnold Project Testing Survey')
      .should('be.visible')

  })


  it('RPF-003 - Student can open a completed survey', () => {

    cy.loginAsStudent()

    cy.visit('https://student.michaelkentburns.com/my-completed-surveys/')

    cy.contains('Arnold Project Testing Survey')
      .should('be.visible')
      .click()

    cy.contains('Your Answers for: Arnold Project Testing Survey')
      .should('be.visible')

  })


  it('RPF-004 - Student can view previous feedback answers', () => {

    cy.loginAsStudent()

    cy.visit('https://student.michaelkentburns.com/my-completed-surveys/')

    cy.contains('Arnold Project Testing Survey')
      .click()


    cy.contains(
      'What is front-end web development?: Front-end web development is the creation of user interfaces.'
    )
      .should('be.visible')


    cy.contains(
      'Why is working in a team important in web development?: Teamwork improves collaboration.'
    )
      .should('be.visible')


    cy.contains(
      'What are the essential elements of a development platform?: Tools, environment and deployment systems.'
    )
      .should('be.visible')

  })


})