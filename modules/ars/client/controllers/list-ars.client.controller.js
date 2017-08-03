(function () {
  'use strict';

  angular
    .module('ars')
    .controller('ArsListController', ArsListController);

  ArsListController.$inject = ['ArsService'];

  function ArsListController(ArsService) {
    var vm = this;

    vm.ars = ArsService.query();
  }
}());
