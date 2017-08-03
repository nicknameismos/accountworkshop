(function () {
  'use strict';

  describe('Ars Route Tests', function () {
    // Initialize global variables
    var $scope,
      ArsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ArsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ArsService = _ArsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('ars');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/ars');
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
          ArsController,
          mockAr;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('ars.view');
          $templateCache.put('modules/ars/client/views/view-ar.client.view.html', '');

          // create mock Ar
          mockAr = new ArsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Ar Name'
          });

          // Initialize Controller
          ArsController = $controller('ArsController as vm', {
            $scope: $scope,
            arResolve: mockAr
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:arId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.arResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            arId: 1
          })).toEqual('/ars/1');
        }));

        it('should attach an Ar to the controller scope', function () {
          expect($scope.vm.ar._id).toBe(mockAr._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/ars/client/views/view-ar.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ArsController,
          mockAr;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('ars.create');
          $templateCache.put('modules/ars/client/views/form-ar.client.view.html', '');

          // create mock Ar
          mockAr = new ArsService();

          // Initialize Controller
          ArsController = $controller('ArsController as vm', {
            $scope: $scope,
            arResolve: mockAr
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.arResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/ars/create');
        }));

        it('should attach an Ar to the controller scope', function () {
          expect($scope.vm.ar._id).toBe(mockAr._id);
          expect($scope.vm.ar._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/ars/client/views/form-ar.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ArsController,
          mockAr;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('ars.edit');
          $templateCache.put('modules/ars/client/views/form-ar.client.view.html', '');

          // create mock Ar
          mockAr = new ArsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Ar Name'
          });

          // Initialize Controller
          ArsController = $controller('ArsController as vm', {
            $scope: $scope,
            arResolve: mockAr
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:arId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.arResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            arId: 1
          })).toEqual('/ars/1/edit');
        }));

        it('should attach an Ar to the controller scope', function () {
          expect($scope.vm.ar._id).toBe(mockAr._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/ars/client/views/form-ar.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
