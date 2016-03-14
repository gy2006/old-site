import $ from 'jquery';
import saveAccessToken from './saveAccessToken';
import Errors from './errors';

const EMAIL_REG = /^[a-zA-Z0-9_+.-]+\@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,6}/i;
const USERNAME_REG = /^[0-9a-zA-Z]{3,15}$/;

const USERNAME = 'username';
const EMAIL = 'email';
const SIGN = 'sign';
const PASSWORD = 'password';

function validate (field) {
  const { email, sign, username, password } = field;
  const errors = {}

  if (!email) {
    errors.email = 'Required';
  } else if (!EMAIL_REG.test(email)) {
    errors.email = 'Invalid';
  }

  if (sign) {
    if (!username) {
      errors.username = 'Required';
    } else if (!USERNAME_REG.test(username)) {
      errors.username = 'Invalid, length >= 3';
    }
    if (!password) {
      errors.password = 'Required';
    } else if (password.length < 6) {
      errors.password = '6 characters minimum';
    }
  }
  return errors;
}
function isEmptyObject (obj) {
  let isEmpty = true;
  for (let v in obj) {
    isEmpty = false;
    break;
  }
  return isEmpty;
}
function createSignLink (field) {
  $.post({
    url: `${__API__}/signup_link`,
    data: field
  }).done(function(resp) {
    alert(`http://flow.ci/signup?sign=${resp.sign}&email=${resp.email}`);
  }).fail(function(e) {
    console.log('singup link error', e);
    alert(Errors[e.responseJSON.code]);
  })
}

function createUser (field) {
  $.post({
    url: `${__API__}/signup`,
    data: field
  }).done(function (resp) {
    const accessToken = resp.access_token;
    saveAccessToken(accessToken);
    window.location = __TARGET__ === 'local' ? `${__DASHBOARD_URL__}?access_token=${accessToken}` : __DASHBOARD_URL__;
  }).fail(function (e) {
    console.log('signup fail', e);
    alert(Errors[e.responseJSON.code]);
  })
}

function handlerSubmit (event) {
  event.preventDefault();
  const field = [USERNAME, EMAIL, SIGN, PASSWORD].reduce(function(obj, name) {
    let value = $(`#${name}`).val();
    if (value){
      obj[name] = value
    }
    return obj;
  }, {} );
  const errors = validate(field);
  if (!isEmptyObject(errors)) {
    // maybe pend error message
    console.log('field error', errors);
    return false;
  }

  if (field.sign) {
    return createUser(field);
  } else {
    return createSignLink(field)
  }
}

function getSearch () {
  const search = location.search;
  const params = {};
  const reg = /([\w\d]+)\=([^&]*)/g;
  let maxLoop = 10;
  while(reg.test(search) && maxLoop > 0) {
    params[RegExp.$1] = RegExp.$2;
    maxLoop--;
  }
  return params;
}

function injectQuery () {
  if (!$('#form-signup').length) {
    // not signup
    return;
  }
  const params = getSearch();
  for(var prop in params) {
    let value = params[prop];
    $(`#${prop}`).val(value);
  }
  if (!params.sign) {
    $(`#${USERNAME}`).hide();
    $(`#${PASSWORD}`).hide();
  }
  $('#form-signup').submit(handlerSubmit);
}
$(injectQuery);
export default {};
