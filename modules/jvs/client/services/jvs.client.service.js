// Jvs service used to communicate Jvs REST endpoints
(function () {
  'use strict';

  angular
    .module('jvs')
    .factory('JvsService', JvsService);

  JvsService.$inject = ['$resource'];

  function JvsService($resource) {
    return $resource('api/jvs/:jvId', {
      jvId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
