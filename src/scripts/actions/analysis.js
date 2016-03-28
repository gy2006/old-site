import mixpanel from 'mixpanel-browser';
import $ from 'jquery';

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
  pageView: function (property) {
    return mixpanel.track('Page View', $.extend({} ,{ path: location.pathname, protocol: location.protocol }, property));
  },
  time_event: function (timeName) {
    return mixpanel.time_event.apply(mixpanel, arguments);
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