(function () {
  'use strict';

  angular
    .module('jvs')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Jvs',
      state: 'jvs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'jvs', {
      title: 'List Jvs',
      state: 'jvs.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'jvs', {
      title: 'Create Jv',
      state: 'jvs.create',
      roles: ['user']
    });
  }
}());
