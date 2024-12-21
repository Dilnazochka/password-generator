const crypto = window.crypto || window.msCrypto; 

const generatePassword = (length, options) => {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
  let allChars = '';
  if (options.uppercase) allChars += upper;
  if (options.lowercase) allChars += lower;
  if (options.numbers) allChars += numbers;
  if (options.symbols) allChars += symbols;

  if (!allChars) return 'Please select at least one option!';

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }
  return password;
};

const getPasswordStrength = (password) => {
  const lengthCriteria = password.length >= 12;
  const upperCriteria = /[A-Z]/.test(password);
  const lowerCriteria = /[a-z]/.test(password);
  const numberCriteria = /\d/.test(password);
  const symbolCriteria = /[!@#$%^&*()_+[\]{}|;:,.<>?]/.test(password);

  const strengthScore =
    lengthCriteria + upperCriteria + lowerCriteria + numberCriteria + symbolCriteria;

  if (strengthScore === 5) return 'Strong';
  if (strengthScore >= 3) return 'Medium';
  return 'Weak';
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('Password copied to clipboard!');
  }).catch((err) => {
    alert('Failed to copy password: ' + err);
  });
};

const generateHash = (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  return crypto.subtle.digest('SHA-256', data).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  });
};

let passwordHistory = [];

document.getElementById('generate').addEventListener('click', async () => {
  const length = parseInt(document.getElementById('length').value, 10);
  const options = {
    uppercase: document.getElementById('uppercase').checked,
    lowercase: document.getElementById('lowercase').checked,
    numbers: document.getElementById('numbers').checked,
    symbols: document.getElementById('symbols').checked,
  };

  const password = generatePassword(length, options);
  const strength = getPasswordStrength(password);
  const hash = await generateHash(password);

  document.getElementById('password').textContent = password;
  document.getElementById('strength').textContent = `Strength: ${strength}`;

  passwordHistory.push({ password, strength, hash });
  console.log('Password History:', passwordHistory);
});

document.getElementById('copy').addEventListener('click', () => {
  const password = document.getElementById('password').textContent;
  if (password) {
    copyToClipboard(password);
  }
});
