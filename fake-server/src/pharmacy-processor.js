const fsp = require('fs').promises;
const d3 = require("d3-dsv");
const { report } = require('process');
const validators = require("./validators");
// add lowdb: https://github.com/typicode/lowdb 

function parseCSV (csvtext) {
    return new Promise((resolve, reject) => {
        const dataArray = d3.csvParseRows(csvtext, d3.autoType);
        resolve(dataArray);
    });
}

function DetectMappings(data) {
    let mappings = new Map()
    mappings['Product Description'] =   {no: 1, name:'Description'};
    mappings['NDC'] =                   {no: 2, name:'NDC'};
    mappings['Average Invoice Price'] = {no: 3, name:'Purchase Cost'};
    mappings['Shipped Qty'] =           {no: 4, name:'Volume'};
    mappings['Total Ext Cost'] =        {no: 5, name:'Total Cost'};
    mappings['Account Type'] =          {no: 6, name:'Account Type'};
    return mappings;
}

const validaton = validators.validaton;

function ValidateData(mappings, data) {
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

    const results = [
        {
            "type": "error",
            "message": "NDC cannot be empty",
            "row": 1,
            "column": 5
        },{
            "type": "error",
            "message": "Purchase cost is not a numeric value",
            "row": 3,
            "column": 8
        }
    ];
    return results;
}

function processFile (file,uploadid) {
    // ---------------------------------------
    // file.destination: 'uploads/'
    // file.originalname = 'AFaclity_Purchase_09_2020.csv'
    // file.filename = 'cbd35731f7e95e25ff6759da60a2e332'
    // file.mimetype = 'text/csv'
    // file.encoding = '7bit'
    // file.fieldname = 'file'
    // file.path = 'uploads/cbd35731f7e95e25ff6759da60a2e332'
    // file.size = 559
    // ---------------------------------------
    const filename = "../data/AFaclity_Purchase_09_2020.csv";
    fsp.readFile(filename, "utf8")
        .then( (textdata) => parseCSV(textdata) )
        .then( (data) => {
            mappings = DetectMappings(data);
            results = ValidateData(mappings,data);

            setTimeout(() => console.log({
                uploadid: uploadid,
                started: Date(), 
                original: file.destination + file.originalname,
                upload: file.path,
                header: data[0]
            }), 3000);
        } );
};

module.exports = {processFile};