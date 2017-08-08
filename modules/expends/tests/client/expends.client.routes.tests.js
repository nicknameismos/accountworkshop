(function () {
  'use strict';

  describe('Expends Route Tests', function () {
    // Initialize global variables
    var $scope,
      ExpendsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ExpendsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ExpendsService = _ExpendsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('expends');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/expends');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ExpendsController,
          mockExpend;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('expends.view');
          $templateCache.put('modules/expends/client/views/view-expend.client.view.html', '');

          // create mock Expend
          mockExpend = new ExpendsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Expend Name'
          });

          // Initialize Controller
          ExpendsController = $controller('ExpendsController as vm', {
            $scope: $scope,
            expendResolve: mockExpend
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:expendId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.expendResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            expendId: 1
          })).toEqual('/expends/1');
        }));

        it('should attach an Expend to the controller scope', function () {
          expect($scope.vm.expend._id).toBe(mockExpend._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/expends/client/views/view-expend.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ExpendsController,
          mockExpend;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('expends.create');
          $templateCache.put('modules/expends/client/views/form-expend.client.view.html', '');

          // create mock Expend
          mockExpend = new ExpendsService();

          // Initialize Controller
          ExpendsController = $controller('ExpendsController as vm', {
            $scope: $scope,
            expendResolve: mockExpend
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.expendResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/expends/create');
        }));

        it('should attach an Expend to the controller scope', function () {
          expect($scope.vm.expend._id).toBe(mockExpend._id);
          expect($scope.vm.expend._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/expends/client/views/form-expend.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ExpendsController,
          mockExpend;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('expends.edit');
          $templateCache.put('modules/expends/client/views/form-expend.client.view.html', '');

          // create mock Expend
          mockExpend = new ExpendsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Expend Name'
          });

          // Initialize Controller
          ExpendsController = $controller('ExpendsController as vm', {
            $scope: $scope,
            expendResolve: mockExpend
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:expendId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.expendResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            expendId: 1
          })).toEqual('/expends/1/edit');
        }));

        it('should attach an Expend to the controller scope', function () {
          expect($scope.vm.expend._id).toBe(mockExpend._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/expends/client/views/form-expend.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
