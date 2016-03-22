import $ from 'jquery';
import { GETUSER_URL } from '../constant';
import analysis from './analysis';

let USER;
let PREV_TOKEN;
export default function (token) {
  // if (USER && PREV_TOKEN === token) {
  //   return USER;
  // }
  return $.ajax(`${GETUSER_URL}?access_token=${token}`, {
    method: 'get'
  }).done((resp)=>{
    USER = resp;
    analysis.identify(resp.email);
  })
}