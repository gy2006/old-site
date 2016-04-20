import { save } from '../util/cookies';
import { COOKIE_KEY, SESSION_COOKIE_CONFIG } from '../constant';

const saveAccessToken = (accessToken) => {
  save(COOKIE_KEY, accessToken, SESSION_COOKIE_CONFIG);
};

export default saveAccessToken;
