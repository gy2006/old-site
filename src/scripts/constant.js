export const EMAIL_REG = /^[a-zA-Z0-9_+.-]+\@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,6}/i;
// 已字母开头，数字或字母结尾
export const USERNAME_REG = /^[a-zA-Z]\w{1,13}[a-zA-Z0-9]$/;// /^[0-9a-zA-Z]{3,15}$/;

export const COOKIE_KEY = __TARGET__ === 'production' ? 'flow_session' : `flow_session_${__TARGET__}`;
export const REDIRECT_KEY = __TARGET__ === 'production' ? 'flow_previous_url' : `flow_${__TARGET__}_previous_url`;

export const SIGNIN_URL = `${__API__}/login`;
export const SIGNUP_URL = `${__API__}/signup`;
export const GETUSER_URL = `${__API__}/user`;