import {
  get as getCookie,
  clear as clearCookie
} from '../util/cookies';
import { REDIRECT_KEY } from '../constant';

function getDefaultUrl (accessToken) {
  return __TARGET__ === 'local' ? `${__DASHBOARD_URL__}?access_token=${accessToken}` : __DASHBOARD_URL__;
}

export default function redirectToDashboard (accessToken) {
  let url = getCookie(REDIRECT_KEY);
  url && clearCookie(REDIRECT_KEY);

  if (!url || url.indexOf(__DASHBOARD_URL__) !== 0) {
    url = getDefaultUrl(accessToken);
  }

  window.location = url;
}

