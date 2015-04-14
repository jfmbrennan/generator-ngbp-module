describe('Directive: <%= filename %>', function () {

  // load the directive's module
  beforeEach(module('<%= namespace %>'));

  var <%= filename %>,
    scope;

  // Initialize the directive and a mock scope
  beforeEach(inject(function ($directive, $rootScope) {
    scope = $rootScope.$new();
    <%= filename %> = $directive('<%= filename %>', {
      $scope: scope
    });
  }));

  it('should expect scope to be defined', function () {
    expect(scope).toBeDefined();
  });
});
