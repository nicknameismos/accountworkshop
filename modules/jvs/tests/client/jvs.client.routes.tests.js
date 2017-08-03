(function () {
  'use strict';

  describe('Jvs Route Tests', function () {
    // Initialize global variables
    var $scope,
      JvsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _JvsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      JvsService = _JvsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('jvs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/jvs');
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
          JvsController,
          mockJv;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('jvs.view');
          $templateCache.put('modules/jvs/client/views/view-jv.client.view.html', '');

          // create mock Jv
          mockJv = new JvsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Jv Name'
          });

          // Initialize Controller
          JvsController = $controller('JvsController as vm', {
            $scope: $scope,
            jvResolve: mockJv
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:jvId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.jvResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            jvId: 1
          })).toEqual('/jvs/1');
        }));

        it('should attach an Jv to the controller scope', function () {
          expect($scope.vm.jv._id).toBe(mockJv._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/jvs/client/views/view-jv.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          JvsController,
          mockJv;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('jvs.create');
          $templateCache.put('modules/jvs/client/views/form-jv.client.view.html', '');

          // create mock Jv
          mockJv = new JvsService();

          // Initialize Controller
          JvsController = $controller('JvsController as vm', {
            $scope: $scope,
            jvResolve: mockJv
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.jvResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/jvs/create');
        }));

        it('should attach an Jv to the controller scope', function () {
          expect($scope.vm.jv._id).toBe(mockJv._id);
          expect($scope.vm.jv._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/jvs/client/views/form-jv.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          JvsController,
          mockJv;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('jvs.edit');
          $templateCache.put('modules/jvs/client/views/form-jv.client.view.html', '');

          // create mock Jv
          mockJv = new JvsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Jv Name'
          });

          // Initialize Controller
          JvsController = $controller('JvsController as vm', {
            $scope: $scope,
            jvResolve: mockJv
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:jvId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.jvResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            jvId: 1
          })).toEqual('/jvs/1/edit');
        }));

        it('should attach an Jv to the controller scope', function () {
          expect($scope.vm.jv._id).toBe(mockJv._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/jvs/client/views/form-jv.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
