import $ from 'jquery';
import FormValidate from './validate';
import Errors from './errors';
import Button from './button';
import User from './actions/user';
import getSearch from './util/getSearch';

function bindForgetSubmit (id, form) {
  function handlerSubmit (e) {
    const $submitBtn = new Button($(this).find('input[type="submit"]'));
    $submitBtn.setDisabled(true);
    $submitBtn.startLoading();

    const fields = form.getValues();
    User.forgetPassword(fields.email).done(() => {
      console.log('done');
      $(`#${id}`).addClass('success');
      this.reset();
    }).fail(function (e) {
      console.log(arguments);
      form.setError('$form', Errors(e));
    }).always(function () {
      $submitBtn.setDisabled(false);
      $submitBtn.endLoading();
    });
  }
  form.$form.submit(handlerSubmit);
}

function initForgetValidate (id) {
  return new FormValidate(`#${id}`, [{
    name: 'email',
    rules: 'required|email',
    errorElement: `#${id} .form-email .text-danger`
  }], {
    errorElement: `#${id} .form-error`
  });
}

function bootstrapForget () {
  const id = 'forget-password-form';
  // console.log('bootstrap signin');
  $('#forget-password').show();
  const form = initForgetValidate(id);
  bindForgetSubmit(id, form);
}

function bindResetSubmit (sign, id, form) {
  function handlerSubmit (e) {
    const $submitBtn = new Button($(this).find('input[type="submit"]'));
    $submitBtn.setDisabled(true);
    $submitBtn.startLoading();

    const fields = form.getValues();

    User.resetPassword(sign, fields.password).done(() => {
      $(`#${id}`).addClass('success');
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

function initResetValidate (id) {
  return new FormValidate(`#${id}`, [{
    name: 'password',
    rules: 'required|minlength:6',
    errorElement: `#${id} .form-password .text-danger`
  }, {
    name: 'confirm_password',
    rules: 'required|minlength:6|confirm:password',
    errorElement: `#${id} .form-confirm-password .text-danger`
  }], {
    errorElement: `#${id} .form-error`
  });
}

function bootstrapReset (sign) {
  $('#reset-password').show();
  const id = 'reset-password-form';
  const form = initResetValidate(id);
  bindResetSubmit(sign, id, form);
}

export default function bootstrap () {
  const params = getSearch();
  if (params.sign) {
    bootstrapReset(params.sign);
  } else {
    bootstrapForget();
  }
}
