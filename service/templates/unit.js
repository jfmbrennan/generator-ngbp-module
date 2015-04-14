describe('Service: <%= filename %>', function () {

  // load the service's module
  beforeEach(module('<%= namespace %>'));

  var <%= filename %>,
    scope;

  // Initialize the service and a mock scope
  beforeEach(inject(function ($service, $rootScope) {
    scope = $rootScope.$new();
    <%= filename %> = $service('<%= filename %>', {
      $scope: scope
    });
  }));

  it('should expect scope to be defined', function () {
    expect(scope).toBeDefined();
  });
});
