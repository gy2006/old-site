import mixpanel from 'mixpanel-browser';

export default function (fields) {
  return mixpanel.track('apply for ci', fields);
}