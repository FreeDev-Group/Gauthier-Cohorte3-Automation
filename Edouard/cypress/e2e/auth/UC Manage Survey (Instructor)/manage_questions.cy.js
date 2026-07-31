describe("Instructor - Manage Questions", () => {


    // ==================================================
    // IGNORE WORDPRESS JSON EXCEPTION
    // ==================================================

    before(() => {

        Cypress.on(
            "uncaught:exception",
            (err) => {

                if (
                    err.message.includes(
                        "The response is not a valid JSON response"
                    )
                ) {
                    return false;
                }

            }
        );

    });



    // ==================================================
    // COMMON SETUP
    // ==================================================

    beforeEach(() => {

        // Login as Instructor
        cy.loginAsInstructor();


        // Open Questions Management Page
        cy.openQuestionManagement();

    });



    // ==================================================
    // TEST DATA
    // ==================================================

    const SURVEY_NAME =
        "Participant Program Expectations Survey - Edo";





    // ==================================================
    // HELPER : CREATE QUESTION
    // ==================================================

    function createQuestion(title, type) {


        // Open create question page
        cy.openCreateQuestion();



        // Fill question title
        cy.get("#title")
            .should("be.visible")
            .clear()
            .type(title);



        // Associate question with survey
        cy.selectSurvey(
            SURVEY_NAME
        );



        // Select question type
        cy.selectQuestionType(
            type
        );



        // Publish question
        cy.get("#publish")
            .should("be.visible")
            .and(
                "not.have.class",
                "disabled"
            )
            .click();



        // Verify creation
        cy.url({
            timeout:30000
        })
        .should(
            "include",
            "post.php"
        );

    }







    // ==================================================
    // MQ-001
    // Open Questions Management Page
    // ==================================================

    it(
        "MQ-001 - should open Questions management page",
        () => {


            cy.url()
                .should(
                    "include",
                    "post_type=question"
                );


        }
    );








    // ==================================================
    // MQ-002
    // Open Add New Question Page
    // ==================================================

    it(
        "MQ-002 - should open Add New Question page",
        () => {


            cy.openCreateQuestion();


            cy.get("#title")
                .should("exist");


        }
    );








    // ==================================================
    // MQ-003
    // Display Question Fields
    // ==================================================

    it(
        "MQ-003 - should display question fields",
        () => {


            cy.openCreateQuestion();



            // Title field
            cy.get("#title")
                .should("exist");



            // Associated Survey field
            cy.get("#question_parent_survey")
                .should("exist");



            // Question Type field
            cy.get("#question_type")
                .should("exist");



            // Answer Options should exist
            // (mainly used for multiple choice)
            cy.contains(
                "Answer Options"
            )
            .should("exist");


        }
    );










    // ==================================================
    // MQ-004
    // Create Text Question
    // ==================================================

    it(
        "MQ-004 - should create Text question successfully",
        () => {


            createQuestion(
                "What are your main expectations from this program?",
                "text"
            );


        }
    );










    // ==================================================
    // MQ-005
    // Create Multiple Choice Question
    // ==================================================
it("MQ-005 - should create Multiple Choice question successfully",()=>{


    cy.openCreateQuestion();


    cy.get("#title")
        .clear()
        .type(
            "Which skill do you want to improve during this program?"
        );



    // Select survey
    cy.selectSurvey(
        SURVEY_NAME
    );



    // Select question type
    cy.get("#question_type")
        .select("multiple_choice")
        .should(
            "have.value",
            "multiple_choice"
        );



    // Answer Options only for Multiple Choice
    cy.get("textarea#answer_options")
        .should("be.visible")
        .clear()
        .invoke(
            "val",
`Frontend Development
Backend Development
Data Analysis
UI/UX Design`
        )
        .trigger("input")
        .trigger("change");



    // Wait until WordPress enables Publish
    cy.get("#publish")
        .should("be.visible")
        .should(
            "not.have.class",
            "disabled"
        );



    cy.get("#publish")
        .click();



    cy.url({
        timeout:30000
    })
    .should(
        "match",
        /post\.php|edit\.php/
    );


});








    // ==================================================
    // MQ-006
    // Create True False Question
    // ==================================================

    it(
        "MQ-006 - should create True False question successfully",
        () => {


            createQuestion(
                "Do you already have programming experience?",
                "true_false"
            );


        }
    );










    // ==================================================
    // MQ-007
    // Create Email Question
    // ==================================================

    it(
        "MQ-007 - should create Email question successfully",
        () => {


            createQuestion(
                "Enter your email address",
                "email"
            );


        }
    );










    // ==================================================
    // MQ-008
    // Create Phone Question
    // ==================================================

    it(
        "MQ-008 - should create Phone question successfully",
        () => {


            createQuestion(
                "Enter your phone number",
                "phone"
            );


        }
    );










    // ==================================================
    // MQ-009
    // Create Text Array Question
    // ==================================================

    it(
        "MQ-009 - should create Text Array question successfully",
        () => {


            createQuestion(
                "List your preferred technologies",
                "text_array"
            );


        }
    );










    // ==================================================
// MQ-010
// CREATE RADIO BUTTON QUESTION WITH OPTIONS
// ==================================================

it(
"MQ-010 - should create Radio Button question with options",
()=>{


    cy.openCreateQuestion();


    cy.get("#title")
        .clear()
        .type(
            "Choose your learning preference"
        );


    cy.selectSurvey(
        SURVEY_NAME
    );


    cy.get("#question_type")
        .select("radio_button")
        .should(
            "have.value",
            "radio_button"
        );


    cy.get("#answer_options")
        .should("be.visible")
        .clear()
        .type(
`Online training
Classroom training
Self learning`
        );


    cy.get("#publish")
        .should("not.have.class","disabled")
        .click();


    cy.url({
        timeout:30000
    })
    .should(
        "match",
        /post\.php|edit\.php/
    );


});

    // ==================================================
// MQ-011
// CREATE DATE QUESTION
// ==================================================

it("MQ-011 - should create Date question successfully",()=>{


    createQuestion(
        "Select your birth date",
        "date"
    );


});




// ==================================================
// MQ-012
// CREATE NUMBER QUESTION
// ==================================================

it("MQ-012 - should create Number question successfully",()=>{


    createQuestion(
        "How many years of experience do you have?",
        "number"
    );


});




// ==================================================
// MQ-013
// CREATE FILE UPLOAD QUESTION
// ==================================================

it("MQ-013 - should create File Upload question successfully",()=>{


    createQuestion(
        "Upload your document",
        "file_upload"
    );


});




// ==================================================
// MQ-014
// CREATE CHECKBOX QUESTION WITH OPTIONS
// ==================================================

it(
"MQ-014 - should create Checkbox question with options",
()=>{


    cy.openCreateQuestion();


    cy.get("#title")
        .clear()
        .type(
            "Select your preferred tools"
        );


    cy.selectSurvey(
        SURVEY_NAME
    );


    cy.get("#question_type")
        .select("checkbox")
        .should(
            "have.value",
            "checkbox"
        );


    cy.get("#answer_options")
        .should("be.visible")
        .clear()
        .type(
`HTML
CSS
JavaScript
Python`
        );


    cy.get("#publish")
        .should("not.have.class","disabled")
        .click();


    cy.url({
        timeout:30000
    })
    .should(
        "match",
        /post\.php|edit\.php/
    );


});



// ==================================================
// MQ-015
// CREATE TIME QUESTION
// ==================================================

it("MQ-015 - should create Time question successfully",()=>{


    createQuestion(
        "Choose your preferred meeting time",
        "time"
    );


});




// ==================================================
// MQ-016
// CREATE RANGE QUESTION
// ==================================================

it("MQ-016 - should create Range question successfully",()=>{


    createQuestion(
        "Rate your confidence level",
        "range"
    );


});




// ==================================================
// MQ-017
// DISPLAY CREATED QUESTION IN LIST
// ==================================================

it("MQ-017 - should display created question in list",()=>{


    const question =
    "What are your main expectations from this program?";


    cy.contains(question)
        .should("be.visible");


});




// ==================================================
// MQ-018
// Edit existing question
// ==================================================

it("MQ-018 - should edit existing question", () => {


    const oldQuestion =
    "What are your main expectations from this program?";


    const updatedQuestion =
    "Updated program expectations question";


    // Find existing question
    cy.contains(oldQuestion)
        .parents("tr")
        .within(() => {


            cy.contains("Edit")
                .click({
                    force:true
                });


        });



    // Verify edit page
    cy.url({
        timeout:30000
    })
    .should(
        "include",
        "post.php"
    );



    // Update title
    cy.get("#title")
        .should("be.visible")
        .clear()
        .type(updatedQuestion);



    // Save changes
    cy.get("#publish")
        .should("be.visible")
        .and(
            "not.have.class",
            "disabled"
        )
        .click();



    // Wait page reload
    cy.url({
        timeout:30000
    })
    .should(
        "include",
        "post.php"
    );



    // Verify saved value inside title field
    cy.get("#title")
        .should(
            "have.value",
            updatedQuestion
        );


});



// ==================================================
// MQ-019
// MOVE QUESTION TO TRASH
// ==================================================

it("MQ-019 - should move question to trash",()=>{


    const question =
    "Updated program expectations question";



    cy.contains(question)
        .parents("tr")
        .within(()=>{


            cy.contains("Trash")
                .click({
                    force:true
                });


        });



    cy.url({
        timeout:30000
    })
    .should(
        "include",
        "post_type=question"
    );



    cy.contains(
        "moved to the Trash"
    )
    .should("be.visible");


});

});