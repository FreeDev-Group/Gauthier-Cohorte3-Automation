describe("Student - View And Answer Survey Questions", () => {


    before(() => {

        // Ignore WordPress JSON REST API errors
        Cypress.on(
            "uncaught:exception",
            (err) => {

                if(
                    err.message.includes(
                        "The response is not a valid JSON response"
                    )
                ){
                    return false;
                }

            }
        );

    });



    beforeEach(() => {


        // Student login

        cy.loginAsStudent();


    });



    // ======================================================
    // TEST DATA
    // ======================================================


    const SURVEY_URL =
    "https://student.michaelkentburns.com/survey/participant-program-expectations-survey-edo/";





    // ======================================================
    // MQ-020
    // Student login
    // ======================================================


    it("MQ-020 - Student should login successfully", () => {


        cy.url()
            .should(
                "not.include",
                "wp-login.php"
            );


    });







    // ======================================================
    // MQ-021
    // Open All Surveys page
    // ======================================================


    it("MQ-021 - Student should open All Surveys page", () => {


        cy.contains("All Surveys")
            .should("be.visible")
            .click();


        cy.url()
            .should(
                "include",
                "/survey"
            );


    });







    // ======================================================
    // MQ-022
    // Find created survey
    // ======================================================


    it("MQ-022 - Student should find created survey", () => {


        cy.contains(
            "Participant Program Expectations Survey"
        )
        .should("be.visible");


    });







    // ======================================================
    // MQ-023
    // Open survey
    // ======================================================


    it("MQ-023 - Student should open survey", () => {


        cy.visit(
            SURVEY_URL
        );


        cy.url()
            .should(
                "include",
                "participant-program-expectations-survey-edo"
            );


    });








    // ======================================================
    // MQ-024
    // Display questions
    // ======================================================


    it("MQ-024 - Survey should display all questions", () => {


        cy.visit(
            SURVEY_URL
        );


        cy.contains(
            "What are your main expectations from this program?"
        )
        .should("exist");



        cy.contains(
            "Which skill do you want to improve during this program?"
        )
        .should("exist");



        cy.contains(
            "Do you already have programming experience?"
        )
        .should("exist");


    });








    // ======================================================
    // MQ-025
    // Text question
    // ======================================================


    it("MQ-025 - Student should answer Text question", () => {


        cy.visit(
            SURVEY_URL
        );


        cy.get("textarea")
            .first()
            .should("exist")
            .type(
                "I want to improve my programming and data analysis skills."
            );


    });








    // ======================================================
    // MQ-026
    // Multiple Choice
    // ======================================================


    it("MQ-026 - Student should answer Multiple Choice question", () => {


        cy.visit(
            SURVEY_URL
        );


        cy.contains(
            "Frontend Development"
        )
        .should("exist")
        .click();


    });








    // ======================================================
    // MQ-027
    // True False
    // ======================================================


    it("MQ-027 - Student should answer True False question", () => {


        cy.visit(
            SURVEY_URL
        );


        cy.contains(
            "Yes"
        )
        .should("exist")
        .click();


    });








    // ======================================================
    // MQ-028
    // Email
    // ======================================================


    it("MQ-028 - Student should fill email", () => {


        cy.visit(
            SURVEY_URL
        );


        cy.get(
            "input[type='email']"
        )
        .should("exist")
        .type(
            "student@test.com"
        );


    });








    // ======================================================
    // MQ-029
    // Phone
    // ======================================================


    it("MQ-029 - Student should fill phone", () => {


        cy.visit(
            SURVEY_URL
        );


        cy.get(
            "input[type='tel']"
        )
        .should("exist")
        .type(
            "0999999999"
        );


    });








    // ======================================================
    // MQ-030
    // Number
    // ======================================================


    it("MQ-030 - Student should fill number", () => {


        cy.visit(
            SURVEY_URL
        );


        cy.get(
            "input[type='number']"
        )
        .should("exist")
        .type(
            "3"
        );


    });








    // ======================================================
    // MQ-031
    // Date
    // ======================================================


    it("MQ-031 - Student should see Date field", () => {


        cy.visit(
            SURVEY_URL
        );


        cy.get(
            "input[type='date']"
        )
        .should("exist");


    });








    // ======================================================
    // MQ-032
    // File upload
    // ======================================================


    it("MQ-032 - Student should see File Upload field", () => {


        cy.visit(
            SURVEY_URL
        );


        cy.get(
            "input[type='file']"
        )
        .should("exist");


    });








    // ======================================================
    // MQ-033
    // Checkbox
    // ======================================================


    it("MQ-033 - Student should select checkbox", () => {


        cy.visit(
            SURVEY_URL
        );


        cy.get(
            "input[type='checkbox']"
        )
        .first()
        .should("exist")
        .check({
            force:true
        });


    });








    // ======================================================
    // MQ-034
    // Time
    // ======================================================


    it("MQ-034 - Student should fill time", () => {


        cy.visit(
            SURVEY_URL
        );


        cy.get(
            "input[type='time']"
        )
        .should("exist")
        .type(
            "10:30"
        );


    });








    // ======================================================
    // MQ-035
    // Range
    // ======================================================


    it("MQ-035 - Student should interact with range", () => {


        cy.visit(
            SURVEY_URL
        );


        cy.get(
            "input[type='range']"
        )
        .should("exist")
        .invoke(
            "val",
            5
        )
        .trigger(
            "change"
        );


    });








    // ======================================================
    // MQ-036
    // Submit button exists but no submit
    // ======================================================


    it("MQ-036 - Submit button should exist without submitting", () => {


        cy.visit(
            SURVEY_URL
        );


        cy.get(
            "input[type='submit'], button[type='submit']"
        )
        .should("exist");


    });



});