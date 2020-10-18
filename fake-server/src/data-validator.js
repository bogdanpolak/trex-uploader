// -------------------------------------------------------
// exported:
// function validate(mappings, data)
// -------------------------------------------------------
// mappings = Map() {
//     "Product Description": {no: 1, name:'Description'},
//     "NDC": {no: 2, name:'NDC'}
// }
// data = {
//    0: [,ABC #,Product Description', 'NDC,Average Invoice Price', 'Shipped Qty', 'Report Qty', 'Total Ext Cost', 'Account Type'],
//    1: [10148276, 'KEYTRUDA 100MG/4ML SDV SOL ASD', null, 3373.63, 38, 0.77, 128197.94, '340B']
// }

const validators = require("./cell-validators");

const validaton = validators.validaton;

function validate(mappings, data) {
    if (!data || data.length==0)
        return [];
    const header = data[0];
    const columncount = header.length;
    var columns = [];
    header.forEach(
        e => columns.push({}));
    
    for (var colidx=0; colidx<columncount; colidx++) {
        columnName = header[colidx];
        const mapping = mappings[columnName];
        if (mapping) {
            if (mapping.no === 2) {
                mapping.idx = colidx;
                mapping.validator = validators.ndcValidator; 
            }
            columns[colidx] = mapping;
        }
    }
    var report = [];
    for (let rowidx=1; rowidx<data.length; rowidx++) {
        for (var colidx=0; colidx<columncount; colidx++) {
            let row = data[rowidx];
            if ('validator' in columns[colidx]) {
                value = row[colidx];
                result = columns[colidx].validator(value);
                if (result.result === validaton.ERROR) {
                    report.push({
                        "type": "error",
                        "message": result.message,
                        "row": rowidx,
                        "column": colidx
                    });         
                }
            }
        } 
    }
    return report;
}

module.exports = {validate};