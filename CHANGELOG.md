# Changelog

## v0.2.6 (2015-04-09)

### Bug Fixes

- Replaced references to deprecated "withPrompt" with "withPrompts"
- Replaced deprecated underscore.string with lodash
- Replaced deprecated mkdir with mkdirp
- Replaced deprecated this.readFileAsString() with require("html-wiring").readFileAsString()
- Replaced deprecated this.writeFileAsString() with require("html-wiring").writeFileAsString()
- Replaced deprecated expandFiles() and expand() with glob module methods.
- Replaced console.log with generator.log

### Features
- Bump version of `fs-extra` to `0.18.0`
- Bump version of `yeoman-generator` to `0.19.1`
- 

## v0.2.5 (2015-04-01)

### Bug Fixes

- Fixed "Issue Remove 'HomeCtrl' from app.js" [#2](https://github.com/jfmbrennan/generator-ngbp-module/issues/2)
- Fixed unit test file name clashing by adding sub generator type to unit test filename

### Features

- Added CHANGELOG.md
- Added LICENSE


## v0.2.4 (2015-03-30)

### Features

- Tidied up console logs
- Bumped dependency `fs-extra` to `^0.17.0`

## v0.2.3 (2015-03-26)

### Features

- Tidied up module templates by removing Example and Home Controllers
- Added section on each sub generator to README.md


## v0.2.2 (2015-03-23)

### Bug Fixes

- Added `{link: true}` as option when calling `composeWith` function to prevent possible EventEmitter memory leak. Fixes "Could not create a new Angular project in MacOS" [#1](https://github.com/jfmbrennan/generator-ngbp-module/issues/1) 

### Features

- Added console logging with chalk to guide user through app and module generators


## v0.2.1 (2015-03-20)

### Bug Fixes

- Removed `--banner` option until it is in a more stable state


## v0.2.0 (2015-03-19)

### Features

- Added `yo ngbp-module:build <appname>` which creates a base angular app (based on Antonio Aguilar's [Angular Boilerplate](https://github.com/antonioaguilar/ngbp) project)

## v0.1.1 (2015-03-19)

### Features

- Added section on angular module structure to README.md

## v0.1.0 (2015-03-17)

### Features

- `yo ngbp-module <module>` creates new basic angular module
- `yo ngbp-module:controller <controller>` creates angular module controller
- `yo ngbp-module:directive <directive>` creates angular module directive
- `yo ngbp-module:filter <filter>` creates angular filter
- `yo ngbp-module:service <service>` creates angular factory
- `yo ngbp-module:remove <module>` removes angular module

- Unit tests for module generator and all other sub generators
