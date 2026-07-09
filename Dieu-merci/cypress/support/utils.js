export function randomString(length = 8) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(Math.random() * characters.length);
    result += characters[index];
  }

  return result;
}

export function randomUsername(prefix = 'user', length = 6) {
  return `${prefix}_${randomString(length)}`;
}

export function randomEmail(domain = 'example.com') {
  return `${randomString(10)}@${domain}`;
}

Cypress.randomString = randomString;
Cypress.randomUsername = randomUsername;
Cypress.randomEmail = randomEmail;
