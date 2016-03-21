import $ from 'jquery';
import Errors from './errors';
import saveAccessToken from './saveAccessToken';
import form from './form';

const SIGNIN_URL = `${__API__}/login`;

const handleSignIn = (event) => {
  event.preventDefault();

  const $form = form($('#signin-form')[0]);

  if (!$form.isValid()) {
    const error = $form.getError();
    console.error(error);
    return;
  }
  const data = $form.getField();
  $.post(SIGNIN_URL, data)
    .done(resp => {
      const accessToken = resp.access_token;
      saveAccessToken(accessToken);
      window.location = __TARGET__ === 'local' ? `${__DASHBOARD_URL__}?access_token=${accessToken}` : __DASHBOARD_URL__;
    })
    .fail(error => {
      alert(Errors[error.responseJSON.code]);
    });
};

$(function(){
  if (/^\/signin(\.html)?/.test(location.pathname)) {
    $('body').addClass('page-signin');
    $('#signin-form').submit(handleSignIn);
  }
});

export default {};
