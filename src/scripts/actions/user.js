import $ from 'jquery';
import { GETUSER_URL, SIGNUP_URL } from '../constant';
import analysis from './analysis';
import saveAccessToken from './saveAccessToken';
import redirectToDashboard from './redirectToDashboard';
import Errors from '../errors';


export function get (token) {
  return $.ajax(`${GETUSER_URL}?access_token=${token}`, {
    method: 'get'
  });
}
export function test (token) {
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
  create: create
}
