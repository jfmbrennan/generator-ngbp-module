module.exports = {

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */

    /*
    * NOTE: Use the *.min.js version when compiling for production. Otherwise,
    * use the normal *.js version for development*/

    js: [
      // Angular Scripts
      'vendor/angular/angular.min.js',
      'vendor/angular-ui-router/release/angular-ui-router.min.js',
      'vendor/angular-cookies/angular-cookies.min.js',
      'vendor/angular-mocks/angular-mocks.js',
      'vendor/angular-resource/angular-resource.min.js',

      'vendor/underscore/underscore-min.js'
    ],
    css: [
      //'src/less/style.css'
    ],
    assets: []
};
