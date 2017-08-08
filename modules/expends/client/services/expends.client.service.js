// Expends service used to communicate Expends REST endpoints
(function () {
  'use strict';

  angular
    .module('expends')
    .factory('ExpendsService', ExpendsService);

  ExpendsService.$inject = ['$resource'];

  function ExpendsService($resource) {
    return $resource('api/expends/:expendId', {
      expendId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
