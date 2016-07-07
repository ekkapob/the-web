import Handlebars   from 'handlebars';

module.exports = (currentLang, urlPath) => {
  const toggleLang = (currentLang == 'en') ? 'th' : 'en';
  const alt = (toggleLang == 'en') ? 'English' : 'Thai';
  let host = 'localhost:3000';
  if (process.env.ENV == 'production') {
    host = 'traautoparts.com';
  }
  const url = `http://${toggleLang}.${host}${urlPath}`;
  const toggle = `<a id="locale-toggle" href="${url}">
                    <img src="/assets/images/locales/${toggleLang}.png"
                      alt="${alt}"></a>`;
  return new Handlebars.SafeString(toggle);
};

