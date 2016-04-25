import './styles/main.scss';
import $ from 'jquery';
import './scripts/polyfill/assign';
import User from './scripts/actions/user';
import { getDashboardUrl } from './scripts/actions/redirectToDashboard';
import home from './scripts/home';
import signin from './scripts/signin';
import signup from './scripts/signup';

import analysis from './scripts/actions/analysis';

import FormValidate from './scripts/validate';
import { EMAIL_REG, USERNAME_REG } from './scripts/constant';
import browser from './scripts/util/browser';

analysis.init();
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
  username: 'Unsupported characters. Please use only use alphanumeric characters and underscore.',
  loginname: 'Incorrect email or username format'
});

function bootstrap () {
  const path = location.pathname;
  const token = User.getUserToken();
  const UNSPPORT_IE = 'Unspport IE, Please replace the browser.';
  if (token) {
    User.get(token).done(function (userInfo) {
      analysis.event.getUserSuccess(userInfo);
      $('.navbar .nav-sign').hide();
      const $navUser = $('.navbar .nav-user').removeClass('hide');
      const $navLink = $navUser.find('a');
      const $navAvator = $navUser.find('.avator');
      $navLink.attr('href', getDashboardUrl(token));
      $navAvator.attr('src', userInfo.avatar);
    }).fail(function () {
      User.removeUserToken();
    });
  }
  analysis.pageView();

  let shouldAlert = false;
  if (/^\/signup(\.html)?/.test(path)) {
    // signup
    browser.isIE ? (shouldAlert = true) : signup();
  } else if (/^\/signin(\.html)?/.test(path)) {
    // signin
    browser.isIE ? (shouldAlert = true) : signin();
  } else if (path === '/') {
    // home
    browser.isIE ? (shouldAlert = true) : home();
  }
  if (shouldAlert) {
    alert(UNSPPORT_IE);
    $('form input[type="submit"]').click(() => {
      alert(UNSPPORT_IE);
    });
    return;
  }
}

$(bootstrap);

export default {};
