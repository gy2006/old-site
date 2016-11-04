import $ from 'jquery'
import FormValidate from './validate'
import User from './actions/user'
import analysis from './actions/analysis'
import getSearch from './util/getSearch'
import Errors from './errors'
import Button from './button'

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
export default function bootstrap () {
  // $('body').addClass('page-signup')
  // console.log('bootstrap signup');
  injectSeach()
  const form = initValidate()
  bindSubmit(form)
}
