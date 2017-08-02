(function () {
  'use strict';

  angular
    .module('aps')
    .controller('ApsListController', ApsListController);

  ApsListController.$inject = ['ApsService'];

  function ApsListController(ApsService) {
    var vm = this;

    vm.aps = ApsService.query();
  }
}());
