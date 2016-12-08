import {
  get as getCookie,
  clear as clearCookie
} from '../util/cookies'
import { REDIRECT_KEY, BASE_COOKIE_CONFIG } from '../constant'

function getDefaultUrl (accessToken) {
  return __DASHBOARD_URL__
}

function isRelativeUrl (url) {
  return /^\/+\w+/.test(url)
}

export function getDashboardUrl (accessToken) {
  let url = getCookie(REDIRECT_KEY)
  if (url) {
    clearCookie(REDIRECT_KEY, BASE_COOKIE_CONFIG)
    url = decodeURIComponent(url)
  }
  if (isRelativeUrl(url)) {
    return __DASHBOARD_URL__ + url
  }
  return getDefaultUrl()
}

export default function redirectToDashboard (accessToken) {
  window.location.href = getDashboardUrl(accessToken)
}

