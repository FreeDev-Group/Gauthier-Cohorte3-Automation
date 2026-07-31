describe("Instructor - Create Survey", () => {


before(() => {

    // Ignore WordPress JSON errors that do not affect the test execution
    Cypress.on(
        "uncaught:exception",
        (err) => {

            if(err.message.includes(
              "The response is not a valid JSON response"
            )){
                return false;
            }

        }
    );

});


beforeEach(() => {

    // Login as instructor before each test
    cy.loginAsInstructor();

    // Open survey management section
    cy.openSurveyManagement();

});


// ==================================================
// CS-001
// ==================================================

it("CS-001 - should login and access dashboard",()=>{

    cy.url()
        .should("include","/wp-admin/");

});


// ==================================================
// CS-002
// ==================================================

it("CS-002 - should open survey management",()=>{

    cy.contains("Surveys")
        .should("be.visible");

});


// ==================================================
// CS-003
// ==================================================

it("CS-003 - should open Add New Survey page",()=>{

    cy.openCreateSurvey();

    cy.get("#title")
        .should("be.visible");

});


// ==================================================
// CS-004
// ==================================================

it("CS-004 - should handle empty survey submission",()=>{

    cy.openCreateSurvey();

    cy.get("#publish")
        .click();

    cy.url()
        .should("include","post.php");

});


// ==================================================
// CS-005
// ==================================================

it("CS-005 - should create a new survey successfully", () => {


    // Fixed survey name used for future question creation tests
    const surveyTitle =
        "Participant Program Expectations Survey - Edo";


    const surveyDescription =
        "This survey aims to collect participants' expectations, goals, and feedback about the program. The collected information will help instructors better understand participants' needs and improve the learning experience.";


    cy.openCreateSurvey();


    // Fill survey title
    cy.get("#title")
        .should("be.visible")
        .clear()
        .type(surveyTitle);


    // Fill survey description
    cy.get("#content")
        .should("be.visible")
        .type(surveyDescription);


    // Wait WordPress processing
    cy.wait(5000);


    // Wait until Publish becomes active
    cy.get("#publish", { timeout: 30000 })
        .should("be.visible")
        .and("not.have.class", "disabled");


    // Click Publish
    cy.get("#publish")
        .click();


    // Wait redirect
    cy.url({ timeout: 30000 })
        .should("include", "post.php");


    // Verify success message
    cy.contains("Post published")
        .should("be.visible");

});

});