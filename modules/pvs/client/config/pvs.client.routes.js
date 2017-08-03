(function () {
  'use strict';

  angular
    .module('pvs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('pvs', {
        abstract: true,
        url: '/pvs',
        template: '<ui-view/>'
      })
      .state('pvs.list', {
        url: '',
        templateUrl: 'modules/pvs/client/views/list-pvs.client.view.html',
        controller: 'PvsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Pvs List'
        }
      })
      .state('pvs.create', {
        url: '/create',
        templateUrl: 'modules/pvs/client/views/form-pv.client.view.html',
        controller: 'PvsController',
        controllerAs: 'vm',
        resolve: {
          pvResolve: newPv
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Pvs Create'
        }
      })
      .state('pvs.edit', {
        url: '/:pvId/edit',
        templateUrl: 'modules/pvs/client/views/form-pv.client.view.html',
        controller: 'PvsController',
        controllerAs: 'vm',
        resolve: {
          pvResolve: getPv
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Pv {{ pvResolve.name }}'
        }
      })
      .state('pvs.view', {
        url: '/:pvId',
        templateUrl: 'modules/pvs/client/views/view-pv.client.view.html',
        controller: 'PvsController',
        controllerAs: 'vm',
        resolve: {
          pvResolve: getPv
        },
        data: {
          pageTitle: 'Pv {{ pvResolve.name }}'
        }
      });
  }

  getPv.$inject = ['$stateParams', 'PvsService'];

  function getPv($stateParams, PvsService) {
    return PvsService.get({
      pvId: $stateParams.pvId
    }).$promise;
  }

  newPv.$inject = ['PvsService'];

  function newPv(PvsService) {
    return new PvsService();
  }
}());
