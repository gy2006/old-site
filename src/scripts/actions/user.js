import $ from 'jquery';
import { GETUSER_URL } from '../constant';
import analysis from './analysis';

let USER;
let PREV_TOKEN;
export function getUser (token) {
  if (USER && PREV_TOKEN === token) {
    return USER;
  }
  PREV_TOKEN = token;
  return $.ajax(`${GETUSER_URL}?access_token=${token}`, {
    method: 'get'
  }).done((resp)=>{
    USER = resp;
  })
}
export function testUser(token) {
  return $.ajax(`${GETUSER_URL}?access_token=${token}`, {
    method: 'head'
  })
}

export default {
  get: getUser,
  test: testUser
}