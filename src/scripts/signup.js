import $ from 'jquery'
import FormValidate from './validate'

import User from './actions/user'
import analysis from './actions/analysis'

import getSearch from './util/getSearch'
import browser from './util/browser'

import Errors from './errors'
import Button from './button'

const translations = {
  zh: {
    getCode: '获取验证码',
    emailError: '请填写正确的邮箱',
    telephoneError: '请填写正确的电话号码',
    waitText: '再次发送 (${times}s)'
  },
  en: {
    getCode: '获取验证码',
    emailError: '请填写正确的邮箱',
    telephone: '请填写正确的电话号码',
    waitText: '再次发送 (${times}s)'
  }
}
const translation = translations[browser.locale] || {}
function bindSubmit (form) {
  function handlerSubmit (e) {
    const $submitBtn = new Button($(this).find('input[type="submit"]'))
    $submitBtn.setDisabled(true)
    $submitBtn.startLoading()

    const fields = form.getValues()
    User.create(fields).fail((e) => {
      form.setError('$form', Errors(e))
    }).always(function () {
      $submitBtn.setDisabled(false)
      $submitBtn.endLoading()
    })
  }
  form.$form.submit(handlerSubmit)
}

function initValidate () {
  return new FormValidate('#signup-form', [{
    name: 'email',
    rules: 'required|email',
    errorElement: '#signup-form .form-email .text-danger'
  }, {
    name: 'username',
    rules: 'required|username',
    errorElement: '#signup-form .form-username .text-danger'
  }, {
    name: 'password',
    rules: 'required|minlength:6',
    errorElement: '#signup-form .form-password .text-danger'
  }, {
    name: 'company_name',
    rules: 'required',
    errorElement: '#signup-form .form-company .text-danger'
  }, {
    name: 'job',
    rules: 'required',
    errorElement: '#signup-form .form-job .text-danger'
  }, {
    name: 'telephone',
    rules: 'required',
    errorElement: '#signup-form .form-telephone .text-danger'
  }, {
    name: 'company_scale',
    rules: 'required',
    errorElement: '#signup-form .form-company-scale .text-danger'
  }, {
    name: 'verification_code',
    reules: 'required',
    errorElement: '#signup-form .form-code .text-danger'
  }], {
    errorElement: '#signup-form .form-error'
  })
}

function injectSeach () {
  const params = getSearch()
  if (params.email) {
    $('#email').val(params.email)
  }
  if (params.sign) {
    $('#sign').val(params.sign)
  }
  if (params.email && params.sign) {
    analysis.event.confirmEmail(params)
  }
}

function startGetCodeLisnter (form) {
  const $email = $('#email')
  const $telephone = $('#telephone')
  const $btn = $('#getCode')
  let times // s
  let isLoading
  let interval
  let timer
  function init () {
    clearInterval(interval)
    clearTimeout(timer)
    isLoading = false
    times = 60 // reset
    $btn.removeAttr('disabled')
    $btn.text(translation.getCode)
  }
  init()
  function validate () {
    if (isLoading) {
      return false
    }
    const { email: emailValidate } = FormValidate.getDefaultValidators()
    const email = $email.val()
    const tel = $telephone.val()
    if (!email || !emailValidate(email)) {
      form.setError('email', translation.emailError)
      return false
    }
    if (!tel) {
      form.setError('telephone', translation.telephoneError)
      return false
    }
    return true
  }

  function waitText () {
    const str = translation.waitText || ''
    $btn.text(str.replace('${times}', times))
    interval = setInterval(() => {
      times--
      $btn.text(str.replace('${times}', times))
    }, 1000)
  }

  $btn.click(function () {
    if (!validate()) {
      return
    }
    const email = $email.val()
    const tel = $telephone.val()
    isLoading = true

    $btn.attr('disabled', 'disabled')
    waitText()
    timer = setTimeout(init, times * 1000)

    User.getVerifyCode(email, tel).fail((e) => {
      form.setError('$form', Errors(e))
    })
  })
}
export default function bootstrap () {
  // $('body').addClass('page-signup')
  // console.log('bootstrap signup');
  injectSeach()
  const form = initValidate()
  bindSubmit(form)
  startGetCodeLisnter(form)
}
