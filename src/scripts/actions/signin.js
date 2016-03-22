import $ from 'jquery';
import saveAccessToken from './saveAccessToken';
import { SIGNIN_URL } from '../constant';
import Errors from '../errors';
import redirect from './redirect';

export default function signIn (data) {

  return $.post(SIGNIN_URL, data).done((resp) => {
    const accessToken = resp.access_token;
    saveAccessToken(accessToken);
    redirect(accessToken);
    // redirect to dashboard;
  }).fail((error)=>{
    alert(Errors[error.responseJSON.code]);
  });

}