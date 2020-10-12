'use strict';

// jshint expr: true

const chai = require('chai');
const {validaton, ndcValidator} = require('../src/validators');

const expect = chai.expect;
chai.should();

describe('ndcValidator', function() {
    it('should return OK when ndc is a positive number', function() {
        ndcValidator(5).should.include(
            {result: validaton.OK});
    });
    it('should return ERROR when ndc is zero', function() {
        ndcValidator(0).should.include(
            {result: validaton.ERROR, message: 'NDC is equal to 0'});
    });
    it('should return ERROR when ndc is a number less then zero', function() {
        ndcValidator(-1).should.include(
            {result: validaton.ERROR, message:'NDC has negative value'});
    });
    it('should return ERROR when ndc is empty text', function() {
        ndcValidator('').should.include(
            {result: validaton.ERROR, message:'NDC is empty'});
    });
    it('should return ERROR when ndc is a number with 12 digits', function() {
        ndcValidator(123456789012).should.include(
            {result: validaton.ERROR, message:'NDC has more then 11 digits'});
    });
});
