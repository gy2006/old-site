import $ from 'jquery';
import { GETUSER_URL } from '../constant';
import analysis from './analysis';

export function getUser (token) {
  return $.ajax(`${GETUSER_URL}?access_token=${token}`, {
    method: 'get'
  });
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
