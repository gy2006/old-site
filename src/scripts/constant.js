export const EMAIL_REG = /^[a-zA-Z0-9_+.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,6}/i
// 已字母开头，数字或字母结尾
export const USERNAME_REG = /^\w{3,15}$/ // /^[0-9a-zA-Z]{3,15}$/;

// set default cookie config
let host = location.hostname.split('.')
let domain = host
// 子域名取上层域名
if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}/.test(host) && host.length > 2) {
  host[0] = ''
  domain = host.join('.')
}

export const SESSION_COOKIE_MAXAGE = 7 * 24 * 60 * 60
export const COOKIE_DOMAIN = domain

export const BASE_COOKIE_CONFIG = {
  path: '/',
  domain: COOKIE_DOMAIN
}

export const SESSION_COOKIE_CONFIG = Object.assign({}, BASE_COOKIE_CONFIG, {
  'max-age': SESSION_COOKIE_MAXAGE
})

export const COOKIE_KEY = 'flow_session'
// export const COOKIE_KEY = __TARGET__ === 'production' ? 'flow_session' : `flow_session_${__TARGET__}`

export const REDIRECT_KEY = __TARGET__ === 'production' ? 'flow_previous_url' : `flow_${__TARGET__}_previous_url`

export const SIGNIN_URL = `${__API__}/login`
export const SIGNUP_URL = `${__API__}/signup`
export const GETUSER_URL = `${__API__}/user`
export const FORGET_PASSWORD_URL = `${__API__}/user/password`
export const RESET_PASSWORD_URL = `${__API__}/user/password`

export const UTM_LIST = [
  'utm_source',
  'utm_medium',
  'utm_content'
]
