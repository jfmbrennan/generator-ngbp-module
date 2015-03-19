/* jshint ignore:start */
module.exports = function ( karma ) {
  karma.set({
    /**
     * From where to look for files, starting with the location of this file.
     */
    basePath: '../',

    /**
     * This is the list of file patterns to load into the browser during testing.
     */
    files: [
      <% scripts.forEach( function ( file ) { %> '<%= file %>', <% }); %>
      'src/**/*.js'
    ],
    exclude: [
      'src/app/**/*.e2e.js', 'src/assets/**/*.js'
    ],
    frameworks: [ 'jasmine' ],
    plugins: [ 'karma-jasmine', 'karma-phantomjs-launcher' ], // 'karma-coverage'

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      //'src/**/*.js': ['coverage']
    },

    // optionally, configure the reporter
    //coverageReporter: {
    //  type: 'html',
    //  dir: 'coverage/'
    //},

    /**
     * How to report, by default.
     */
    colors: true,
    // coverage reporter generates the coverage
    reporters: ['dots'], //, 'coverage'],

    //singleRun: false,

    /**
     * On which port should the browser connect, on which port is the test runner
     * operating, and what is the URL path for the browser to use.
     */
    port: 9018,
    runnerPort: 9100,
    urlRoot: '/',

    /**
     * Disable file watching by default.
     */
    autoWatch: false,

    /**
     * The list of browsers to launch to test on. This includes only "Firefox" by
     * default, but other browser names include:
     * Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS
     *
     * You may also leave this blank and manually navigate your browser to
     * http://localhost:9018/ when you're running tests. The window/tab can be left
     * open and the tests will automatically occur there during the build. This has
     * the aesthetic advantage of not launching a browser every time you save.
     */
    browsers: [
    //'Firefox',
    'PhantomJS'
  ]

  });
};
/* jshint ignore:end */
