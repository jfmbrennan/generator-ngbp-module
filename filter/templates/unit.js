describe('Filter: <%= filename %>', function () {

  // load the filter's module
  beforeEach(module('<%= namespace %>'));

  var <%= filename %>,
    scope;

  // Initialize the filter and a mock scope
  beforeEach(inject(function ($filter, $rootScope) {
    scope = $rootScope.$new();
    <%= filename %> = $filter('<%= filename %>', {
      $scope: scope
    });
  }));

  it('should expect scope to be defined', function () {
    expect(scope).toBeDefined();
  });
});
