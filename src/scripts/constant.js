export const EMAIL_REG = /^[a-zA-Z0-9_+.-]+\@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,6}/i;
export const USERNAME_REG = /^[0-9a-zA-Z]{3,15}$/;

export const COOKIE_KEY = __TARGET__ === 'production' ? 'flow_session' : `flow_session_${__TARGET__}`;

export const SIGNIN_URL = `${__API__}/login`;
export const SIGNUP_URL = `${__API__}/signup`;
export const GETUSER_URL = `${__API__}/user`;