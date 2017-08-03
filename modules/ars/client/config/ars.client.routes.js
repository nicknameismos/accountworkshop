(function () {
  'use strict';

  angular
    .module('ars')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('ars', {
        abstract: true,
        url: '/ars',
        template: '<ui-view/>'
      })
      .state('ars.list', {
        url: '',
        templateUrl: 'modules/ars/client/views/list-ars.client.view.html',
        controller: 'ArsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Ars List'
        }
      })
      .state('ars.create', {
        url: '/create',
        templateUrl: 'modules/ars/client/views/form-ar.client.view.html',
        controller: 'ArsController',
        controllerAs: 'vm',
        resolve: {
          arResolve: newAr
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Ars Create'
        }
      })
      .state('ars.edit', {
        url: '/:arId/edit',
        templateUrl: 'modules/ars/client/views/form-ar.client.view.html',
        controller: 'ArsController',
        controllerAs: 'vm',
        resolve: {
          arResolve: getAr
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Ar {{ arResolve.name }}'
        }
      })
      .state('ars.view', {
        url: '/:arId',
        templateUrl: 'modules/ars/client/views/view-ar.client.view.html',
        controller: 'ArsController',
        controllerAs: 'vm',
        resolve: {
          arResolve: getAr
        },
        data: {
          pageTitle: 'Ar {{ arResolve.name }}'
        }
      });
  }

  getAr.$inject = ['$stateParams', 'ArsService'];

  function getAr($stateParams, ArsService) {
    return ArsService.get({
      arId: $stateParams.arId
    }).$promise;
  }

  newAr.$inject = ['ArsService'];

  function newAr(ArsService) {
    return new ArsService();
  }
}());
