import $ from 'jquery';
import FormValidate from './validate';
import signin from './actions/signin';
import Errors from './errors';
import Button from './button';

function bindSubmit(form) {
  function handlerSubmit (e) {
    const $submitBtn = new Button($(this).find('input[type="submit"]'));
    $submitBtn.setDisabled(true);
    $submitBtn.startLoading();

    signin(form.getValues()).fail(function (e){
      form.setError('$form', Errors(e));
    }).always(() => {
      $submitBtn.setDisabled(false);
      $submitBtn.endLoading();
    });
  }
  form.$form.submit(handlerSubmit);
}

function initValidate () {
  return new FormValidate("#signin-form", [{
    name: 'login',
    rules: 'required|loginname',
    errorElement: '#signin-form .form-loginname .text-danger'
  }, {
    name: 'password',
    rules: 'required|minlength:6',
    errorElement: '#signin-form .form-password .text-danger'
  }], {
    errorElement: '#signin-form .form-error'
  });
}

export default function bootstrap() {
  $('body').addClass('page-signin');
  // console.log('bootstrap signin');
  const form = initValidate()
  bindSubmit(form);
}
