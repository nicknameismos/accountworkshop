(function () {
  'use strict';

  angular
    .module('rvs')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Rvs',
      state: 'rvs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'rvs', {
      title: 'List Rvs',
      state: 'rvs.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'rvs', {
      title: 'Create Rv',
      state: 'rvs.create',
      roles: ['user']
    });
  }
}());
