(function () {
  'use strict';

  describe('Pvs Route Tests', function () {
    // Initialize global variables
    var $scope,
      PvsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PvsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PvsService = _PvsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('pvs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/pvs');
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
          PvsController,
          mockPv;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('pvs.view');
          $templateCache.put('modules/pvs/client/views/view-pv.client.view.html', '');

          // create mock Pv
          mockPv = new PvsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Pv Name'
          });

          // Initialize Controller
          PvsController = $controller('PvsController as vm', {
            $scope: $scope,
            pvResolve: mockPv
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:pvId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.pvResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            pvId: 1
          })).toEqual('/pvs/1');
        }));

        it('should attach an Pv to the controller scope', function () {
          expect($scope.vm.pv._id).toBe(mockPv._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/pvs/client/views/view-pv.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PvsController,
          mockPv;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('pvs.create');
          $templateCache.put('modules/pvs/client/views/form-pv.client.view.html', '');

          // create mock Pv
          mockPv = new PvsService();

          // Initialize Controller
          PvsController = $controller('PvsController as vm', {
            $scope: $scope,
            pvResolve: mockPv
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.pvResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/pvs/create');
        }));

        it('should attach an Pv to the controller scope', function () {
          expect($scope.vm.pv._id).toBe(mockPv._id);
          expect($scope.vm.pv._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/pvs/client/views/form-pv.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PvsController,
          mockPv;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('pvs.edit');
          $templateCache.put('modules/pvs/client/views/form-pv.client.view.html', '');

          // create mock Pv
          mockPv = new PvsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Pv Name'
          });

          // Initialize Controller
          PvsController = $controller('PvsController as vm', {
            $scope: $scope,
            pvResolve: mockPv
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:pvId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.pvResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            pvId: 1
          })).toEqual('/pvs/1/edit');
        }));

        it('should attach an Pv to the controller scope', function () {
          expect($scope.vm.pv._id).toBe(mockPv._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/pvs/client/views/form-pv.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
