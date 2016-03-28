import './styles/main.scss';
import './scripts/polyfill/assign';
import $ from 'jquery';
import { get as getCookie } from './scripts/util/cookies';
import User from './scripts/actions/user';
import redirectToDashboard from './scripts/actions/redirectToDashboard';

import home from './scripts/home';
import signin from './scripts/signin';
import signup from './scripts/signup';

import analysis from './scripts/actions/analysis';

import FormValidate from './scripts/validate';
import { COOKIE_KEY, EMAIL_REG, USERNAME_REG } from './scripts/constant';

analysis.init(__MIXPANEL_TOKEN__);

/*
  default set validator for FormValidate;
*/
FormValidate.setDefaultValidators({
  email: function (value) {
    return EMAIL_REG.test(value);
  },
  username: function (value) {
    return USERNAME_REG.test(value);
  },
  loginname: function (value) {
    return EMAIL_REG.test(value) || USERNAME_REG.test(value);
  }
});

FormValidate.setDefaultRulesMap({
  username: 'Invalid Username',
  loginname: 'Must Username or Email'
});

function redirectToFlow (token) {
  return function (){
    // console.log('redirect to flow');
    redirectToDashboard(token);
  }
}

function bootstrap () {
  const path = location.pathname;
  const token = getCookie(COOKIE_KEY);
  let user;
  if (token) {
    analysis.time_event('Auto Redirect')
    user = User.test(token);
    user.done(function () {
      // analysis.track('Auto Redirect', {}, redirectToFlow(token));
    }).fail(function () {
      analysis.track('Auto Redirect', { redirect: false, getUser: 'faild' });
    });
  } else {
    analysis.pageView();
  }

  if (/^\/signup(\.html)?/.test(path)) {
    // signup
    signup();
  } else if (/^\/signin(\.html)?/.test(path)) {
    // signin
    signin();
  } else {
    // home
    home();
  }
}



$(bootstrap);

export default {};
