// Pvs service used to communicate Pvs REST endpoints
(function () {
  'use strict';

  angular
    .module('pvs')
    .factory('PvsService', PvsService);

  PvsService.$inject = ['$resource'];

  function PvsService($resource) {
    return $resource('api/pvs/:pvId', {
      pvId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
