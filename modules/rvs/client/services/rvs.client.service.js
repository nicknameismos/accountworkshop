// Rvs service used to communicate Rvs REST endpoints
(function () {
  'use strict';

  angular
    .module('rvs')
    .factory('RvsService', RvsService);

  RvsService.$inject = ['$resource'];

  function RvsService($resource) {
    return $resource('api/rvs/:rvId', {
      rvId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
