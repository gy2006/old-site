import './styles/main.scss'
import $ from 'jquery'
import './scripts/polyfill/assign'
import User from './scripts/actions/user'
import { getDashboardUrl } from './scripts/actions/redirectToDashboard'
import signin from './scripts/signin'
import resetPassword from './scripts/password'
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

function language () {
  if (browser.locale !== 'zh') {
    return {
      username: 'Unsupported characters. Please use only use alphanumeric characters and underscore.',
      loginname: 'Incorrect email or username format',
      confirm: 'Password doesn\'t match the confirmation'
    }
  } else {
    return {
      username: '不支持的字符。请仅使用字母数字字符和下划线.',
      loginname: '不正确的电子邮件或用户名格式',
      confirm: '密码与确认不符'
    }
  }
}

FormValidate.setDefaultRulesMap(language())

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
    }).fail(function () {
      User.removeUserToken()
    })
  }

  if (/^\/signin(\.html)?/.test(path)) {
    signin()
  } else if (/^\/password_reset(\.html)?/.test(path)) {
    resetPassword()
  }
}

$(bootstrap)

export default {}
