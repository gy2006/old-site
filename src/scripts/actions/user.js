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

export function create (user, isInvited) {
  return $.post({
    url: SIGNUP_URL,
    data: user
  }).done(function (resp) {
    const accessToken = resp.access_token;
    saveAccessToken(accessToken);

    analysis.identify(user.email);
    analysis.people.set({
      '$first_name': user.username,
      '$created': new Date(),
      '$email': user.email,
      'buildtimes': 0,
      'Application': 'Passed'
    });
    analysis.track('Sign up', {
      distinct_id: user.email,
      Invited: isInvited ? 'YES' : 'NO'
    }, function () {
      redirectToDashboard(accessToken);
      // console.log('redirect');
    });
  });
}

export default {
  get: get,
  test: test,
  create: create
}
