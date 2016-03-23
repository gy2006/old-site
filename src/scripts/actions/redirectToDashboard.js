export default function redirect (accessToken) {
  window.location = __TARGET__ === 'local' ? `${__DASHBOARD_URL__}?access_token=${accessToken}` : __DASHBOARD_URL__;
}

