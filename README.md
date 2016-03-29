# error-stringify

Augment errors with `Error#toJSON` that preserves `name`, `message`, `stack` as well as any other 
normally stringified attribute.

## Motive (use-cases)
 - As a **Developer**
 - I would like to **preserve error attributes in JSON stringification**
 - So that I can presever the props above while I:
    - output errors in loggers with `log.warn("error %j", error)`
    - dump errors to disk
    - stringify errors and send them over the network (to couchdb, mongo, log-stash, or any other 
      service)
   
## Features:
 - control which errors should include this behavior: all errors, or only my custom errors
   depend what target I pass
 - control wether the stack trace should be returned raw, or split by new line
   (the later is useful for improving readability of stack traces in Kibana and such)
 - control wether the stringification should include only properties from the stringified 
   instance or all enumerable properties available via the prototype chain.
   (the later is useful when your custom errors inheritence tree defines names, categories/tags 
   and codes on the prototype)
 - optimized for minimal memory footprint and high performance: 
    - augments with specific slim optimized implementations that match your configs(instead 
      of one with logic inside)
    - does not declare any symbols in any closure, except `module.export`

## Usage:

The usage vary between the following two extremes.

Pass what you need to control the behavior :)

### applying default behavior on the global Error
 
 - default target: global Error 
 - default behavior: 
    - stacks are not split
    - prototype chain is not included

```
require('error-stringify')()
```

Default behavior does not split stack traces, and includes only properties on the passed 
instance (enumerable or not).

### applying behavior by configuration only to custom errors

 - provide target through the `options.target` parameter, or by the `target`
 - explicit switches
    - `splitStackTrace` - boolean
    - `includeProtoChain` - boolean

```
var AppError = require('./app-error-base');
require('error-stringify')({
    target            : AppError
    splitStackTrace   : true, 
    includeProtoChain : true
})

```

which is effectively the equivalent of: 
```
var AppError = require('./app-error-base');
var options  = {
    splitStackTrace   : true, 
    includeProtoChain : true
};
require('error-stringify')(options, AppError)

```
The later form is useful when you want to pick the options from a file and pass it as is, 
so you can pass the base Error constructor in the 2nd argument.


## Installation

```
npm install error-stringify --save
```

## Alternatives I looked into:
 - (stringify-error)[https://www.npmjs.com/package/stringify-error]
 - (error-tojson)[https://www.npmjs.com/package/error-tojson]
 - (utils-error-to-json)[https://github.com/kgryte/utils-error-to-json]
 
## Lisence
MIT, and that's it

Happy coding :) 