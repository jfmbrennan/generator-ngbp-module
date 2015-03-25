# generator-ngbp-module 
[![tests](https://secure.travis-ci.org/jfmbrennan/generator-ngbp-module.png?branch=master)](https://travis-ci.org/jfmbrennan/generator-ngbp-module) [![dependencies](https://david-dm.org/jfmbrennan/generator-ngbp-module.svg)](https://david-dm.org/jfmbrennan/generator-ngbp-module) [![Coverage Status](https://coveralls.io/repos/jfmbrennan/generator-ngbp-module/badge.svg?branch=master)](https://coveralls.io/r/jfmbrennan/generator-ngbp-module?branch=master) [![npm version](https://img.shields.io/npm/v/generator-ngbp-module.svg)](https://www.npmjs.com/package/generator-ngbp-module)


## Getting Started

### Yeoman - Install prerequisites

To install yeoman and the ngbp-module generator from npm, run:

```bash
npm install -g yo generator-ngbp-module
```

### Create a new Angular Project
If you are creating a project from the start - create a new directory, make it your current working directory and scaffold out your initial app using this generator or just use the following...

```bash
mkdir <appname> && cd $_
yo ngbp-module
```

which scaffolds out a complete angular app structure for you:

    ./
	├── karma/
	│   └── karma-unit.tpl.js
	├── src/
	│   ├── app/
	│   │   ├── app.js
	│   │   └── app.spec.js
	│   ├── less/
	│   │   ├── bootswatch.less
	│   │   ├── main.less
	│   │   ├── style.css
	│   │   └── variables.less
	│   └── index.html
	├── .bowerrc
	├── .editorconfig
	├── .gitignore
	├── .jshintrc
	├── .yo-rc.json
	├── CHANGELOG.md
	├── Gruntfile.js
	├── ProtractorConfig.js
	├── README.md
	├── bower.json
	├── package.json
	└── vendor.config.js

Pass `--init` as an option to force the initialization of a new app. This should be used with caution as this may overwrite existing files.

Use `--banner=<bannerfile>` to specify a file which contains the string to be used as a banner in scaffolded files. This string is stored as config variable `banner` in `.yo-rc.json` file in project root directory.


### Create a new Angular Module

Create the module <modulename> using...

```bash
yo ngbp-module <modulename>
```

which scaffolds out a complete angular module structure for you:

    src/app/example/
	├── assets/
	├── controllers/
	│   └── example.controllers.js
	├── directives/
	│   ├── partials/
	│   └── example.directives.js
	├── e2e/
	│   └── example.e2e.js
	├── filters/
	│   └── example.filters.js
	├── services/
	│   └── example.services.js
	├── styles/
	│   └── example.less
	├── unit/
	│   └── example.spec.js
	├── partials/
	│   └── example.tpl.html
	└── example.module.js


You can always reverse this by:

```bash
yo ngbp-module:remove <modulename>
```


### Controllers

Create a module controller by:

```bash
yo ngbp-module:controller test
```

which creates the following files

```bash

src/app/example/
├── controllers/
│   └── TestCtrl.js
└── unit/
    └── TestCtrl.spec.js
	
```
and updates `src/app/example/controllers/example.controllers.js` to include the newly created Controller as a dependency


### Directives

Create a module directive by:

```bash
yo ngbp-module:directive test
```

which creates the following files

```bash

src/app/example/
├── directives/
│   └── Test.js
└── unit/
    └── Test.spec.js
	
```
and updates `src/app/example/directives/example.directives.js` to include the newly created Directive as a dependency

### Services

Create a module service by:

```bash
yo ngbp-module:service test
```

which creates the following files

```bash

src/app/example/
├── services/
│   └── Test.js
└── unit/
    └── Test.spec.js
	
```
and updates `src/app/example/services/example.services.js` to include the newly created Service as a dependency

### Filters

Create a module filter by:

```bash
yo ngbp-module:filter test
```

which creates the following files

```bash

src/app/example/
├── filters/
│   └── Test.js
└── unit/
    └── Test.spec.js
	
```
and updates `src/app/example/filters/example.filters.js` to include the newly created Filter as a dependency


##TODO

 * Update Gruntfile scaffold to include banner
 * Prevent Filename clashing with directive, service and filter unit test files
 * Add optional modules (util, template caching, etc) to scaffold during app build
 * Include option to use select from list of bootstrap templates during app build	