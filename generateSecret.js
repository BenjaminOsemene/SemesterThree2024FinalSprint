const crypto = require('crypto');

function generateSessionSecret() {
  return crypto.randomBytes(64).toString('hex');
}

const sessionSecret = generateSessionSecret();
console.log('Your generated session secret:', sessionSecret);