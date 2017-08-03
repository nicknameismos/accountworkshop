(function () {
  'use strict';

  angular
    .module('jvs')
    .controller('JvsListController', JvsListController);

  JvsListController.$inject = ['JvsService'];

  function JvsListController(JvsService) {
    var vm = this;

    vm.jvs = JvsService.query();
  }
}());
