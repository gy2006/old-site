import cookies from '../util/cookies'
import { BASE_COOKIE_CONFIG } from '../constant'

export default function (locale) {
  cookies.save('locale', locale, Object.assign({}, BASE_COOKIE_CONFIG, {
    'max-age': 365 * 24 * 60 * 60
  }))
  window.location.reload(true)
}
