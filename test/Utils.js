import { Utils } from "../src/utils";
const assert = require('assert');
const { it } = require('mocha');
const { expect } = require('chai');

describe.only('Utils', function () {	
    describe('isInteger', function () { 
        const cases = [
            { test: 1, expect: true },
            { test: 2, expect: true },
            { test: 1.1, expect: false },
            { test: "1", expect: true },
            { test: "2.1", expect: false },
            { test: "zzz", expect: false },
            { test: "null", expect: false },
            { test: "", expect: false },
            { test: null, expect: false },
            { test: true, expect: false },
            { test: [], expect: false },
        ];

        cases.forEach((item) => {
            it(`Should properly detect integers, case: ${String(item.test)}`, function () {
                expect(Utils.isInteger(item.test)).to.equal(item.expect);  
            }); 
        });
    });
    describe('isDiceNotation', function () { 
        const cases = [
            { test: 1, expect: true },
            { test: 2, expect: true },
            { test: 1.1, expect: false },
            { test: "1", expect: true },
            { test: "3d3", expect: true },
            { test: "d6", expect: true },
            { test: "D3", expect: true },
            { test: " ", expect: false },
            { test: "d3d", expect: false },
            { test: "2.1", expect: false },
            { test: "zzz", expect: false },
            { test: "null", expect: false },
            { test: "", expect: false },
            { test: "3d", expect: false },
            { test: null, expect: false },
            { test: true, expect: false },
            { test: [], expect: false },
        ];

        cases.forEach((item) => {
            it(`Should properly detect Dice Notation, case: ${String(item.test)}`, function () {
                expect(Utils.isDiceNotation(item.test)).to.equal(item.expect);  
            }); 
        });
    });   
});





