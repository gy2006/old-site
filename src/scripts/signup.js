import $ from 'jquery';
import FormValidate from './validate';
import User from './actions/user';
import analysis from './actions/analysis';
import getSearch from './util/getSearch';


function bindSubmit(form) {
  const search = getSearch();
  function handlerSubmit (e) {
    e.preventDefault();
    // console.log('enter home submit', form.getValues());
    const fields = form.getValues();

    User.create(fields, !!search.project_id);
  }
  form.$form.submit(handlerSubmit);
}

function initValidate () {
  return new FormValidate("#signup-form", [{
    name: 'email',
    rules: 'required|email'
  }, {
    name: 'username',
    rules: 'required|minlength:3'
  }, {
    name: 'password',
    rules: 'required| minlength:3'
  }, {
    name: 'sign',
    rules: 'required'
  }]);
}

function injectSeach () {
  const params = getSearch();
  if (params.email) {
    $('#email').val(params.email);
  }
  if (params.sign) {
    $("#sign").val(params.sign);
  }
  if (params.email && params.sign) {
    analysis.track('Confirm Email ', {
      distinct_id: params.email
    });
  }
}
export default function bootstrap () {
  $('body').addClass('page-signup');
  // console.log('bootstrap signup');
  injectSeach();
  const form = initValidate()
  bindSubmit(form);
}
