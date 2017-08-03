(function () {
  'use strict';

  angular
    .module('pvs')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Pvs',
      state: 'pvs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'pvs', {
      title: 'List Pvs',
      state: 'pvs.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'pvs', {
      title: 'Create Pv',
      state: 'pvs.create',
      roles: ['user']
    });
  }
}());
