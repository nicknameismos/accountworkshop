(function () {
  'use strict';

  // Expends controller
  angular
    .module('expends')
    .controller('ExpendsController', ExpendsController);

  ExpendsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'expendResolve'];

  function ExpendsController ($scope, $state, $window, Authentication, expend) {
    var vm = this;

    vm.authentication = Authentication;
    vm.expend = expend;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Expend
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.expend.$remove($state.go('expends.list'));
      }
    }

    // Save Expend
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.expendForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.expend._id) {
        vm.expend.$update(successCallback, errorCallback);
      } else {
        vm.expend.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('expends.view', {
          expendId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
