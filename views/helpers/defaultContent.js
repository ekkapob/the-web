module.exports = (data, defaultContent) => {
  if (data) {
    return data;
  }
  return defaultContent;
};
