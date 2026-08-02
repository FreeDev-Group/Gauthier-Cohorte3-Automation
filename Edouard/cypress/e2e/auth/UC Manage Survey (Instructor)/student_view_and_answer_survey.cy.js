describe("Student - View And Answer Survey Questions", () => {


    // ======================================================
    // IGNORE WORDPRESS JSON EXCEPTION
    // ======================================================

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



    // ======================================================
    // COMMON SETUP
    // ======================================================

    beforeEach(() => {

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

    it(
        "MQ-020 - Student should login successfully",
        () => {


            cy.url()
                .should(
                    "not.include",
                    "wp-login.php"
                );


        }
    );






    // ======================================================
    // MQ-021
    // Open survey
    // ======================================================

    it(
        "MQ-021 - Student should open survey",
        () => {


            cy.visit(
                SURVEY_URL
            );


            cy.url()
                .should(
                    "include",
                    "participant-program-expectations-survey-edo"
                );


        }
    );






    // ======================================================
    // MQ-022
    // Display all questions
    // ======================================================

    it(
        "MQ-022 - Survey should display all 12 questions",
        () => {


            cy.visit(
                SURVEY_URL
            );


            const questions = [

                "Enter your email address",

                "Enter your phone number",

                "List your preferred technologies",

                "Choose your learning preference",

                "Select your birth date",

                "How many years of experience do you have?",

                "Upload your document",

                "Select your preferred tools",

                "Choose your preferred meeting time",

                "Rate your confidence level",

                "Which skill do you want to improve during this program?",

                "Do you already have programming experience?"

            ];



            questions.forEach(
                (question)=>{


                    cy.contains(
                        question
                    )
                    .should(
                        "be.visible"
                    );


                }
            );


        }
    );







    // ======================================================
    // MQ-023
    // Email question
    // ======================================================

    it(
        "MQ-023 - Student should fill email question",
        () => {


            cy.visit(
                SURVEY_URL
            );


            cy.get(
                "input[type='email']"
            )
            .should(
                "exist"
            )
            .type(
                "student@test.com"
            );


        }
    );







    // ======================================================
    // MQ-024
    // Phone question
    // ======================================================

    it(
        "MQ-024 - Student should fill phone question",
        () => {


            cy.visit(
                SURVEY_URL
            );


            cy.get(
                "input[type='tel']"
            )
            .should(
                "exist"
            )
            .type(
                "0999999999"
            );


        }
    );







    // ======================================================
    // MQ-025
    // Text Array question
    // ======================================================

it(
    "MQ-025 - Student should answer Text Array question",
    () => {


        cy.visit(
            SURVEY_URL
        );


        cy.contains(
            "List your preferred technologies"
        )
        .should(
            "be.visible"
        );


        cy.get(
            "textarea"
        )
        .should(
            "exist"
        )
        .first()
        .type(
`HTML
CSS
JavaScript`
        );


    }
);




    // ======================================================
    // MQ-026
    // Radio Button question
    // ======================================================

    it(
        "MQ-026 - Student should answer Radio Button question",
        () => {


            cy.visit(
                SURVEY_URL
            );


            cy.contains(
                "Online training"
            )
            .should(
                "be.visible"
            )
            .click({
                force:true
            });


        }
    );







    // ======================================================
    // MQ-027
    // Date question
    // ======================================================

    it(
        "MQ-027 - Student should see Date field",
        () => {


            cy.visit(
                SURVEY_URL
            );


            cy.get(
                "input[type='date'], input[type='text']"
            )
            .should(
                "exist"
            );


        }
    );







    // ======================================================
    // MQ-028
    // Number question
    // ======================================================

    it(
        "MQ-028 - Student should fill Number question",
        () => {


            cy.visit(
                SURVEY_URL
            );


            cy.get(
                "input[type='number']"
            )
            .should(
                "exist"
            )
            .type(
                "3"
            );


        }
    );







    // ======================================================
    // MQ-029
    // File upload
    // ======================================================

    it(
        "MQ-029 - Student should see File Upload field",
        () => {


            cy.visit(
                SURVEY_URL
            );


            cy.get(
                "input[type='file']"
            )
            .should(
                "exist"
            );


        }
    );







    // ======================================================
    // MQ-030
    // Checkbox question
    // ======================================================

    it(
        "MQ-030 - Student should select Checkbox option",
        () => {


            cy.visit(
                SURVEY_URL
            );


            cy.contains(
                "HTML"
            )
            .should(
                "be.visible"
            )
            .click({
                force:true
            });


        }
    );







    // ======================================================
    // MQ-031
    // Time question
    // ======================================================

    it(
        "MQ-031 - Student should fill Time question",
        () => {


            cy.visit(
                SURVEY_URL
            );


            cy.get(
                "input[type='time']"
            )
            .should(
                "exist"
            )
            .type(
                "10:30"
            );


        }
    );







    // ======================================================
    // MQ-032
    // Range question
    // ======================================================

    it(
        "MQ-032 - Student should interact with Range question",
        () => {


            cy.visit(
                SURVEY_URL
            );


            cy.get(
                "input[type='range']"
            )
            .should(
                "exist"
            )
            .invoke(
                "val",
                5
            )
            .trigger(
                "change"
            );


        }
    );







    // ======================================================
    // MQ-033
    // Multiple Choice question
    // ======================================================

    it(
        "MQ-033 - Student should answer Multiple Choice question",
        () => {


            cy.visit(
                SURVEY_URL
            );


            cy.contains(
                "Frontend Development"
            )
            .should(
                "be.visible"
            )
            .click({
                force:true
            });


        }
    );







    // ======================================================
    // MQ-034
    // True False question
    // ======================================================

    it(
        "MQ-034 - Student should answer True False question",
        () => {


            cy.visit(
                SURVEY_URL
            );


            cy.contains(
                "True"
            )
            .should(
                "be.visible"
            )
            .click({
                force:true
            });


        }
    );







    // ======================================================
    // MQ-035
    // Submit button exists
    // ======================================================

    it(
        "MQ-035 - Submit button should exist without submitting",
        () => {


            cy.visit(
                SURVEY_URL
            );


            cy.get(
                "input[type='submit'], button[type='submit']"
            )
            .should(
                "exist"
            );


        }
    );



    // ======================================================
// MQ-036
// COMPLETE SURVEY WITHOUT SUBMIT
// ======================================================

it("MQ-036 - Student should answer all survey questions without submitting", () => {


    cy.visit(SURVEY_URL);



    // Question 1 - Email
    cy.get("input[type='email']")
        .should("exist")
        .type("student@test.com");



    // Question 2 - Phone
    cy.get("input[type='tel']")
        .should("exist")
        .type("0999999999");



    // Question 3 - Text Array
    cy.get("textarea")
        .should("exist")
        .first()
        .type(
`JavaScript
Python
React`
        );



    // Question 4 - Radio Button
    cy.contains(
        "Online training"
    )
    .should("exist")
    .click();



    // Question 5 - Date
    cy.get("input[type='date']")
        .should("exist")
        .type("2000-01-15");



    // Question 6 - Number
    cy.get("input[type='number']")
        .should("exist")
        .type("3");



    // Question 7 - File Upload
    cy.get("input[type='file']")
        .should("exist");



    // Question 8 - Checkbox
    cy.contains("HTML")
        .should("exist")
        .click();



    // Question 9 - Time
    cy.get("input[type='time']")
        .should("exist")
        .type("10:30");



    // Question 10 - Range
    cy.get("input[type='range']")
        .should("exist")
        .invoke("val", 5)
        .trigger("change");



    // Question 11 - Multiple Choice
    cy.contains(
        "Frontend Development"
    )
    .should("exist")
    .click();



    // Question 12 - True False
    cy.contains(
        "True"
    )
    .should("exist")
    .click();



    // Verify submit exists but do not submit
    cy.get(
        "input[type='submit'], button[type='submit']"
    )
    .should("exist");


});
});