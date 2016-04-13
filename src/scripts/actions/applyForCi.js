import analysis from './analysis';

function noop () {}

export default function (fields, callback = noop) {
  analysis.people.set_once({
    '$email': fields.email,
    'Apply_At': new Date(),
    'Application': 'apply'
  });
  analysis.people.set({
    'User_Infomation': fields.user_infomation
  });
  return analysis.track('Input Email', fields, callback);
}