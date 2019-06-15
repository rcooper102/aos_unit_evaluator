import { Utils } from "../src/utils";
import { expectWithinPercentage } from "./testUtils.js";
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
    describe('rollDice', function () { 
        const cases = [
            { test: 1, expect: 1 },
            { test: 2, expect: 2 },
            { test: 1.1, expect: 0 },
            { test: "1", expect: 1 },
            { test: "3d3", expect: 6 },
            { test: "d6", expect: 3.5 },
            { test: "D3", expect: 2 },
            { test: " ", expect: 0 },
            { test: "d3d", expect: 0 },
            { test: "2.1", expect: 0 },
            { test: "zzz", expect: 0 },
            { test: "null", expect: 0 },
            { test: "", expect: 0 },
            { test: "3d", expect: 0 },
            { test: null, expect: 0 },
            { test: true, expect: 0 },
            { test: [], expect: 0 },
        ];

        cases.forEach((item) => {
            it(`Should roll statistical average, case: ${String(item.test)}`, function () {
                const iterations = 10000;
                let total = 0;
                for(let i = 0; i < iterations; i++) {
                    total += Utils.rollDice(item.test);
                }
                expectWithinPercentage(total/iterations, item.expect, 0.05);
            }); 
        });
    }); 
    describe('bigNumberFormat', function () { 
        const cases = [
            { test: 1, expect: "1" },
            { test: 2, expect: "2" },
            { test: 1000, expect: "1000" },
            { test: 10000, expect: "10K" },
            { test: 30000, expect: "30K" },
            { test: 100000000, expect: "100M" },
            { test: 1000000000000, expect: "1000B" },
            { test: " ", expect: '' },
            { test: "", expect: '' },
            { test: true, expect: '' },
            { test: [], expect: '' },
            { test: null, expect: '' },
            { test: "10000", expect: '10K' },
        ];

        cases.forEach((item) => {
            it(`Should properly convert big number formats, case: ${String(item.test)}`, function () {
                expect(Utils.bigNumberFormat(item.test)).to.equal(item.expect);  
            }); 
        });
    });  
    describe('hexToRGB', function () { 
        const cases = [
            { test: "F00", expect: "rgb(240, 0, 0)" },
            { test: "030", expect: "rgb(0, 48, 0)" },
            { test: "#030", expect: "rgb(0, 48, 0)" },
            { test: 40, expect: "rgb(0, 0, 0)" },
            { test: [], expect: "rgb(0, 0, 0)" },
            { test: '', expect: "rgb(0, 0, 0)" },
            { test: false, expect: "rgb(0, 0, 0)" },
            { test: null, expect: "rgb(0, 0, 0)" },
            { test: "030", expect: "rgba(0, 48, 0, 0.5)", alpha: 0.5 },
        ];

        cases.forEach((item) => {
            it(`Should properly convert 3 digit hex to rgb, case: ${String(item.test)}`, function () {
                expect(Utils.hexToRGB(item.test, item.alpha)).to.equal(item.expect);  
            }); 
        });
    }); 
    describe('formatPercent', function () { 
        const cases = [
            { test: "40", expect: "" },
            { test: 0.4, expect: "40%" },
            { test: 0.35, expect: "35%" },
            { test: 1.4, expect: "140%" },
            { test: 0.444, expect: "44.4%" },
            { test: 0.445, expect: "44.5%" },
            { test: 0.4444, expect: "44.4%" },
            { test: 0.4445, expect: "44.5%" },
            { test: [], expect: "" },
            { test: '', expect: "" },
            { test: false, expect: "" },
            { test: null, expect: "" },
        ];

        cases.forEach((item) => {
            it(`Should properly convert a decimal to a percent rounded to 1 digits, case: ${String(item.test)}`, function () {
                expect(Utils.formatPercent(item.test)).to.equal(item.expect);  
            }); 
        });
    });   
});





