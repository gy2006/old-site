import $ from 'jquery'
import Browser from '../util/browser'

import { COOKIE_KEY, CD_COOKIE_KEY, GETUSER_URL, SIGNUP_URL, FORGET_PASSWORD_URL, RESET_PASSWORD_URL, SESSION_COOKIE_CONFIG } from '../constant'
import analysis from './analysis'
import saveAccessToken from './saveAccessToken'
import redirectToDashboard from './redirectToDashboard'
import { get as getCookie, clear as clearCookie } from '../util/cookies'
import getSearch from '../util/getSearch'

export function getUserToken () {
  return getCookie(COOKIE_KEY)
}

export function getCdUserToken () {
  return getCookie(CD_COOKIE_KEY)
}

export function removeUserToken () {
  return clearCookie(COOKIE_KEY, SESSION_COOKIE_CONFIG)
}

export function get (userToken) {
  const token = userToken || getUserToken()
  return $.ajax(`${GETUSER_URL}?access_token=${token}&locale=${Browser.locale}`, {
    method: 'get'
  })
}

export function getVerifyCode (email, tel) {
  return $.ajax(`${__API__}/sms/verification_code`, {
    method: 'post',
    data: {
      email,
      phone_number: tel,
      locale: Browser.locale === 'en' ? 'en' : 'zh-CN'
    }
  })
}
export function test (userToken) {
  const token = userToken || getUserToken()
  return $.ajax(`${GETUSER_URL}?access_token=${token}`, {
    method: 'head'
  })
}

function toFlowCd () {
  setTimeout(function () {
    window.location.href = 'http://cd.flow.ci/login/cb'
  }, 500)
}

export function create (user) {
  const urlParams = getSearch()
  const locale = Browser.locale === 'en' ? 'en' : 'zh-CN'
  return $.post({
    url: SIGNUP_URL,
    data: Object.assign(user, { locale })
  }).done(function (resp) {
    const accessToken = resp.access_token
    saveAccessToken(accessToken)
    if (urlParams.redirect_uri && urlParams.redirect_uri.includes('cd.flow.ci')) {
      return toFlowCd()
    }
    analysis.event.signUp(user, urlParams, function () {
      redirectToDashboard(accessToken)
    })
  })
}

export function forgetPassword (email) {
  return $.post({
    url: FORGET_PASSWORD_URL,
    data: {
      email
    },
    dataType: 'text'
  })
}

export function resetPassword (token, password) {
  return $.ajax({
    url: RESET_PASSWORD_URL,
    method: 'PATCH',
    data: {
      reset_password_token: token,
      password,
      confirm_password: password
    }
  }).done(function (resp) {
    const accessToken = resp.access_token
    saveAccessToken(accessToken)
    redirectToDashboard(accessToken)
  })
}

export default {
  get: get,
  getVerifyCode,
  test: test,
  create: create,
  getUserToken,
  removeUserToken,
  forgetPassword,
  resetPassword,
  getCdUserToken
}
