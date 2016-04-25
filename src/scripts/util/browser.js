function getUA () {
  return navigator.userAgent;
}
function isIE () {
  return /MSIE/i.test(getUA());
}
export default {
  isIE: isIE()
};
