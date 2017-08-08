(function () {
  'use strict';

  angular
    .module('expends')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('expends', {
        abstract: true,
        url: '/expends',
        template: '<ui-view/>'
      })
      .state('expends.list', {
        url: '',
        templateUrl: 'modules/expends/client/views/list-expends.client.view.html',
        controller: 'ExpendsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Expends List'
        }
      })
      .state('expends.create', {
        url: '/create',
        templateUrl: 'modules/expends/client/views/form-expend.client.view.html',
        controller: 'ExpendsController',
        controllerAs: 'vm',
        resolve: {
          expendResolve: newExpend
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Expends Create'
        }
      })
      .state('expends.edit', {
        url: '/:expendId/edit',
        templateUrl: 'modules/expends/client/views/form-expend.client.view.html',
        controller: 'ExpendsController',
        controllerAs: 'vm',
        resolve: {
          expendResolve: getExpend
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Expend {{ expendResolve.name }}'
        }
      })
      .state('expends.view', {
        url: '/:expendId',
        templateUrl: 'modules/expends/client/views/view-expend.client.view.html',
        controller: 'ExpendsController',
        controllerAs: 'vm',
        resolve: {
          expendResolve: getExpend
        },
        data: {
          pageTitle: 'Expend {{ expendResolve.name }}'
        }
      });
  }

  getExpend.$inject = ['$stateParams', 'ExpendsService'];

  function getExpend($stateParams, ExpendsService) {
    return ExpendsService.get({
      expendId: $stateParams.expendId
    }).$promise;
  }

  newExpend.$inject = ['ExpendsService'];

  function newExpend(ExpendsService) {
    return new ExpendsService();
  }
}());
