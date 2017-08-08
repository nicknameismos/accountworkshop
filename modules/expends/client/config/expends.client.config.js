(function() {
    'use strict';

    angular
        .module('expends')
        .run(menuConfig);

    menuConfig.$inject = ['Menus'];

    function menuConfig(menuService) {
        // Set top bar menu items
        menuService.addMenuItem('topbar', {
            title: 'Expends',
            state: 'expends',
            type: 'dropdown',
            roles: ['*']
        });

        // Add the dropdown list item
        menuService.addSubMenuItem('topbar', 'expends', {
            title: 'List Expends',
            state: 'expends.list'
        });

        // Add the dropdown create item
        menuService.addSubMenuItem('topbar', 'expends', {
            title: 'Create Expend',
            state: 'expends.create',
            roles: ['user']
        });
    }
}());