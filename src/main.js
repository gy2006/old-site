import './styles/main.scss'
import $ from 'jquery'
import './scripts/polyfill/assign'
import User from './scripts/actions/user'
import { getDashboardUrl } from './scripts/actions/redirectToDashboard'
import home from './scripts/home'
import signin from './scripts/signin'
import signup from './scripts/signup'
import resetPassword from './scripts/password'
import pricing from './scripts/pricing'
import analysis from './scripts/actions/analysis'
import getSearch from './scripts/util/getSearch'
import setLocale from './scripts/actions/setLocale'

import FormValidate from './scripts/validate'

import { UTM_LIST, EMAIL_REG, USERNAME_REG } from './scripts/constant'
import browser from './scripts/util/browser'
import './scripts/components/navbar'

analysis.init()
/*
  default set validator for FormValidate;
*/
FormValidate.setDefaultValidators({
  email: function (value) {
    return EMAIL_REG.test(value)
  },
  username: function (value) {
    return USERNAME_REG.test(value)
  },
  loginname: function (value) {
    return EMAIL_REG.test(value) || USERNAME_REG.test(value)
  },
  confirm: function (value, name) {
    return value === this[name]
  }
})

FormValidate.setDefaultRulesMap({
  username: 'Unsupported characters. Please use only use alphanumeric characters and underscore.',
  loginname: 'Incorrect email or username format',
  confirm: 'Password doesn\'t match the confirmation'
})

function getUtm () {
  const value = {}
  let hasUtm = false
  const urlParams = getSearch()
  UTM_LIST.forEach((key) => {
    const v = urlParams[key]
    if (v) {
      hasUtm = true
      value[key] = v
    }
  })
  return hasUtm ? value : null
}

function bootstrap () {
  const path = location.pathname
  const UNSUPPORTED_PATH = '/unsupported.html'

  if (browser.isIE && path !== UNSUPPORTED_PATH) {
    window.location = UNSUPPORTED_PATH
    return
  }
  if (path === UNSUPPORTED_PATH) {
    if (browser.isIE) {
      analysis.pageView()
    } else {
      window.location = '/'
    }
    return
  }
  const utms = getUtm()
  utms && analysis.register(utms)
  analysis.pageView()
  // set language
  const languageBtn = $('button.language')
  languageBtn.click(function () {
    const $ele = $(this)
    const l = $ele.val()
    setLocale(l)
    analysis.event.setLocale(l)
  })

  const token = User.getUserToken()
  if (token) {
    User.get(token).done(function (userInfo) {
      analysis.event.getUserSuccess(userInfo)
      $('.navbar .nav-sign').hide()
      const $navUser = $('.navbar .nav-user').removeClass('hide')
      const $navLink = $navUser.find('a')
      const $navAvator = $navUser.find('.avator')
      $navLink.attr('href', getDashboardUrl(token))
      $navAvator.attr('src', userInfo.avatar)
      const { id, username, email } = userInfo
      window.drift.identify(id, { name: username, email })
    }).fail(function () {
      User.removeUserToken()
    })
  } else {
    // window.drift.identify('visitor')
  }

  if (/^\/signup(\.html)?/.test(path)) {
    signup()
  } else if (/^\/signin(\.html)?/.test(path)) {
    signin()
  } else if (/^\/password_reset(\.html)?/.test(path)) {
    resetPassword()
  } else if (path === '/') {
    home()
  } else if (/^\/pricing(\.html)?/.test(path)) {
    pricing()
  }
}

$(bootstrap)

export default {}
