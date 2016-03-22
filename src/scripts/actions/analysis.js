import mixpanel from 'mixpanel-browser';

export default {
  init: function () {
    return mixpanel.init.apply(mixpanel, arguments);
  },
  identify: function () {
    return mixpanel.identify.apply(mixpanel, arguments);
  },
  track: function () {
    return mixpanel.track.apply(mixpanel, arguments);
  },
  people:{
    set: function () {
      return mixpanel.people.set.apply(mixpanel.people, arguments);
    },
    set_once: function () {
      return mixpanel.people.set_once.apply(mixpanel.people, arguments);
    },
    increment: function () {
      return mixpanel.people.increment.apply(mixpanel.people, arguments);
    }
  }
}