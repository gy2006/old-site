const COOKIE_KEY = __TARGET__ === 'production' ? 'flow_session' : `flow_session_${__TARGET__}`;
const COOKIE_MAXAGE = 7*24*60*60;
const COOKIE_DOMAIN = __TARGET__ === 'production' ? '' : '.lyon';

const saveAccessToken = (accessToken) {
  document.cookie = `${COOKIE_KEY}=${accessToken}; domain=${COOKIE_DOMAIN}.flow.ci; path='/'; max-age=${COOKIE_MAXAGE}`;
};

export default saveAccessToken;
