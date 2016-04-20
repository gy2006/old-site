export function save (name, value, options = {}) {
  let cookie = `${name}=${value};`;
  for (const key in options) {
    cookie += `${key}=${options[key]};`;
  }
  console.log(cookie);
  document.cookie = cookie;
}

export function get (name) {
  const reg = new RegExp(`\\s*${name}=([^;]*)`);
  const match = document.cookie.match(reg);
  return match && match.length ? match[1] : undefined;
}

export function clear (name, options = {}) {
  options['max-age'] = 0;
  save(name, '', options);
}

export default {
  save,
  get,
  clear
};
