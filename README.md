# generator-ngbp-module 
[![tests](https://secure.travis-ci.org/jfmbrennan/generator-ngbp-module.png?branch=master)](https://travis-ci.org/jfmbrennan/generator-ngbp-module) [![dependencies](https://david-dm.org/jfmbrennan/generator-ngbp-module.svg)](https://david-dm.org/jfmbrennan/generator-ngbp-module) [![Coverage Status](https://coveralls.io/repos/jfmbrennan/generator-ngbp-module/badge.svg?branch=master)](https://coveralls.io/r/jfmbrennan/generator-ngbp-module?branch=master) [![npm version](https://img.shields.io/npm/v/generator-ngbp-module.svg)](https://www.npmjs.com/package/generator-ngbp-module)


## Getting Started

### Yeoman - Install prerequisites

To install yeoman and the ngbp-module generator from npm, run:

```bash
npm install -g yo generator-ngbp-module
```

### Create a new Angular Module

Create the module <modulename> using...

```bash
yo ngbp-module <modulename>
```

You can always reverse this by:

```bash
yo ngbp-module:remove <modulename>
```

### Sub Generators

Create a module controller by:

```bash
yo ngbp-module:controller <controllername>
```

Create a module directive by:

```bash
yo ngbp-module:directive <directivename>
```

Create a module service by:

```bash
yo ngbp-module:service <servicename>
```

Create a module filter by:

```bash
yo ngbp-module:filter <filtername>
```
### What you get

Scaffolds out a complete angular module structure for you:

    example/
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
