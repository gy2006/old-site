import $ from 'jquery'
import FormValidate from './validate'
import signin from './actions/signin'
import Errors from './errors'
import Button from './button'
import getSearch from './util/getSearch'
import User from './actions/user'
import { GET_OAUTHCODE_URL } from './constant'
function bindSubmit (form) {
  function handlerSubmit (e) {
    const $submitBtn = new Button($(this).find('input[type="submit"]'))
    $submitBtn.setDisabled(true)
    $submitBtn.startLoading()

    signin(form.getValues()).fail(function (e) {
      form.setError('$form', Errors(e))
    }).always(() => {
      $submitBtn.setDisabled(false)
      $submitBtn.endLoading()
    })
  }
  form.$form.submit(handlerSubmit)
}

function initValidate () {
  return new FormValidate('#signin-form', [{
    name: 'login',
    rules: 'required|loginname',
    errorElement: '#signin-form .form-loginname .text-danger'
  }, {
    name: 'password',
    rules: 'required|minlength:6',
    errorElement: '#signin-form .form-password .text-danger'
  }], {
    errorElement: '#signin-form .form-error'
  })
}

function OauthLogin () {
  const token = User.getUserToken()
  const params = getSearch()
  const { code, redirect_uri: url } = params
  console.log(token)
  alert(token)
  if (!!code && !!url && url.includes('club.flow.ci') && token) {
    $('#signin-form').html('登录成功')
    $.ajax({
      url: `${GET_OAUTHCODE_URL}?access_token=${token}&code=${params.code}`,
      method: 'patch',
      success: function () {
        window.location.href = `${params.redirect_uri}?code=${params.code}`
      },
      fail: function (error) {
        throw new Error(error)
      }
    })
  } else if (!!code && !!url && url.includes('cd-lyon.flow.ci') && token) {
    $('#signin-form').html('登录成功')
    setTimeout(function () {
      window.location.href = `${params.redirect_uri}?code=${params.code}`
    }, 1000)
  }
}
export default function bootstrap () {
  // $('body').addClass('page-signin')

  const form = initValidate()
  bindSubmit(form)
  OauthLogin()
  const params = getSearch()
  if (params.reset_password) {
    // todo i18n
    $('#signin-form legend').text('Password change successful')
    const email = params.email
    if (email) {
      $('#signin-form #login').val(email)
    }
  }
}
