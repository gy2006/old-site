import cookies from '../util/cookies'
import { BASE_COOKIE_CONFIG } from '../constant'

export default function (locale) {
  cookies.save('locale', locale, Object.assign({}, BASE_COOKIE_CONFIG, {
    'max-age': 365 * 24 * 60 * 60
  }))
  // 防止浏览器缓存
  const href = window.location.href
  if (href.indexOf('?') > -1) {
    window.location.href = `${href}&d=${(new Date()).getTime()}`
  } else {
    window.location.href = `${href}?d=${(new Date()).getTime()}`
  }
}
