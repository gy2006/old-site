import analysis from './analysis';

export default function (fields) {
  analysis.identify(fields.email);
  analysis.people.set_once({
    '$initial_referrer': document.referrer,
    '$email': fields.email,
    'apply_at': new Date()
  });
  return analysis.track('Input Email', fields);
}