const COOKIE_KEY = __TARGET__ === 'production' ? 'flow_session' : `flow_session_${__TARGET__}`;
const COOKIE_MAXAGE = 7*24*60*60;
const COOKIE_DOMAIN = __TARGET__ === 'production' ? '' : '.lyon';

export function save (name, value, maxAge) {
  if (!maxAge) {
    maxAge = COOKIE_MAXAGE;
  }
  document.cookie = `${name}=${value}; domain=${COOKIE_DOMAIN}.flow.ci; path='/'; max-age=${maxAge}`;
}

export function get (name) {
  const reg = new RegExp(`\\s*${name}=([^;]*)`);

  const match = document.cookie.match(reg);
  return match && match.length ? match[1] : undefined;
}

export default {
  save,
  get
}