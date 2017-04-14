import JsCookies from 'js-cookie'

const Cookies = JsCookies.withConverter({
  read: function (cookie, name) {
    return cookie
  },
  write: function (value, key) {
    return value
  }
})

export function save (name, value, options = {}) {
  Cookies.set(name, value, options)
}

export function get (name) {
  return Cookies.get(name)
}

export function clear (name, options = {}) {
  options['max-age'] = 0
  save(name, '', options)
}

export default {
  save,
  get,
  clear
}
