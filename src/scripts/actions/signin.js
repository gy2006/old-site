import $ from 'jquery';
import saveAccessToken from './saveAccessToken';
import { SIGNIN_URL } from '../constant';
import Errors from '../errors';
import redirect from './redirect';
import analysis from './analysis';
import User from './user';
export default function signIn (data) {

  return $.post(SIGNIN_URL, data).done((resp) => {
    const accessToken = resp.access_token;
    saveAccessToken(accessToken);

    User.get(accessToken).done(function (user) {
      analysis.identify(user.email);
      analysis.people.increment('signed_in', 1, function () {
        redirect(accessToken);
      });
    })

    // redirect to dashboard;
  }).fail((error)=>{
    alert(Errors[error.responseJSON.code]);
  });

}