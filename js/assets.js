(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.main = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/******************************************************************************\

                    Copyright 2001-2015. Stanford University.
                              All Rights Reserved.

                  For information regarding this software email:
                                 Joseph Coffland
                          joseph@cauldrondevelopment.com

\******************************************************************************/

'use strict'


module.exports = new Vue({
  el: 'body',
  data: {currentPage: 'loading'},


  components: {
    'loading-page': {template: '<h1>Loading...</h1>'},
    'results-page': require('./results'),
    'team-page': require('./team'),
    'donor-page': require('./donor'),
    'os-page': require('./os'),
    'api-page': {template: "#api-page-template"}
  },


  ready: function () {
    var self = this;

    function route(ctx, page) {
      self.currentPage = page;
      self.target = ctx.target;
    }

    page(function (ctx, next) {
      Vue.nextTick(function () {self.$broadcast('update')});
      next();
    });
    page('*/api', function (ctx) {route(ctx, 'api')});
    page('*/os', function (ctx) {route(ctx, 'os')});
    page('*/donor/:donor', function (ctx) {route(ctx, 'donor')});
    page('*/team/:team', function (ctx) {route(ctx, 'team')});
    page('*/:page', function (ctx) {route(ctx, 'results')});
    page(function () {page.redirect('./teams-monthly')});
    page();
  }
})

},{"./donor":2,"./os":4,"./results":6,"./team":7}],2:[function(require,module,exports){
/******************************************************************************\

                    Copyright 2001-2015. Stanford University.
                              All Rights Reserved.

                  For information regarding this software email:
                                 Joseph Coffland
                          joseph@cauldrondevelopment.com

\******************************************************************************/

'use strict'


module.exports = {
  template: '#donor-page-template',


  data: function () {
    return {message: 'Loading donor info...'}
  },


  ready: function () {
    var donor = location.href.split('/').pop();
    if (donor == '') donor = 'anonymous';

    $.get('api/donor/' + donor).done(function (data) {
      for (var key in data) this.$set(key, data[key]);
      this.message = ''

    }.bind(this)).fail(function (jqXHR, status, error) {
      this.message = error

    }.bind(this));
  }
}

},{}],3:[function(require,module,exports){
/******************************************************************************\

                    Copyright 2001-2015. Stanford University.
                              All Rights Reserved.

                  For information regarding this software email:
                                 Joseph Coffland
                          joseph@cauldrondevelopment.com

\******************************************************************************/

'use strict'


$(function () {
  // Detect incompatible browsers
  if (!Object.defineProperty) {
    $('#incompatible-browser')
      .show()
      .find('.page-content')
      .append(
        $('<button>')
          .addClass('success')
          .text('Update')
          .click(function () {location = 'http://whatbrowser.org/'})
      )

    return
  }

  // Vue debugging
  Vue.config.debug = true;
  //Vue.util.warn = function (msg) {console.debug('[Vue warn]: ' + msg)}

  Vue.filter('human_int', function (value) {
    if (typeof value == 'undefined') return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  });

  Vue.component('results-table', require('./results-table'));

  // Vue app
  require('./app');
})

},{"./app":1,"./results-table":5}],4:[function(require,module,exports){
/******************************************************************************\

                    Copyright 2001-2015. Stanford University.
                              All Rights Reserved.

                  For information regarding this software email:
                                 Joseph Coffland
                          joseph@cauldrondevelopment.com

\******************************************************************************/

'use strict'


module.exports = {
  template: '#os-page-template',


  data: function () {
    return {message: 'Loading OS stats...'}
  },


  ready: function () {
    $.get('api/os').done(function (data) {
      for (var key in data) this.$set(key, data[key]);
      this.message = ''

    }.bind(this)).fail(function (jqXHR, status, error) {
      this.message = error

    }.bind(this));
  }
}

},{}],5:[function(require,module,exports){
/******************************************************************************\

                    Copyright 2001-2015. Stanford University.
                              All Rights Reserved.

                  For information regarding this software email:
                                 Joseph Coffland
                          joseph@cauldrondevelopment.com

\******************************************************************************/

'use strict'


module.exports = {
  template: '#results-table-template',
  props: ['results', 'description'],

  components: {
    'result-row': {
      template: '#result-row-template',
      props: ['rank', 'data'],


      methods: {
        change: function () {
          var rank = this.data.rank;
          var prev_rank = this.data.prev_rank;

          if (typeof prev_rank == undefined) return;
          if (rank == prev_rank) return "No change";

          return (rank < prev_rank ? 'Up ' : 'Down ') +
            Math.abs(prev_rank - rank);
        }
      }
    }
  }
}

},{}],6:[function(require,module,exports){
/******************************************************************************\

                    Copyright 2001-2015. Stanford University.
                              All Rights Reserved.

                  For information regarding this software email:
                                 Joseph Coffland
                          joseph@cauldrondevelopment.com

\******************************************************************************/

'use strict'


module.exports = {
  template: '#results-page-template',


  data: function () {
    return {
      query: '',
      monthly: false,
      month_year: '',
      description: '',
      search_type: '',
      name: '',
      passkey: '',
      team: '',
      results: []
    }
  },


  events: {
    update: function () {this.update()}
  },


  ready: function () {
    this.update()
  },


  methods: {
    update: function (data) {
      var query = location.href.split('/').pop();
      if (query == '') query = 'teams-monthly'

      this.results = []
      this.description = 'Loading...'

      $.get('api/' + query, data).done(function (data) {
        for (var key in data) this.$set(key, data[key]);

        this.month_year = moment.months(this.month - 1) + ', ' + this.year;

      }.bind(this)).fail(function (jqXHR, status, error) {
        this.description = error
      }.bind(this))
    },


    next: function () {
      if (this.month < 12) this.month++;
      else {
        this.year++
        this.month = 0;
      }

      this.search()
    },


    prev: function () {
      if (1 < this.month) this.month--;
      else {
        this.year--
        this.month = 12;
      }

      this.search()
    },


    search: function () {
      this.update({
        name: this.name,
        search_type: this.search_type,
        passkey: this.passkey,
        team: this.team,
        month: this.month,
        year: this.year
      });
    }
  }
}

},{}],7:[function(require,module,exports){
/******************************************************************************\

                    Copyright 2001-2015. Stanford University.
                              All Rights Reserved.

                  For information regarding this software email:
                                 Joseph Coffland
                          joseph@cauldrondevelopment.com

\******************************************************************************/

'use strict'


module.exports = {
  template: '#team-page-template',


  data: function () {
    return {message: 'Loading team info...'}
  },


  ready: function () {
    var team = location.href.split('/').pop();
    if (team == '') team = 0;
    else team = parseInt(team);

    $.get('api/team/' + team).done(function (data) {
      for (var key in data) this.$set(key, data[key]);
      this.message = ''

    }.bind(this)).fail(function (jqXHR, status, error) {
      this.message = error

    }.bind(this));
  }
}

},{}]},{},[3])(3)
});