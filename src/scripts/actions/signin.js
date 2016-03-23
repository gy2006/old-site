import $ from 'jquery';
import saveAccessToken from './saveAccessToken';
import { SIGNIN_URL } from '../constant';
import Errors from '../errors';
import redirect from './redirect';
import analysis from './analysis';

export default function signIn (data) {

  return $.post(SIGNIN_URL, data).done((resp) => {
    const accessToken = resp.access_token;
    saveAccessToken(accessToken);
    // can't get user email, no mixpanel increment signed_in
    redirect(accessToken);

    // redirect to dashboard;
  }).fail((error)=>{
    alert(Errors[error.responseJSON.code]);
  });

}