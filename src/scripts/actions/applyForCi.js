import analysis from './analysis';
import User from './user';

function noop () {}

export default function (fields, callback = noop) {
  analysis.event.applyCi(fields, User.getUserToken(), callback);
}