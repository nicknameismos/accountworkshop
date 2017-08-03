(function () {
  'use strict';

  describe('Jvs List Controller Tests', function () {
    // Initialize global variables
    var JvsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      JvsService,
      mockJv;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _JvsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      JvsService = _JvsService_;

      // create mock article
      mockJv = new JvsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Jv Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Jvs List controller.
      JvsListController = $controller('JvsListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockJvList;

      beforeEach(function () {
        mockJvList = [mockJv, mockJv];
      });

      it('should send a GET request and return all Jvs', inject(function (JvsService) {
        // Set POST response
        $httpBackend.expectGET('api/jvs').respond(mockJvList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.jvs.length).toEqual(2);
        expect($scope.vm.jvs[0]).toEqual(mockJv);
        expect($scope.vm.jvs[1]).toEqual(mockJv);

      }));
    });
  });
}());
