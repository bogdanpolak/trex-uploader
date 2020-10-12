'use strict';

// jshint expr: true

const 
    chai = require('chai'),
    expect = chai.expect;

chai.should();

function isValidNDC (ndc) {
    return Number.isInteger(ndc);
}

describe('isValidNDC()', function() {
    it('should return true when ndc is number', function() {
        isValidNDC(5).should.be.true;
    });
});
