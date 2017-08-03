(function () {
  'use strict';

  angular
    .module('rvs')
    .controller('RvsListController', RvsListController);

  RvsListController.$inject = ['RvsService'];

  function RvsListController(RvsService) {
    var vm = this;

    vm.rvs = RvsService.query();
  }
}());
