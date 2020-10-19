'use strict';

// jshint expr: true

const chai = require('chai');
const {validaton, ndcValidator} = require('../src/cell-validators');

const expect = chai.expect;
chai.should();

describe('ndcValidator', function() {
    it('should return OK when ndc is a positive number', function() {
        ndcValidator(5).should.include(
            {result: validaton.OK});
    });
    it('should return OK when ndc has string number 111111', function() {
        ndcValidator('111111').should.include(
            {result: validaton.OK});
    });
    it('should return OK when ndc has 5-4-2 format', function() {
        ndcValidator('12345-1234-12').should.include(
            {result: validaton.OK});
    });
    it('should return ERROR when ndc is null', function() {
        ndcValidator(null).should.include(
            {result: validaton.ERROR, message: 'NDC is empty'});
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
    it('should return ERROR when ndc has hypen and format is not 5-4-2', function() {
        ndcValidator('12-345-123412').should.include(
            {result: validaton.ERROR, message:'Invalid NDC format, expected: 5-4-2'});
    });
    it('should return ERROR when ndc (5-4-2) has prefix as a separate word', function() {
        ndcValidator('prefix 12345-1234-12').should.include(
            {result: validaton.ERROR, message:'NDC prefix is a separate word'});
    });
    it('should return ERROR when ndc (5-4-2) has sufix as a separate word', function() {
        ndcValidator('12345-1234-12 sufix').should.include(
            {result: validaton.ERROR, message:'NDC sufix is a separate word'});
    });
    it('should return WARNING when ndc is a number with prefix', function() {
        ndcValidator('prefix1234123412').should.include(
            {result: validaton.WARNING, message:'NDC with a prefix'});
    });
    it('should return WARNING when ndc is a number with sufix', function() {
        ndcValidator('12345123412sufix').should.include(
            {result: validaton.WARNING, message:'NDC with a sufix'});
    });
    it('should return WARNING when ndc is 5-4-2 and has a prefix', function() {
        ndcValidator('prefix12345-1234-12').should.include(
            {result: validaton.WARNING, message:'NDC with a prefix'});
    });
    it('should return WARNING when ndc is 5-4-2 and has a sufix', function() {
        ndcValidator('12345-1234-12sufix').should.include(
            {result: validaton.WARNING, message:'NDC with a sufix'});
    });
    it('should return ERROR when ndc is a word', function() {
        ndcValidator('abc').should.include(
            {result: validaton.ERROR, message:'No valid NDC value'});
    });
    it('should return ERROR when ndc has diffrent separator then hypen', function() {
        ndcValidator('12345!1234=12').should.include(
            {result: validaton.ERROR, message:'No valid NDC value'});
    });
});
