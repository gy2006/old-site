import $ from 'jquery';
import { COOKIE_KEY, GETUSER_URL, SIGNUP_URL } from '../constant';
import analysis from './analysis';
import saveAccessToken from './saveAccessToken';
import redirectToDashboard from './redirectToDashboard';
import Errors from '../errors';
import { get as getCookie } from '../util/cookies';

export function getUserToken () {
  return getCookie(COOKIE_KEY);
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
  })
}

export function create (user, urlParams) {
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

export default {
  get: get,
  test: test,
  create: create,
  getUserToken
}
