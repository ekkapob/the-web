module.exports = (number, single, plural) => {
  if (isNaN(parseInt(number))) return;
  if (number > 1) return plural;
  return single;
};
