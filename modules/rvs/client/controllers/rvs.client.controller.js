(function () {
  'use strict';

  // Rvs controller
  angular
    .module('rvs')
    .controller('RvsController', RvsController);

  RvsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'rvResolve'];

  function RvsController ($scope, $state, $window, Authentication, rv) {
    var vm = this;

    vm.authentication = Authentication;
    vm.rv = rv;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Rv
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.rv.$remove($state.go('rvs.list'));
      }
    }

    // Save Rv
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.rvForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.rv._id) {
        vm.rv.$update(successCallback, errorCallback);
      } else {
        vm.rv.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('rvs.view', {
          rvId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
