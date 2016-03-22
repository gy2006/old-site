import $ from 'jquery';
import { GETUSER_URL } from '../constant';

let USER;
let PREV_TOKEN;
export default function (token) {
  // if (USER && PREV_TOKEN === token) {
  //   return USER;
  // }
  return $.ajax(`${GETUSER_URL}?access_token=${token}`, {
    method: 'head'
  }).done((resp)=>{
    USER = resp;
  })
}