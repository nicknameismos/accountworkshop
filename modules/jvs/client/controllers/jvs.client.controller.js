(function () {
  'use strict';

  // Jvs controller
  angular
    .module('jvs')
    .controller('JvsController', JvsController);

  JvsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'jvResolve'];

  function JvsController ($scope, $state, $window, Authentication, jv) {
    var vm = this;

    vm.authentication = Authentication;
    vm.jv = jv;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Jv
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.jv.$remove($state.go('jvs.list'));
      }
    }

    // Save Jv
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.jvForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.jv._id) {
        vm.jv.$update(successCallback, errorCallback);
      } else {
        vm.jv.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('jvs.view', {
          jvId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
