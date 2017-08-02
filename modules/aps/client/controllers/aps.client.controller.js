(function () {
  'use strict';

  // Aps controller
  angular
    .module('aps')
    .controller('ApsController', ApsController);

  ApsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'apResolve'];

  function ApsController ($scope, $state, $window, Authentication, ap) {
    var vm = this;

    vm.authentication = Authentication;
    vm.ap = ap;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Ap
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.ap.$remove($state.go('aps.list'));
      }
    }

    // Save Ap
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.apForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.ap._id) {
        vm.ap.$update(successCallback, errorCallback);
      } else {
        vm.ap.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('aps.view', {
          apId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
