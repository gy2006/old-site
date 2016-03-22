import $ from 'jquery';
import Errors from '../errors';
import saveAccessToken from './saveAccessToken';
import { SIGNUP_URL } from '../constant';
import redirect from './redirect';
import analysis from './analysis';

export default function createUser (user, isInvited) {
  return $.post({
    url: SIGNUP_URL,
    data: user
  }).done(function (resp) {

    analysis.track('Signup', {
      distinct_id: user.email,
      Invited: isInvited ? 'YES' : 'NO'
    });

    const accessToken = resp.access_token;
    saveAccessToken(accessToken);
    redirect(accessToken);
    // redirect to dashboard;
  }).fail(function (e) {
    alert(Errors[e.responseJSON.code]);
  })
}