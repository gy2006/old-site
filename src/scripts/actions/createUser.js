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
    const error = e.responseJSON;
    if (typeof error.errors === 'string') {
      alert(Errors[error.code]);
    } else if (typeof error.errors === 'object') {
      const field = Object.keys(error.errors)[0];
      if (field) {
        alert(error.errors[field][0]);
      } else {
        alert(JSON.stringify(error.errors));
      }
    }
  })
}
