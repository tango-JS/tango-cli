'use strict';

var angular = require('angular');
var <%= moduleNameUC %>Component = require('./<%= moduleNameLC %>.component');

angular.module('App.<%= moduleNameUC %>', [])
  .config(config)
  .component('<%= moduleNameLC %>', <%= moduleNameUC %>Component)

config.$inject = [
  '$stateProvider'
];

function config($stateProvider) {
  $stateProvider
    .state('<%= moduleNameLC %>', {
      url: '/',
      template: '<<%= moduleNameLC %>></<%= moduleNameLC %>>'
    });
}
