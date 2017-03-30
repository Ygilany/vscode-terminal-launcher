import * as assert from 'assert';

import {utils} from '../src/utils';

// Defines a Mocha test suite to group tests of similar kind together
suite("Utils Tests", () => {
    
    let utils_obj: utils;
    
    setup( () => {
        utils_obj = new utils();        
    })
    
    test("getIndexWherePropertyIs should return index of element in Array", () => {
      let arr = [{name: "yahya"}, {name: "john"}, {name: "andrew"}];
      let retval = utils_obj.getIndexWherePropertyIs(arr, `name`, `john`);

      assert.equal(retval, 1);
    });
});