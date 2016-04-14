const COOKIE_MAXAGE = 7*24*60*60;
const COOKIE_DOMAIN = { local: 'localhost', lyon: '.lyon.flow.ci', production: '.flow.ci' }[__TARGET__];

export function save (name, value, maxAge) {
  if (!maxAge) {
    maxAge = COOKIE_MAXAGE;
  }
  document.cookie = `${name}=${value}; domain=${COOKIE_DOMAIN}; path='/'; max-age=${maxAge}`;
}

export function get (name) {
  const reg = new RegExp(`\\s*${name}=([^;]*)`);
  const match = document.cookie.match(reg);
  return match && match.length ? match[1] : undefined;
}

export function clear (name) {
  document.cookie = `${name}=; domain=${COOKIE_DOMAIN}; path='/'; max-age=0`;
}

export default {
  save,
  get,
  clear
}