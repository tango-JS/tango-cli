'use strict';

module.exports = {
  templateUrl: ('./app/<%= moduleNameLC %>/<%= moduleNameLC %>.template.html'),
  bindings: {},
  controller: <%= moduleNameUC %>Controller
}

<%= moduleNameUC %>Controller.$inject = [];

function <%= moduleNameUC %>Controller() {
  var vm = angular.extend(this, {
    msg: 'this is the message'
  });

  return init();

  /**
   * This is the init method
   */
  function init() {
    // init code here
  }
}