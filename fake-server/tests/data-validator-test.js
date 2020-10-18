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
    ['Aaaa', rowdata.ndc, rowdata.cost, rowdata.volume, rowdata.total],
    ['Bbbb', '2222222', 9.50, 3, 28.50]
];

const testValidate = (rowdata) => dataValidator.validate( createMapping(), 
    createData(rowdata) );

describe('validate', function() {
    it('should return empty array when data are valid', function() {
        testValidate({ndc:'111111111', cost:5, volume:2, total:10}).should
            .to.be.an('array').to.have.lengthOf(0);
    });
    it('should return one error when ndc is zero', function() {
        testValidate({ndc: 0, cost:5, volume:2, total:10}).should
            .to.have.lengthOf(1);
    });
});
