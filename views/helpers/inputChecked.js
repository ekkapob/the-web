module.exports = (inputName, inputValue, queryParams) => {
  if (!queryParams) return '';
  if (!inputName || !inputValue) return '';
  return (queryParams[inputName].indexOf(inputValue) != -1) ? 'checked' : '';
};
