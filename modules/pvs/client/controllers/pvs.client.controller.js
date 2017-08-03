(function () {
  'use strict';

  // Pvs controller
  angular
    .module('pvs')
    .controller('PvsController', PvsController);

  PvsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'pvResolve'];

  function PvsController ($scope, $state, $window, Authentication, pv) {
    var vm = this;

    vm.authentication = Authentication;
    vm.pv = pv;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Pv
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.pv.$remove($state.go('pvs.list'));
      }
    }

    // Save Pv
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.pvForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.pv._id) {
        vm.pv.$update(successCallback, errorCallback);
      } else {
        vm.pv.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('pvs.view', {
          pvId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
