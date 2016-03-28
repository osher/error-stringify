var util = require('util');
var SUT = require('../');
var E = global.Error;

MockGlobalError = function MockGlobalError(message) {
    Object.defineProperties( this, { 
        "message" : { value: "message"},
        "stack"   : { value: "bla\nbla"}
    })
}
util.inherits(MockGlobalError, Error)

module.exports = 
{ "stringify-error" : 
  { "should be a factory function that names 2 arguments - options, and target" : 
    function() {
        Should.exist(SUT)
        SUT.should.be.a.Function
        SUT.length.should.eql(2)
    }
  , "when passed no arguments (default behavior)" : 
    { "it should augment the global Error object" : 
      function() {
          var e;
          global.Error = MockGlobalError;
          try { 
              SUT();
          } catch (ex) {
              e = ex
          } finally {
              global.Error = E;
          };
          
          Should.not.exist(e);
        
          MockGlobalError.prototype.should.have.property("toJSON");
          MockGlobalError.prototype.toJSON.should.be.a.Function;
      },
      "stringified errors" : {
          "should not have their stacks split" : 
          function() {
              MockGlobalError.prototype.foo = "nop";
              var e = new MockGlobalError("oups");
              e = JSON.parse(JSON.stringify( e ));
              e.stack.should.be.a.String
          },
          "should include only own-properties of the instance" : 
          function() {
              var e = new MockGlobalError("oups");
              MockGlobalError.prototype.foo = "nop";
              e.prop = "val";
              
              var props = Object.keys(JSON.parse(JSON.stringify( e )) ).sort();
              props.should.eql( 
                [ "message"
                , "name"
                , "prop"
                , "stack"
                ]
              )
          }
      }
    }
  , "options.target" : 
    { "when passed a truthful options.target that is not a function" : {
        "it should throw a friendly error" : 
        function() {
            [ true, 2, "ss", {}, new Date()
            ].forEach(function(val) { 
                var e;
                try {
                    SUT({ target: val })
                } catch(x) {
                    e = x;                    
                }
                Should.exist(e, "did not throw for :" + val );
                e.message.should.match(/target must be a function/);
            })
        }
      }
    , "when passed options.target that is a function" : {
        "it should use the passed target" : 
        function() {
            function CustomError() {}
            util.inherits(CustomError, Error);
            
            SUT({ target: CustomError })

            CustomError.prototype.should.have.property("toJSON");
            CustomError.prototype.toJSON.should.be.a.Function;
        }
      }
    , "when options.target is omitted, and no 2nd argument is passed" : {
        "it should use the global Error object" : 
        function() { 
            var e;
            global.Error = MockError;
            try {
                SUT({})
            } catch(x) {
                e = x;
            } finally {
                global.Error = E;
            }
            Should.not.exist(e);
            
            MockError.prototype.should.have.property("toJSON");
            MockError.prototype.toJSON.should.be.a.Function;
            
            function MockError() {}
        }
      }
    , "when passed target in 2nd argument" : {
        "it should cascade whatever is found on options.target" : 
        function() {
            util.inherits(CustomError, Error);
            util.inherits(CustomError2, Error);

            SUT({ target: CustomError }, CustomError2)
            
            Error.prototype.should.not.have.property("toJSON");
            CustomError.prototype.should.not.have.property("toJSON");
            CustomError2.prototype.should.have.property("toJSON");
            CustomError2.prototype.toJSON.should.be.a.Function;
            
            function CustomError() {}

            function CustomError2() {}
        }
      }
    }
  , "options.splitStackTrace" : 
    { "when passed truthful options.splitStackTrace" : 
      { "stringified errors should have their stacks split" : 
        function() {
            [ {}, true, 1, "asaas", function someFunc() {}
            ].forEach(function(val) { 
    
                function CustomError() { 
                    var e = Error.apply(this, arguments);
                    this.stack = e.stack;
                    this.message = e.message;
                }
                util.inherits(CustomError, Error);

                var e;
                try {
                    SUT({ splitStackTrace: val }, CustomError)
                } catch(x) {
                    e = x;                    
                }
                Should.not.exist(e, "threw for :" + val );
               
                JSON.parse(JSON.stringify(new CustomError("oups"))).stack.should.be.an.Array
            })
        }
      }
    , "when passed falseful options.splitStackTrace or omitting it" : 
      { "stringified errors should not have their stacks split" : 
        function() {
            [ null, undefined, false, 0, "", NaN
            ].forEach(function(val) { 
    
                function CustomError() { 
                    var e = Error.apply(this, arguments);
                    this.stack = e.stack;
                    this.message = e.message;
                }
                util.inherits(CustomError, Error);

                var e;
                try {
                    SUT({ splitStackTrace: val }, CustomError)
                } catch(x) {
                    e = x;                    
                }
                Should.not.exist(e, "threw for :" + val );
               
                JSON.parse(JSON.stringify(new CustomError("oups"))).stack.should.be.a.String
            })
        }
      }
    }
  , "options.includeProto" : 
    { "when passed truthful options.includeProto" : 
      { "stringified errors should include all enumerable properties available on the prototype chain" : 
        function() {
            [ {}, true, 1, "asaas", function someFunc() {}
            ].forEach(function(val) { 
    
                function CustomError() { 
                    var e = Error.apply(this, arguments);
                    this.stack = e.stack;
                    this.message = e.message;
                }
                util.inherits(CustomError, Error);
                CustomError.prototype.foo = "bar";

                
                var e;
                try {
                    SUT({ includeProto: val }, CustomError)
                } catch(x) {
                    e = x;                    
                }
                Should.not.exist(e, "threw for :" + val );
               
                JSON.parse(JSON.stringify(new CustomError("oups"))).should.have.property("foo", "bar")
            })
        }
      }
    , "when passed falseful options.includeProto or omitting it" :
      { "stringified errors should include all properties found directly on the serialized instance" : 
        function() {
            [ null, undefined, "", false, NaN
            ].forEach(function(val) { 
    
                function CustomError() { 
                    var e = Error.apply(this, arguments);
                    this.stack = e.stack;
                    this.message = e.message;
                }
                util.inherits(CustomError, Error);
                CustomError.prototype.foo = "bar";

                
                var e;
                try {
                    SUT({ includeProto: val }, CustomError)
                } catch(x) {
                    e = x;                    
                }
                Should.not.exist(e, "threw for :" + val );
               
                JSON.parse(JSON.stringify(new CustomError("oups"))).should.not.have.property("foo")
            })
        }
      }
    }
  }
}