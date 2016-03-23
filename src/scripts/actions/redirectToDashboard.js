import {
  get as getCookie,
  clear as clearCookie
} from '../util/cookies';
import { REDIRECT_KEY } from '../constant';

export default function redirect (accessToken) {
  let redirectUrl = getCookie(REDIRECT_KEY);

  if (redirectUrl) {
    redirectUrl = decodeURIComponent(redirectUrl);
    if (redirectUrl.indexOf(__DASHBOARD_URL__) === 0) {
      redirectUrl = redirectUrl;
    } else {
      redirectUrl = __TARGET__ === 'local' ? `${__DASHBOARD_URL__}?access_token=${accessToken}` : __DASHBOARD_URL__;
    }
    clearCookie(REDIRECT_KEY);
  } else {
    redirectUrl = __TARGET__ === 'local' ? `${__DASHBOARD_URL__}?access_token=${accessToken}` : __DASHBOARD_URL__;
  }

  window.location = redirectUrl;
}

