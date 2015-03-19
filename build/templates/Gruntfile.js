/* jshint ignore:start */
module.exports = function (grunt) {

  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-uncss');

  /**
   * Load in our JavaScript Vendor Libraries
   */
  var vendorConfig = require('./vendor.config.js');

  /**
   * Load in our build configuration
   */
  var userConfig = {
    /**
     * The `build_dir` folder is where our projects are compiled during
     * development and the `compile_dir` folder is where our app resides once it's
     * completely built.
     */
    build_dir: 'public', // was 'build'
    compile_dir: 'production',

    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks. `js` is all project javascript, less tests. `ctpl` contains
     * our reusable components' (`src/common`) template HTML files, while
     * `atpl` contains the same, but for our app's code. `html` is just our
     * main HTML file, `less` is our main stylesheet, and `unit` contains our
     * app's unit tests.
     */
    app_files: {
      js: ['src/**/*.js', '!src/**/*.spec.js', '!src/**/*.e2e.js', '!src/assets/**/*.js'],
      jsunit: ['src/**/*.spec.js'],
      e2e: ['src/**/*.e2e.js'],

      atpl: ['src/app/**/*.tpl.html'],
      ctpl: ['src/common/**/*.tpl.html'],

      html: ['src/index.html'],
      less: 'src/less/main.less'
    },

    /**
     * This is a collection of files used during testing only.
     */
    test_files: {
      js: [
        'vendor/angular-mocks/angular-mocks.js'
      ]
    },

    /* configure the JavaScript vendor files */
    vendor_files: vendorConfig

  };

  /**
   * This is the configuration object Grunt uses to give each plugin its
   * instructions.
   */
  var taskConfig = {
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * The banner is the comment that is placed at the top of our compiled
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner: '/**\n' +
      ' * <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %>\n' +
      ' * <%= pkg.homepage %>\n' +
      ' *\n' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
      ' */\n'
    },

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: {
      build: {
        src: ['<%= build_dir %>', 'coverage/', 'backend/public/*'],
        options: {
          force: true
        }
      },
      compile: {
        src: ['<%= compile_dir %>'],
        options: {
          force: true
        }
      },
      tmp: {
        src: ['tmp/'],
        options: {
          force: true
        }
      }
    },

    /**
     * Creates a changelog on a new version.
     */
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        template: '# <%= version%> (<%= today%>) ' +
        '\n' +
        '\n' +
        '<% if (_(changelog.feat).size() > 0) { %> ## Features' +
        '<% _(changelog.feat).forEach(function(changes, scope) { %>' +
        '   - **<%= scope%>:**' +
        '   <% changes.forEach(function(change) { %> - <%= change.msg%> (<%= helpers.commitLink(change.sha1) %>)' +
        '   <% }); %>' +
        '<% }); %> <% } %>' +
        '\n' +
        '\n' +
        '<% if (_(changelog.fix).size() > 0) { %> ## Fixes' +
        '<% _(changelog.fix).forEach(function(changes, scope) { %>' +
        '   - **<%= scope%>:**' +
        '   <% changes.forEach(function(change) { %> - <%= change.msg%> (<%= helpers.commitLink(change.sha1) %>)' +
        '   <% }); %>' +
        '<% }); %> <% } %>' +
        '\n' +
        '\n' +
        '<% if (_(changelog.breaking).size() > 0) { %> ## Breaking Changes' +
        '<% _(changelog.breaking).forEach(function(changes, scope) { %>' +
        '   - **<%= scope%>:**' +
        '   <% changes.forEach(function(change) { %> <%= change.msg%>' +
        '   <% }); %>' +
        '<% }); %> <% } %>'
      }
    },

    /**
     * Increments the version number, etc.
     */
    bump: {
      options: {
        files: [
          'package.json',
          'bower.json'
        ],
        commit: false,
        commitMessage: 'chore(release): v%VERSION%',
        commitFiles: [
          'package.json',
          'client/bower.json'
        ],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin'
      }
    },

    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and Javascript files into
     * `build_dir`, and then to copy the assets to `compile_dir`.
     */
    copy: {

      /** copy _public source files to backend folder */
      backend: {
        expand: true,
        cwd: 'public/',
        src: '**',
        dest: 'backend/public'
      },

      build_module_assets: {
        files: [
          {
            src: ['src/app/**/assets/**/*.*'], // 'src/app/**/*.svg'
            //dest: '<%= build_dir %>/module_assets/',
            dest: '<%= build_dir %>/assets/',
            cwd: '.',
            expand: true,
            flatten: true
          }
        ]
      },

      build_app_assets: {
        files: [
          {
            src: ['**'],
            dest: '<%= build_dir %>/assets/',
            cwd: 'src/assets',
            expand: true
          }
        ]
      },
      build_vendor_assets: {
        files: [
          {
            src: ['<%= vendor_files.assets %>'],
            dest: '<%= build_dir %>/assets/',
            cwd: '.',
            expand: true,
            flatten: true
          }
        ]
      },
      build_appjs: {
        files: [
          {
            src: ['<%= app_files.js %>'],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_vendorjs: {
        files: [
          {
            src: ['<%= vendor_files.js %>'],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      compile_assets: {
        files: [
          {
            src: ['**'],
            dest: '<%= compile_dir %>/assets',
            cwd: '<%= build_dir %>/assets',
            expand: true
          }
        ]
      }
    },

    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    concat: {
      /**
       * The `build_css` target concatenates compiled CSS and vendor CSS
       * together.
       */
      build_css: {
        src: [
          '<%= vendor_files.css %>',
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ],
        dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
      },

      /**
       * The `compile_js` target is the concatenation of our application source
       * code and all specified vendor source code into a single file.
       */
      compile_js: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: [
          // wrap all javascript app code into a main function/closure
          // to prevent polluting the global namespace
          '(function ( window, angular, undefined ) {', // module.prefix
          '<%= vendor_files.js %>', // this line was before the module prefix (app works ok with line inside prefix too)
          '<%= build_dir %>/src/**/*.js',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          '})( window, window.angular );' //module.suffix
        ],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    /**
     * `ngAnnotate` annotates the sources before minifying. That is, it allows us
     * to code without the array syntax.
     */
    ngAnnotate: {
      compile: {
        files: [
          {
            src: ['<%= app_files.js %>'],
            cwd: '<%= build_dir %>',
            dest: '<%= build_dir %>',
            expand: true
          }
        ]
      }
    },

    /**
     * Minify the sources!
     */
    uglify: {
      compile: {
        //uncomment this to enable the banner in the minified JavaScript file
        //options: {
        //  banner: '<%= meta.banner %>'
        //},
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
        }
      }
    },

    /**
     * `grunt-contrib-less` handles our LESS compilation and uglification automatically.
     * Only our `main.less` file is included in compilation; all other files
     * must be imported from this file.
     */
    less: {
      build: {
        files: {
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'
        }
      },
      compile: {
        files: {
          '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'
        },
        options: {
          cleancss: true,
          compress: true
        }
      }
    },

    /**
     * 'recess' handles our LESS compilation and uglification automatically.
     * Only our 'main.less' file is included in compilation; all other files
     * must be imported from this file.
     */
    recess: {
      build: {
        src: ['<%= app_files.less %>'],
        dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',
        options: {
          compile: true,
          compress: false,
          noUnderscores: false,
          noIDs: false,
          zeroUnits: false
        }
      },
      compile: {
        //src: ['<%= recess.build.dest %>'],
        //dest: '<%= recess.build.dest %>',
        src: ['<%= app_files.less %>'],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',
        options: {
          compile: true,
          compress: true,
          noUnderscores: false,
          noIDs: false,
          zeroUnits: false
        }
      }
    },

    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside `src/`.
     */
    jshint: {
      src: [
        '<%= app_files.js %>'
      ],
      test: [
        '<%= app_files.jsunit %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],

      options: {
        jshintrc: true,
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    },

    /**
     * HTMLMIN is a Grunt plugin that takes all of your html template files and
     * and minifies them by removing comments, white spaces, etc.
     * This plugin is used in combination with the 'html2js' and it's called before
     * to minimise the html before is put in the AngularJS templateCache.
     */
    htmlmin: {
      templates: {                        // Selects all the *.tpl.html templates
        options: {                          // Target options
          removeComments: true,           // Strip HTML comments
          removeCommentsFromCDATA: true,  // Strip HTML comments from scripts and styles
          minifyJS: true,                 // Minify JavaScript inside script tags
          collapseWhitespace: true        // Remove white spaces
        },
        files: [
          {
            expand: true,                   // Enable dynamic expansion.
            src: ['src/app/**/*.tpl.html'], // Actual pattern(s) to match.
            dest: 'tmp/'                    // Destination path prefix.
          },
        ]
      },
      index2min: {                          // Selects only the main 'index.html' file
        options: {                          // Target options
          removeComments: true,             // Strip HTML comments
          removeCommentsFromCDATA: true,    // Strip HTML comments from scripts and styles
          minifyJS: true,                   // Minify JavaScript inside script tags
          collapseWhitespace: true          // Remove white spaces
        },
        files: {
          '<%= compile_dir %>/index.html' : '<%= compile_dir %>/index.html'
        }
      }
    },

    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become
     * part of the initial payload as one JavaScript file. Neat!
     */
    html2js: {
      /**
       * These are the templates from `src/app`.
       */

      /* app: {
       options: {
       base: 'src/app'
       },
       src: ['<%= app_files.atpl %>'],
       dest: '<%= build_dir %>/templates-app.js'
       },*/

      app: {
        options: {
          base: 'tmp/src/app'                     // puts the relative path for html templates
        },
        src: [ 'tmp/src/app/**/*.tpl.html' ],     // source path of the minified html templates
        dest: '<%= build_dir %>/templates-app.js' // put the minified templates into the JavaScript file
      },

      /**
       * These are the templates from `src/common`.
       */
      common: {
        options: {
          base: 'src/common'
        },
        src: ['<%= app_files.ctpl %>'],
        dest: '<%= build_dir %>/templates-common.js'
      }
    },

    /**
     * The Karma configurations.
     */
    karma: {
      options: {
        configFile: '<%= build_dir %>/karma-unit.js'
      },
      unit: {
        port: 9019,
        background: true
      },
      continuous: {
        singleRun: true
      }
    },

    /**
     * The `uncss` task compiles removed the unused CSS rules from the project CSS stylesheets
     */
    uncss: {
      dist: {
        src: ['<%= build_dir %>/index.html', 'src/app/**/*.tpl.html'], //// this RULE WORKS
        dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',

        options: {
          ignore       : ['hover', 'click'],
          ignoreSheets : [/fonts.googleapis/],
          report: 'min' //// optional: include to report savings
        }
      }
    },

    /**
     * The `cssmin` task minifies the main CSS file
     */
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: '<%= build_dir %>/assets',
          src: ['*.css', '!*.min.css'],
          dest: '<%= compile_dir %>/assets'
          //ext: '.min.css'
        }]
      }
    },

    /**
     * The `index` task compiles the `index.html` file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    index: {

      /**
       * During development, we don't want to have wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the `<head>` of `index.html`. The
       * `src` property contains the list of included files.
       */
      build: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= build_dir %>/src/**/*.js',
          '<%= html2js.common.dest %>',
          '<%= html2js.app.dest %>',
          //'<%= vendor_files.css %>',
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      },
      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we're back!
       */
      compile: {
        dir: '<%= compile_dir %>',
        src: [
          '<%= concat.compile_js.dest %>',
          //'<%= vendor_files.css %>',
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      }
    },

    /**
     * Configure Express server --port 9000
     */
    express: {
      development: {
        options: {
          port: 9000,
          //hostname: 'localhost',
          serverreload: false,
          bases: '<%= build_dir %>',
          livereload: true
        }
      },
      production: {
        options: {
          port: 9000,
          serverreload: false,
          bases: '<%= compile_dir %>',
          livereload: false
        }
      },
      e2e: {
        options: {
          port: 9000,
          serverreload: false,
          bases: '<%= build_dir %>',
          livereload: false
        }
      }
    },


    protractor: {
      options: {
        // Location of your protractor config file
        configFile: "ProtractorConf.js",

        // Do you want the output to use fun colors?
        noColor: true,

        // Set to true if you would like to use the Protractor command line debugging tool
        // debug: true,

        // Additional arguments that are passed to the webdriver command
        args: { }
      },
      e2e: {
        options: {
          // Stops Grunt process if a test fails
          keepAlive: false
        }
      },
      continuous: {
        options: {
          keepAlive: true
        }
      }
    },


    /**
     * This task compiles the karma template so that changes to its file array
     * don't have to be managed manually.
     */
    karmaconfig: {
      unit: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          '<%= test_files.js %>'
        ]
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed
     * tasks when they do. This just saves us from having to type 'grunt' into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave 'grunt watch' running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files.
     */
    delta: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true
      },

      /**
       * When the Gruntfile changes, we just want to lint it. In fact, when
       * your Gruntfile changes, it will automatically be reloaded!
       */
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
        options: {
          livereload: false
        }
      },

      /**
       * When our JavaScript source files change, we want to run lint them and
       * run our unit tests.
       */
      jssrc: {
        files: [
          '<%= app_files.js %>'
        ],
        //tasks: [ 'jshint:src', 'copy:build_appjs' ]
        tasks: ['copy:build_appjs']
      },

      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      assets: {
        files: [
          'src/assets/**/*'
        ],
        tasks: ['copy:build_app_assets', 'copy:build_vendor_assets']
      },

      /**
       * When index.html changes, we need to compile it.
       */
      html: {
        files: ['<%= app_files.html %>'],
        tasks: ['index:build']
      },

      /**
       * When our templates change, we only rewrite the template cache.
       */
      tpls: {
        files: [
          '<%= app_files.atpl %>',
          '<%= app_files.ctpl %>'
        ],
        //tasks: [ 'html2js:app', 'html2js:common' ]
        //tasks: [ 'clean:tmp', 'htmlmin:templates', 'html2js', 'clean:tmp' ]
        tasks: [ 'clean:tmp', 'htmlmin:templates', 'html2js' ]
      },

      /**
       * When the CSS files change, we need to compile and minify them.
       */
      less: {
        files: ['src/**/*.less', 'src/**/*.css'],
        tasks: ['less:build']
      }
    }

  };

  grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */

  grunt.renameTask('watch', 'delta');
  grunt.registerTask('watch', ['build', 'express:development', 'delta']);

  /**
   * The default task is to build and compile.
   */
  grunt.registerTask('default', ['build']);
  grunt.registerTask('development', ['build']);
  grunt.registerTask('production', ['test', 'compile']);
  grunt.registerTask('test:development', ['express:e2e', 'express-keepalive']);
  grunt.registerTask('test:production', ['express:production', 'express-keepalive']);
  grunt.renameTask('test:development', 'test:dev');
  grunt.renameTask('test:production', 'test:prod');

  /**
   * The `html2min` task minifies all the html templates and applies the 'html2js' task
   */
  grunt.registerTask('html2min', ['clean:tmp', 'htmlmin:templates', 'html2js', 'clean:tmp']);

  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask('build', [
    'clean', 'html2min', 'jshint', 'less:build', 'concat:build_css',
    'copy:build_app_assets', 'copy:build_module_assets', 'copy:build_vendor_assets',
    'copy:build_appjs', 'copy:build_vendorjs', 'index:build'
  ]);

  grunt.registerTask('test', [
    'clean', 'html2min', 'jshint', 'less:build', 'concat:build_css',
    'copy:build_app_assets', 'copy:build_module_assets', 'copy:build_vendor_assets',
    'copy:build_appjs', 'copy:build_vendorjs', 'index:build',
    'karmaconfig', 'karma:continuous'
  ]);

  /**
   * The `compile` task gets your app ready for deployment by concatenating and
   * minifying your code.
   */
  grunt.registerTask('compile', [
    'clean:compile', 'less:compile', 'copy:compile_assets',
    'ngAnnotate', 'concat:compile_js', 'uglify', 'index:compile', 'htmlmin:index2min'
  ]);

  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS(files) {
    return files.filter(function (file) {
      return file.match(/\.js$/);
    });
  }

  /**
   * A utility function to get all app CSS sources.
   */
  function filterForCSS(files) {
    return files.filter(function (file) {
      return file.match(/\.css$/);
    });
  }

  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask('index', 'Process index.html template', function () {
    var dirRE = new RegExp('^(' + grunt.config('build_dir') + '|' + grunt.config('compile_dir') + ')\/', 'g');

    var jsFiles = filterForJS(this.filesSrc).map(function (file) {
      return file.replace(dirRE, '');
    });

    var cssFiles = filterForCSS(this.filesSrc).map(function (file) {
      return file.replace(dirRE, '');
    });

    grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
      process: function (contents, path) {
        return grunt.template.process(contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config('pkg.version'),
            author: grunt.config('pkg.author'),
            date: grunt.template.today("yyyy")
          }
        });
      }
    });
  });

  /**
   * In order to avoid having to specify manually the files needed for karma to
   * run, we use grunt to manage the list for us. The `karma/*` files are
   * compiled as grunt templates for use by Karma. Yay!
   */
  grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function () {
    var jsFiles = filterForJS(this.filesSrc);

    grunt.file.copy('karma/karma-unit.tpl.js', grunt.config('build_dir') + '/karma-unit.js', {
      process: function (contents, path) {
        return grunt.template.process(contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });
  });

};
/* jshint ignore:end */
