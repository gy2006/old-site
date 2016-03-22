import $ from 'jquery';
import FormValidate from './validate';
import signin from './actions/signin';

function bindSubmit(form) {
  function handlerSubmit (e) {
    e.preventDefault();
    // console.log('enter home submit', form.getValues());
    signin(form.getValues());
  }
  form.$form.submit(handlerSubmit);
}

function initValidate () {
  return new FormValidate("#signin-form", [{
    name: 'login',
    rules: 'required|loginname',
    errorElement: '#form-signin .form-loginname .text-danger'
  }, {
    name: 'password',
    rules: 'required|minlength:3',
    errorElement: '#form-signin .form-password .text-danger'
  }]);
}

export default function bootstrap() {
  $('body').addClass('page-signin');
  // console.log('bootstrap signin');
  const form = initValidate()
  bindSubmit(form);
}
