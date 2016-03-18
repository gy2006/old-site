import $ from 'jquery';
import saveAccessToken from './saveAccessToken';
import Errors from './errors';
import form from './form';

const USERNAME = 'username';
const EMAIL = 'email';
const SIGN = 'sign';
const PASSWORD = 'password';

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
  const $form = form(this);
  if (!$form.isValid()) {
    const error = $form.getError();
    console.error(error);
    return;
  }
  const field = $form.getField();
  return createUser(field);
}

function getSearch () {
  const search = location.search;
  const params = {};
  const reg = /([\w\d]+)\=([^&]*)/g;
  let maxLoop = 10;
  while(reg.test(search) && maxLoop > 0) {
    params[RegExp.$1] = decodeURIComponent(RegExp.$2);
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
  if (params.sign) {
    $(`#${SIGN}`).val(params.sign);
  }
  if (params.email) {
    $(`#${EMAIL}`).val(params.email);
  }
  $('#form-signup').submit(handlerSubmit);
}
$(injectQuery);
export default {};
