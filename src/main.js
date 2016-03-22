import './styles/main.scss';
import $ from 'jquery';
import { get as getCookie } from './scripts/util/cookies';
import getUser from './scripts/actions/getUser';
import redirect from './scripts/actions/redirect';

import home from './scripts/home';
import signin from './scripts/signin';
import signup from './scripts/signup';

import analysis from './scripts/actions/analysis';

import FormValidate from './scripts/validate';
import FormErrorHandler from './scripts/validate/plugin';
import {COOKIE_KEY, EMAIL_REG, USERNAME_REG } from './scripts/constant';

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

FormErrorHandler.setRulesMap({
  username: 'Invalid Username',
  loginname: 'Must Username or Email'
})

function redirectToFlow (token) {
  return function (){
    // console.log('redirect to flow');
    redirect(token);
  }
}

function bootstrap () {
  const path = location.pathname;
  const token = getCookie(COOKIE_KEY);
  console.log('token', token);
  let user;
  if (token) {
    user = getUser(token);
  }

  if (/^\/signup(\.html)?/.test(path)) {
    // signup
    user && user.done(redirectToFlow(token));
    signup();
  } else if (/^\/signin(\.html)?/.test(path)) {
    // signin
    user && user.done(redirectToFlow(token));
    signin();
  } else {
    // home
    home();
  }
}



$(bootstrap);

export default {};
