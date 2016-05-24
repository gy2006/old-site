function getUA () {
  return navigator.userAgent;
}
function isIE () {
  return /MSIE/i.test(getUA());
}

const supportLanguages = ['zh', 'en'];
function getLocale () {
  const languages = navigator.languages || [navigator.language];
  let language;
  // /^(zh|en)/
  const regexp = new RegExp(`^(${supportLanguages.join('|')})`, 'i');
  languages.some((l) => {
    if (regexp.test(l)) {
      language = RegExp.$1;
      return true;
    }
    return false;
  });
  return language || 'en';
}
export default {
  isIE: isIE(),
  locale: getLocale()
};
