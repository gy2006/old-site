import $ from 'jquery';
import { COOKIE_KEY, GETUSER_URL, SIGNUP_URL, FORGET_PASSWORD_URL } from '../constant';
import analysis from './analysis';
import saveAccessToken from './saveAccessToken';
import redirectToDashboard from './redirectToDashboard';
import { get as getCookie, clear as clearCookie } from '../util/cookies';
import getSearch from '../util/getSearch';

export function getUserToken () {
  return getCookie(COOKIE_KEY);
}

export function removeUserToken () {
  return clearCookie(COOKIE_KEY);
}

export function get (userToken) {
  const token = userToken || getUserToken();
  return $.ajax(`${GETUSER_URL}?access_token=${token}`, {
    method: 'get'
  });
}

export function test (userToken) {
  const token = userToken || getUserToken();
  return $.ajax(`${GETUSER_URL}?access_token=${token}`, {
    method: 'head'
  });
}

export function create (user) {
  const urlParams = getSearch();

  return $.post({
    url: SIGNUP_URL,
    data: user
  }).done(function (resp) {
    const accessToken = resp.access_token;
    saveAccessToken(accessToken);
    analysis.event.signUp(user, urlParams, function () {
      redirectToDashboard(accessToken);
    });
  });
}

export function forgetPassword (email) {
  return $.post({
    url: FORGET_PASSWORD_URL,
    data: {
      email
    }
  });
}
export default {
  get: get,
  test: test,
  create: create,
  getUserToken,
  removeUserToken,
  forgetPassword
};
