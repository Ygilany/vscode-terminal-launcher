import * as assert from 'assert';

import {utils} from '../src/utils';

// Defines a Mocha test suite to group tests of similar kind together
suite("Utils Tests", () => {
    
    let utils_obj: utils;
    
    setup( () => {
        utils_obj = new utils();        
    })

    // Defines a Mocha unit test
    test("Something 1", () => {
        assert.equal(-1, [1, 2, 3].indexOf(5));
        assert.equal(-1, [1, 2, 3].indexOf(0));
    });
    
    test("getIndexWherePropertyIs should return index of element in Array start empty", () => {
      let arr = [{name: "yahya"}, {name: "john"}, {name: "andrew"}];
      let retval = utils_obj.getIndexWherePropertyIs(arr, `name`, `john`);

      assert.equal(retval, 1);
    });
});