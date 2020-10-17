// -------------------------------------------------------
// exported:
// function processFile (file,uploadid)
// -------------------------------------------------------
// uploadid: cbd35731f7e95e25ff6759da60a2e332
// file = {
//      destination: 'uploads/'
//      originalname = 'AFaclity_Purchase_09_2020.csv'
//      filename = 'cbd35731f7e95e25ff6759da60a2e332'
//      mimetype = 'text/csv'
//      encoding = '7bit'
//      fieldname = 'file'
//      path = 'uploads/cbd35731f7e95e25ff6759da60a2e332'
//      size = 559
// }
// -------------------------------------------------------

const fsp = require('fs').promises;
const d3 = require("d3-dsv");
// TODO: add lowdb: https://github.com/typicode/lowdb 
// TRex ---------
const dataValidator = require("./data-validator");
const detector = require("./mappings-detector");


function parseCSV (csvtext) {
    return new Promise((resolve, reject) => {
        const dataArray = d3.csvParseRows(csvtext, d3.autoType);
        resolve(dataArray);
    });
}

function logProcessorState (file, uploadid) {
    console.log({
        uploadid: uploadid,
        started: Date(), 
        original: file.destination + file.originalname,
        upload: file.path,
        header: data[0]
    })
}

function processFile (file) {
    const filename = file.path;
    fsp.readFile(filename, "utf8")
        .then( (textdata) => parseCSV(textdata) )
        .then( (data) => {
            setTimeout(() => {
                mappings = detector.detectMappings(data);
                // TODO: if (!mappings) - use promises 
                results = dataValidator.validate(mappings,data);
                setTimeout(() => logProcessorState(), 2000);
            }, 0);
        } );
    return file.filename;
};

module.exports = {processFile};