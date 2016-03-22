import mixpanel from 'mixpanel-browser';

export default {
  init: function () {
    return mixpanel.init.apply(mixpanel, arguments);
  },
  track: function () {
    return mixpanel.track.apply(mixpanel, arguments);
  }
}