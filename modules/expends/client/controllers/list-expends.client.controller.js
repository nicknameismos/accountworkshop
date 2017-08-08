(function () {
  'use strict';

  angular
    .module('expends')
    .controller('ExpendsListController', ExpendsListController);

  ExpendsListController.$inject = ['ExpendsService'];

  function ExpendsListController(ExpendsService) {
    var vm = this;

    vm.expends = ExpendsService.query();
  }
}());
