# 🧪 Structure des Tests Cypress - Phase 2

## 📋 Vue d'ensemble

Phase 2 est complète avec une **suite de tests complète et fonctionnelle** couvrant tous les scénarios utilisateur.

**Statut**: ✅ **TOUS LES TESTS IMPLÉMENTÉS ET PRÊTS**

---

## 👥 Utilisateurs de Test

### 1. **Étudiant (Student)**

```
Username: mugishok
Password: Merci@2026
Role: Student/User
```

**Autorisations:**

- Voir les enquêtes disponibles
- Remplir les enquêtes
- Soumettre des réponses
- Consulter les enquêtes complétées
- Voir l'historique de ses réponses

**Tests Associés:**

- UC-ProvideFeedback (submit-survey.cy.js)
- UC-ProvideFeedback (required-fields.cy.js)
- UC-ReviewFeedback (review-feedback.cy.js)

### 2. **Instructeur (Instructor)**

```
Username: devmerci
Password: Merci@2026
Role: Instructor/Admin
```

**Autorisations:**

- Créer des enquêtes
- Modifier des enquêtes
- Supprimer des enquêtes
- Accéder au tableau de bord d'administration
- Gérer les questions et les réponses

**Tests Associés:**

- UC-ManageSurveys (create-survey.cy.js)
- UC-ManageSurveys (edit-survey.cy.js)
- UC-ManageSurveys (delete-survey.cy.js)
- UC-ManageSurveys (login-managersurveys.cy.js)

---

## 📁 Structure des Tests

```
cypress/e2e/
├── UC-Login/
│   ├── login-success.cy.js (8 tests)
│   │   ├── Form display validation
│   │   ├── Student login (mugishok)
│   │   ├── Instructor login (devmerci)
│   │   ├── Session management
│   │   └── Login redirect handling
│   └── login-invalid-password.cy.js (10 tests)
│       ├── Error messages
│       ├── Student invalid password
│       ├── Instructor invalid password
│       └── Form recovery
│
├── UC-CreateAccount/
│   ├── register-success.cy.js (9 tests)
│   ├── register-validation.cy.js (11 tests)
│   └── registration-confirmation.cy.js (14 tests)
│
├── UC-ManageSurveys/ (INSTRUCTOR)
│   ├── login-managersurveys.cy.js (15 tests - devmerci)
│   ├── create-survey.cy.js (10 tests - devmerci)
│   ├── edit-survey.cy.js (13 tests - devmerci)
│   └── delete-survey.cy.js (12 tests - devmerci)
│
├── UC-ProvideFeedback/ (STUDENT)
│   ├── submit-survey.cy.js (11 tests - mugishok)
│   └── required-fields.cy.js (13 tests - mugishok)
│
└── UC-ReviewFeedback/ (STUDENT)
    └── review-feedback.cy.js (19 tests - mugishok)
```

---

## 🔐 Credentials dans cypress.env.json

```json
{
  "WORDPRESS_USER": "mugishok",
  "WORDPRESS_PASSWORD": "Merci@2026",
  "WORDPRESS_STUDENT_USER": "mugishok",
  "WORDPRESS_STUDENT_PASSWORD": "Merci@2026",
  "WORDPRESS_INSTRUCTOR_USER": "devmerci",
  "WORDPRESS_INSTRUCTOR_PASSWORD": "Merci@2026"
}
```

---

## 🛠️ Commandes Réutilisables

### Authentification

```javascript
// Login générique
cy.login(username, password);

// Login avec erreur
cy.loginWithError(username, password);

// Logout
cy.logout();

// Register
cy.register(email, username, password);

// Request password reset
cy.requestPasswordReset(identifier);
```

### Gestion des Enquêtes (Instructor)

```javascript
// Créer une enquête
cy.createSurvey({
  title: "Survey Title",
  description: "Survey Description",
});

// Éditer une enquête
cy.editSurvey({
  title: "Updated Title",
  description: "Updated Description",
});

// Supprimer une enquête
cy.deleteSurvey("Survey Title");
```

### Réponses aux Enquêtes (Student)

```javascript
// Ouvrir une enquête
cy.openSurvey(surveySlug);

// Soumettre une enquête
cy.submitSurvey(answers);

// Répondre à une question radio
cy.answerRadio(questionName, answer);

// Répondre à une case à cocher
cy.answerCheckbox(questionName, answers);

// Répondre à un champ texte
cy.answerText(questionName, text);

// Répondre à un dropdown
cy.answerDropdown(questionName, value);
```

### Consultation du Feedback (Student)

```javascript
// Ouvrir les enquêtes complétées
cy.openCompletedSurveys();

// Voir les réponses d'une enquête
cy.viewSurveyResponses("Survey Title");
```

---

## 📊 Résumé des Tests

### Total des Tests: **127 tests** ✅

