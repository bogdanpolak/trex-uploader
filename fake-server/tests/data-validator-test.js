'use strict';
// jshint expr: true

const chai = require('chai');
const dataValidator = require('../src/data-validator');
const expect = chai.expect;
chai.should();

function createMapping(){
    let mappings = new Map();
    mappings['DESC'] =  {no: 1, name:'Description'};
    mappings['NDC'] =   {no: 2, name:'NDC'};
    mappings['COST'] =  {no: 3, name:'Purchase Cost'};
    mappings['VOL'] =   {no: 4, name:'Volume'};
    mappings['TOTAL'] = {no: 5, name:'Total Cost'};
    return mappings;
};


const createData = (rowdata) =>  [
    ['DESC','NDC','COST','VOL','TOTAL'],
    ['Aaaa', rowdata.ndc, rowdata.cost || 5, rowdata.volume || 2, rowdata.total || 10],
    ['Bbbb', '2222222', 9.50, 3, 28.50]
];

const mapping = createMapping();

describe('validate', function() {
    it('should return empty array when data are valid', function() {
        dataValidator.validate( mapping, createData({ndc:'111111111'}) ).should
            .have.lengthOf(0);
    });
    it('should return one error when ndc is zero', function() {
        dataValidator.validate( mapping, createData({ndc:0}) ).should
            .deep.equal([{type: 'error', message: 'NDC is equal to 0', column: 1, row: 1}]);
    });
    it('should return one error when ndc is zero', function() {
        dataValidator.validate( mapping, createData({ndc:'prefix12345111122'}) ).should
            .deep.equal([{type: 'warning', message: 'NDC with a prefix', column: 1, row: 1}]);
    });
});
