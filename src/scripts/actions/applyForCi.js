import analysis from './analysis';

function noop () {}

export default function (fields, noAlias, callback = noop) {
  analysis.event.applyCi(fields, noAlias, callback);
}