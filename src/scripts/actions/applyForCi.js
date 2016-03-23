import analysis from './analysis';

export default function (fields) {
  analysis.identify(fields.email);
  analysis.people.set_once({
    '$email': fields.email,
    'Apply_At': new Date(),
    'Application': ''
  });
  analysis.people.set({
    'User_Infomation': fields.user_infomation
  });
  return analysis.track('Input Email', fields);
}