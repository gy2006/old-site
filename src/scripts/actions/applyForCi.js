import analysis from './analysis';

function noop () {}

export default function (fields, callback = noop) {
  analysis.event.applyCi(fields, callback);
}