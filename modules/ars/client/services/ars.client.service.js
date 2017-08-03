// Ars service used to communicate Ars REST endpoints
(function () {
  'use strict';

  angular
    .module('ars')
    .factory('ArsService', ArsService);

  ArsService.$inject = ['$resource'];

  function ArsService($resource) {
    return $resource('api/ars/:arId', {
      arId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
