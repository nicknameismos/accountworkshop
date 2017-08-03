(function () {
  'use strict';

  // Ars controller
  angular
    .module('ars')
    .controller('ArsController', ArsController);

  ArsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'arResolve'];

  function ArsController ($scope, $state, $window, Authentication, ar) {
    var vm = this;

    vm.authentication = Authentication;
    vm.ar = ar;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Ar
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.ar.$remove($state.go('ars.list'));
      }
    }

    // Save Ar
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.arForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.ar._id) {
        vm.ar.$update(successCallback, errorCallback);
      } else {
        vm.ar.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('ars.view', {
          arId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
