import $ from 'jquery';
import Errors from './errors';
import saveAccessToken from './saveAccessToken';

const SIGNIN_URL = `${__API__}/login`;


const handleSignIn = (event) => {
  event.preventDefault();

  const data = ['login', 'password'].reduce((obj, field) => {
    obj[field] = $(`#${field}`).val();
    return obj;
  }, {})

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

$('#form-signin').submit(handleSignIn);

export default {};
