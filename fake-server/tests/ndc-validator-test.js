'use strict';

// jshint expr: true

const 
    chai = require('chai'),
    expect = chai.expect;

chai.should();

const validaton = {
    OK: 'ok',
    WARNING: 'warning',
    ERROR: 'error'
}

function ndcValidator (ndc) {
    if (Number.isInteger(ndc)) {
        const ndcValue = parseInt(ndc);
        const len = ndcValue.toString().length;
        if (ndcValue<=0) return validaton.ERROR;
        if (len>11) return validaton.WARNING;
        return validaton.OK;
    } else {
        return validaton.ERROR
    }
}

describe('ndcValidator', function() {
    it('should return OK when ndc is a positive number', function() {
        ndcValidator(5).should.be.equal(validaton.OK);
    });
    it('should return ERROR when ndc is zero', function() {
        ndcValidator(0).should.be.equal(validaton.ERROR);
    });
    it('should return ERROR when ndc is a number less then zero', function() {
        ndcValidator(-1).should.be.equal(validaton.ERROR);
    });
    it('should return ERROR when ndc is empty text', function() {
        ndcValidator('').should.be.equal(validaton.ERROR);
    });
    it('should return WARNING when ndc is a number with 12 digits', function() {
        ndcValidator(123456789012).should.be.equal(validaton.WARNING);
    });
});
