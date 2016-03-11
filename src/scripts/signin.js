import $ from 'jquery';
import Errors from './errors';

const SIGNIN_URL = `${__API__}/login`;
const COOKIE_KEY = __TARGET__ === 'production' ? 'flow_session' : `flow_session_${__TARGET__}`;
const COOKIE_MAXAGE = 7*24*60*60;
const COOKIE_DOMAIN = __TARGET__ === 'production' ? '.flow.ci' : '.lyon.flow.ci';

const handleSignIn = (event) => {
  event.preventDefault();

  const data = ['login', 'password'].reduce((obj, field) => {
    obj[field] = $(`#${field}`).val();
    return obj;
  }, {})

  $.post(SIGNIN_URL, data)
    .done(resp => {
      const accessToken = resp.access_token;
      document.cookie = `${COOKIE_KEY}=${accessToken}; domain=${COOKIE_DOMAIN}.flow.ci; max-age=${COOKIE_MAXAGE}`;
      window.location = __TARGET__ === 'local' ? `${__DASHBOARD_URL__}?access_token=${accessToken}` : __DASHBOARD_URL__;
    })
    .fail(error => {
      alert(Errors[error.responseJSON.code]);
    });
};

$('#form-signin').submit(handleSignIn);

export default {};
