var SUT = require('../');

module.exports = 
{ "stringify-error" : 
  { "should be a factory function that names 2 arguments - options, and target" : 
    function() {
        Should.exist(SUT)
        SUT.should.be.a.Function
        SUT.length.should.eql(2)
    }
  , "when passed no arguments (default behavior)" : { 
      "it should augment the global Error object" :
      null,
      "stringified errors" : {
          "should not have their stacks split" : 
          null,
          "should include only own-properties of the instance" : 
          null
      }
    }
  , "options.target" : 
    { "when passed options.target that is not a function" : {
        "it should throw a friendly error" : 
        null
      }
    , "when passed options.target that is a function" : {
        "it should use the passed target" : 
        null
      }
    , "when options.target is omitted" : {
        "it should use the global Error object" : 
        null
      }
    , "when passed target in 2nd argument" : {
        "it should cascade whatever is found on options.target" : 
        null
      }
    }
  , "options.splitStackTrace" : 
    { "when passed truthful options.splitStackTrace" : 
      { "stringified errors" : 
        { "should have their stacks split" : 
          null
        }
      }
    , "when passed falseful options.splitStackTrace or omitting it" : 
      { "stringified errors should have their stacks split" : 
        null
      }
    }
  , "options.includeProto" : 
    { "when passed truthful options.includeProto" : 
      { "stringified errors should include all enumerable properties available on the prototype chain" : 
        null
      }
    , "when passed falseful options.includeProto or omitting it" :
      { "stringified errors should include all properties found directly on the serialized instance" : 
        null
      }
    }
  }
}