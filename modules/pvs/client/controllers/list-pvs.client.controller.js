(function () {
  'use strict';

  angular
    .module('pvs')
    .controller('PvsListController', PvsListController);

  PvsListController.$inject = ['PvsService'];

  function PvsListController(PvsService) {
    var vm = this;

    vm.pvs = PvsService.query();
  }
}());