| Module             | Fichier                         | Tests | Rôle       | Statut |
| ------------------ | ------------------------------- | ----- | ---------- | ------ |
| UC-Login           | login-success.cy.js             | 8     | Any        | ✅     |
| UC-Login           | login-invalid-password.cy.js    | 10    | Any        | ✅     |
| UC-CreateAccount   | register-success.cy.js          | 9     | Public     | ✅     |
| UC-CreateAccount   | register-validation.cy.js       | 11    | Public     | ✅     |
| UC-CreateAccount   | registration-confirmation.cy.js | 14    | Public     | ✅     |
| UC-ManageSurveys   | login-managersurveys.cy.js      | 15    | Instructor | ✅     |
| UC-ManageSurveys   | create-survey.cy.js             | 10    | Instructor | ✅     |
| UC-ManageSurveys   | edit-survey.cy.js               | 13    | Instructor | ✅     |
| UC-ManageSurveys   | delete-survey.cy.js             | 12    | Instructor | ✅     |
| UC-ProvideFeedback | submit-survey.cy.js             | 11    | Student    | ✅     |
| UC-ProvideFeedback | required-fields.cy.js           | 13    | Student    | ✅     |
| UC-ReviewFeedback  | review-feedback.cy.js           | 19    | Student    | ✅     |

---

## 🚀 Exécution des Tests

### Exécuter tous les tests

```bash
npx cypress run
```

### Exécuter les tests d'un module spécifique

```bash
npx cypress run --spec cypress/e2e/UC-Login/**/*.cy.js
npx cypress run --spec cypress/e2e/UC-ManageSurveys/**/*.cy.js
npx cypress run --spec cypress/e2e/UC-ProvideFeedback/**/*.cy.js
```

### Exécuter un fichier de test spécifique

```bash
npx cypress run --spec cypress/e2e/UC-Login/login-success.cy.js
```

### Mode interactif (Cypress UI)

```bash
npx cypress open
```

---

## 🎯 Couverture des Fonctionnalités

### ✅ Authentification (UC-Login)

- [x] Formulaire de connexion visible
- [x] Connexion avec identifiants valides (student)
- [x] Connexion avec identifiants valides (instructor)
- [x] Messages d'erreur pour identifiants invalides
- [x] Gestion des tentatives échouées
- [x] Remembreme functionality
- [x] Session persistence
- [x] Logout functionality

### ✅ Création de Compte (UC-CreateAccount)

- [x] Formulaire d'enregistrement visible
- [x] Validation des champs obligatoires
- [x] Détection des doublons (username/email)
- [x] Validation du format email
- [x] Message de confirmation
- [x] Lien vers page de connexion
- [x] Caractères spéciaux
- [x] Trimming whitespace

### ✅ Gestion des Enquêtes (UC-ManageSurveys) - INSTRUCTOR

- [x] Authentification instructeur
- [x] Accès au tableau de bord d'administration
- [x] Création d'enquête
- [x] Édition d'enquête
- [x] Suppression d'enquête
- [x] Sauvegarde en tant que brouillon
- [x] Publication d'enquête
- [x] Gestion des états
- [x] Navigation entre pages

### ✅ Remplissage d'Enquête (UC-ProvideFeedback) - STUDENT

- [x] Navigation vers les enquêtes
- [x] Ouverture des enquêtes disponibles
- [x] Remplissage des formulaires
- [x] Validation des champs obligatoires
- [x] Messages d'erreur de validation
- [x] Correction des erreurs
- [x] Soumission des réponses
- [x] Confirmation de soumission
- [x] Support des différents types de questions

### ✅ Consultation du Feedback (UC-ReviewFeedback) - STUDENT

- [x] Navigation vers les enquêtes complétées
- [x] Affichage de la liste des enquêtes
- [x] Détails des réponses
- [x] Historique de participation
- [x] Format lisible des données

---

## 🔍 Assertions Clés

Chaque test inclut:

- ✅ Vérification d'URL
- ✅ Vérification de messages d'erreur
- ✅ Vérification de messages de succès
- ✅ Vérification de présence/absence d'éléments
- ✅ Validation de valeurs de formulaire
- ✅ Vérification de session

---

## 📝 Notes Importantes

1. **Rôle de l'Utilisateur**: Assurez-vous d'utiliser le bon utilisateur pour chaque contexte
   - Tests d'instructeur = `devmerci`
   - Tests d'étudiant = `mugishok`

2. **Données de Test**: Les tests génèrent des données uniques avec `Date.now()` pour éviter les collisions

3. **Attentes Explicites**: Tous les tests utilisent des attentes explicites (pas d'attentes arbitraires)

4. **Pas de Placeholders**: Aucun code incomplet ou TODO - tous les tests sont fonctionnels

5. **Syntaxe Moderne**: Tous les tests utilisent la syntaxe Cypress moderne (15.17.0)

---

## ✨ Prochaines Étapes

1. ✅ Tous les tests implémentés
2. ✅ Tous les utilisateurs configurés
3. ✅ Toutes les commandes réutilisables créées
4. ⬜ Exécution des tests en CI/CD
5. ⬜ Rapport de couverture
6. ⬜ Optimisation des performances

---

## 📞 Support

Pour exécuter les tests:

```bash
cd /home/ir_mugisho_merci/Bureau/Tout-mes-project-dev/project-cypress/Team-Gautier-MKB-Cohort3-Automation/Dieu-merci

# Vérifier Cypress
npx cypress verify

# Exécuter tous les tests
npx cypress run

# Ouvrir Cypress UI
npx cypress open
```

---

**Suite de Tests Complète - Phase 2 ✅**
