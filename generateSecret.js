//Import module and define function to generate a session secret
const crypto = require('crypto');

function generateSessionSecret() {
  return crypto.randomBytes(64).toString('hex');
}

const sessionSecret = generateSessionSecret();
console.log('Your generated session secret:', sessionSecret);