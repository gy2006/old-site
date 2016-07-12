import {
  get as getCookie,
  clear as clearCookie
} from '../util/cookies'
import { REDIRECT_KEY, BASE_COOKIE_CONFIG } from '../constant'

function getDefaultUrl (accessToken) {
  return __TARGET__ === 'local' ? `${__DASHBOARD_URL__}?access_token=${accessToken}` : __DASHBOARD_URL__
}

export function getDashboardUrl (accessToken) {
  let url = getCookie(REDIRECT_KEY)
  if (url) {
    clearCookie(REDIRECT_KEY, BASE_COOKIE_CONFIG)
    url = decodeURIComponent(url)
  }
  const reg = new RegExp(`^(http|https)\:${__DASHBOARD_URL__}`)
  if (!url || !reg.test(url)) {
    url = getDefaultUrl(accessToken)
  }
  return url
}

export default function redirectToDashboard (accessToken) {
  window.location.href = getDashboardUrl(accessToken)
}

