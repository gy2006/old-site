import $ from 'jquery';
import FormValidate from './validate';
import Errors from './errors';
import Button from './button';
import User from './actions/user';

function bindSubmit (form) {
  function handlerSubmit (e) {
    const $submitBtn = new Button($(this).find('input[type="submit"]'));
    $submitBtn.setDisabled(true);
    $submitBtn.startLoading();

    const fields = form.getValues();
    User.forgetPassword(fields.email).done(() => {
      $('#reset-password-form').addClass('success');
      this.reset();
    }).fail((e) => {
      form.setError('$form', Errors(e));
    }).always(function () {
      $submitBtn.setDisabled(false);
      $submitBtn.endLoading();
    });
  }
  form.$form.submit(handlerSubmit);
}

function initValidate () {
  return new FormValidate('#reset-password-form', [{
    name: 'email',
    rules: 'required|email',
    errorElement: '#reset-password-form .form-email .text-danger'
  }], {
    errorElement: '#reset-password-form .form-error'
  });
}

export default function bootstrap () {
  $('body').addClass('page-signin');
  // console.log('bootstrap signin');
  const form = initValidate();
  bindSubmit(form);
}
