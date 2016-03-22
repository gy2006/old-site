import { save } from '../util/cookies';
import { COOKIE_KEY } from '../constant';

const saveAccessToken = (accessToken) => {
  save(COOKIE_KEY, accessToken);
};

export default saveAccessToken;
