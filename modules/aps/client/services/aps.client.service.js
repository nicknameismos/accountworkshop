// Aps service used to communicate Aps REST endpoints
(function () {
  'use strict';

  angular
    .module('aps')
    .factory('ApsService', ApsService);

  ApsService.$inject = ['$resource'];

  function ApsService($resource) {
    return $resource('api/aps/:apId', {
      apId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
