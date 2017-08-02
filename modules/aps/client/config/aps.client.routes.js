(function () {
  'use strict';

  angular
    .module('aps')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('aps', {
        abstract: true,
        url: '/aps',
        template: '<ui-view/>'
      })
      .state('aps.list', {
        url: '',
        templateUrl: 'modules/aps/client/views/list-aps.client.view.html',
        controller: 'ApsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Aps List'
        }
      })
      .state('aps.create', {
        url: '/create',
        templateUrl: 'modules/aps/client/views/form-ap.client.view.html',
        controller: 'ApsController',
        controllerAs: 'vm',
        resolve: {
          apResolve: newAp
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Aps Create'
        }
      })
      .state('aps.edit', {
        url: '/:apId/edit',
        templateUrl: 'modules/aps/client/views/form-ap.client.view.html',
        controller: 'ApsController',
        controllerAs: 'vm',
        resolve: {
          apResolve: getAp
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Ap {{ apResolve.name }}'
        }
      })
      .state('aps.view', {
        url: '/:apId',
        templateUrl: 'modules/aps/client/views/view-ap.client.view.html',
        controller: 'ApsController',
        controllerAs: 'vm',
        resolve: {
          apResolve: getAp
        },
        data: {
          pageTitle: 'Ap {{ apResolve.name }}'
        }
      });
  }

  getAp.$inject = ['$stateParams', 'ApsService'];

  function getAp($stateParams, ApsService) {
    return ApsService.get({
      apId: $stateParams.apId
    }).$promise;
  }

  newAp.$inject = ['ApsService'];

  function newAp(ApsService) {
    return new ApsService();
  }
}());
