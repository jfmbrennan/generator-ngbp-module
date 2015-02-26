# generator-ngbp-module 
[![tests](https://secure.travis-ci.org/jfmbrennan/generator-ngbp-module.png?branch=master)](https://travis-ci.org/jfmbrennan/generator-ngbp-module) [![dependencies](https://david-dm.org/jfmbrennan/generator-ngbp-module.svg)](https://david-dm.org/jfmbrennan/generator-ngbp-module) [![Coverage Status](https://coveralls.io/repos/jfmbrennan/generator-ngbp-module/badge.svg?branch=master)](https://coveralls.io/r/jfmbrennan/generator-ngbp-module?branch=master)

> [Yeoman](http://yeoman.io) generator


## Getting Started

### Yeoman

To install yeoman from npm, run:

```bash
npm install -g yo
```

### Yeoman Generators

To install generator-ngbp-module from npm, run:

```bash
npm install -g generator-ngbp-module
```

Finally, create the module <name>:

```bash
yo ngbp-module <name>
```

You can always reverse this by:

```bash
yo ngbp-module:remove <name>
```

### Sub Generators

Create a module controller by:

```bash
yo ngbp-module:controller <name>
```

Create a module directive by:

```bash
yo ngbp-module:directive <name>
```

Create a module service by:

```bash
yo ngbp-module:service <name>
```

Create a module filter by:

```bash
yo ngbp-module:filter <name>
```


## TODO

* update README to contain more meaningful info
* add functionality to scaffold out entire app if one does not exist
* scaffold .less file for each module and wire it up by appending to main.less

