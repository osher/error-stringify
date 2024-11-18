//returns only the relevant function
//all the non-used versions would be freed from memory.
/**
 augments the prototype of the target error with a non-enumerable toJSON method.
  - uses the minimum memory possible
  - uses ultralight specific optimized implementations (instead of one with logic)
  - optimized for minimal memory footprint and high performance
 
 @param {object} options optional. defaults to empty object.
 @param {boolean} options.splitStackTrace 
    optional. 
    wither or not to convert stack traces to arrays of strings split by new line. 
    defaults to false.
 @param {boolean} options.includeProto 
    optional. 
    wither to include all enumerable attributes in the prototype chain, or only the 
    attributes found directly on the stringified instance.
    defaults to false.
 @param {Function} options.target
    optional.
    the target Error to augment
    defaults to 2nd parameter
 @param {Function} target                 - 
    optional. 
    the target Error to augment
    defaults to the global Error object
 @param {boolean} options.allowOverrideToJSON
    optional. if a package you cannot skip ensists on overriding the toJSON - you can
    make the toJSON overridable.
    e.g: axios has a bug in how they implement inheritence... https://github.com/axios/axios/issues/6690
    defaults to false 
 @throws target must be a function 
 */
module.exports = function augmentErrorToJson(options, target) {
    if (!options) options = {};
    if ('function' != typeof (options.target || target || global.Error))
        throw new Error('target must be a function');
      
    Object.defineProperty( (target || options.target || global.Error).prototype, "toJSON", {
      enumerable  : false,
      writable    : options.allowOverrideToJSON || false,
      configurable: true,
      value       : {
        "00" : //no split, no prototype-chain
            function Error_stringify() {
                if (!(this instanceof Error))
                    return this;

                var o = { 
                  name    : this.name, 
                  message : this.message, 
                  stack   : this.stack
                };
                var e = this;        
                Object.getOwnPropertyNames(this).forEach(function (key) {
                    o[key] = e[key];
                });

                return o
            },     
        "10" ://with split, no prototype-chain
            function Error_stringify() {
                if (!(this instanceof Error))
                    return this;

                var o = { 
                  name    : this.name,
                  message : this.message, 
                  stack   : this.stack
                };
                var e = this;        
                Object.getOwnPropertyNames(this).forEach(function (key) {
                    o[key] = e[key];
                });
                o.stack = o.stack.split("\n")

                return o
            },        
        "01" : //no split, with prototype-chain
            function Error_stringify() {
                if (!(this instanceof Error))
                    return this;
                
                var o = {
                  name   : this.name,
                  message: this.message,
                };
                //get all enumerable properties, *including* the prototype chain
                for (var p in this)
                    o[p] = this[p];


                o.stack = this.stack;
                
                return o
            },
        "11" : //with split, with prototype-chain
            function Error_stringify() {
                if (!(this instanceof Error))
                    return this;
                
                var o = {
                  name   : this.name,
                  message: this.message,
                };
                //get all enumerable properties, *including* the prototype chain
                for (var p in this)
                    o[p] = this[p];

                o.stack = this.stack.split("\n");
                
                return o
            }
      }[ (options.splitStackTrace ? "1" : "0") 
       + (options.includeProto    ? "1" : "0")
       ]
    })
}