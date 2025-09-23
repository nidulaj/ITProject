// passwordGenerator.js
function generatePassword() {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";
  

  const getRandom = (chars) => chars[Math.floor(Math.random() * chars.length)];

  let passwordChars = [
    getRandom(upper),
    getRandom(lower),
    getRandom(numbers),
    getRandom(symbols),
  ];


  const all = upper + lower + numbers + symbols;
  while (passwordChars.length < 6) {
    passwordChars.push(getRandom(all));
  }

  return passwordChars.join("");
}

module.exports = { generatePassword };
