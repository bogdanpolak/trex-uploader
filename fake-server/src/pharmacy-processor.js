// -------------------------------------------------------
// exported:
// function processFile (lowdb, upload)
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
// TRex ---------
const dataValidator = require("./data-validator");
const detector = require("./mappings-detector");
const uploadsRepository = require('./uploads-repository');


function parseCSV (upload, csvtext) {
    return new Promise((resolve, reject) => {
        const dataArray = d3.csvParseRows(csvtext, d3.autoType);
        resolve(dataArray);
    });
}

function asyncValidateCSV (upload, csvdata, lowdb) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            mappings = detector.detectMappings(csvdata);
            // TODO: if (!mappings) - use promises 
            const results = dataValidator.validate(mappings,csvdata);
            uploadsRepository.updateResults(lowdb, upload.id, results);
        }, 0);
        resolve(csvdata);
    });
}

function consolelogProcessorState (upload, csvdata) {
    return new Promise((resolve, reject) => {
        logdata = {
            uploadid: upload.id,
            original: upload.original,
            upload: upload.upload,
            created: upload.created,
            header: csvdata[0]
        };
        console.log(logdata);
        resolve(logdata);
    });
}

function processFile (lowdb, upload) {
    fsp.readFile(upload.upload, "utf8")
        .then( (textdata) => parseCSV(upload, textdata) )
        .then( (csvdata) =>  asyncValidateCSV(upload, csvdata, lowdb) )
        .then( (csvdata) => consolelogProcessorState (upload, csvdata) )
};

module.exports = {processFile};