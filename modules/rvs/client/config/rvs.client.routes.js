(function () {
  'use strict';

  angular
    .module('rvs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('rvs', {
        abstract: true,
        url: '/rvs',
        template: '<ui-view/>'
      })
      .state('rvs.list', {
        url: '',
        templateUrl: 'modules/rvs/client/views/list-rvs.client.view.html',
        controller: 'RvsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Rvs List'
        }
      })
      .state('rvs.create', {
        url: '/create',
        templateUrl: 'modules/rvs/client/views/form-rv.client.view.html',
        controller: 'RvsController',
        controllerAs: 'vm',
        resolve: {
          rvResolve: newRv
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Rvs Create'
        }
      })
      .state('rvs.edit', {
        url: '/:rvId/edit',
        templateUrl: 'modules/rvs/client/views/form-rv.client.view.html',
        controller: 'RvsController',
        controllerAs: 'vm',
        resolve: {
          rvResolve: getRv
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Rv {{ rvResolve.name }}'
        }
      })
      .state('rvs.view', {
        url: '/:rvId',
        templateUrl: 'modules/rvs/client/views/view-rv.client.view.html',
        controller: 'RvsController',
        controllerAs: 'vm',
        resolve: {
          rvResolve: getRv
        },
        data: {
          pageTitle: 'Rv {{ rvResolve.name }}'
        }
      });
  }

  getRv.$inject = ['$stateParams', 'RvsService'];

  function getRv($stateParams, RvsService) {
    return RvsService.get({
      rvId: $stateParams.rvId
    }).$promise;
  }

  newRv.$inject = ['RvsService'];

  function newRv(RvsService) {
    return new RvsService();
  }
}());
