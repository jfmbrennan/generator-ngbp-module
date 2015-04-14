describe('Controller: <%= filename %>', function () {

  // load the controller's module
  beforeEach(module('<%= namespace %>'));

  var <%= filename %>,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    <%= filename %> = $controller('<%= filename %>', {
      $scope: scope
    });
  }));

  it('should expect scope to be defined', function () {
    expect(scope).toBeDefined();
  });
});
