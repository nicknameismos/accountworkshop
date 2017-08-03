(function () {
  'use strict';

  angular
    .module('jvs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('jvs', {
        abstract: true,
        url: '/jvs',
        template: '<ui-view/>'
      })
      .state('jvs.list', {
        url: '',
        templateUrl: 'modules/jvs/client/views/list-jvs.client.view.html',
        controller: 'JvsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Jvs List'
        }
      })
      .state('jvs.create', {
        url: '/create',
        templateUrl: 'modules/jvs/client/views/form-jv.client.view.html',
        controller: 'JvsController',
        controllerAs: 'vm',
        resolve: {
          jvResolve: newJv
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Jvs Create'
        }
      })
      .state('jvs.edit', {
        url: '/:jvId/edit',
        templateUrl: 'modules/jvs/client/views/form-jv.client.view.html',
        controller: 'JvsController',
        controllerAs: 'vm',
        resolve: {
          jvResolve: getJv
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Jv {{ jvResolve.name }}'
        }
      })
      .state('jvs.view', {
        url: '/:jvId',
        templateUrl: 'modules/jvs/client/views/view-jv.client.view.html',
        controller: 'JvsController',
        controllerAs: 'vm',
        resolve: {
          jvResolve: getJv
        },
        data: {
          pageTitle: 'Jv {{ jvResolve.name }}'
        }
      });
  }

  getJv.$inject = ['$stateParams', 'JvsService'];

  function getJv($stateParams, JvsService) {
    return JvsService.get({
      jvId: $stateParams.jvId
    }).$promise;
  }

  newJv.$inject = ['JvsService'];

  function newJv(JvsService) {
    return new JvsService();
  }
}());
