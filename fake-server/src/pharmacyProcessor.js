const fsp = require('fs').promises;
const d3 = require("d3-dsv");
// add lowdb: https://github.com/typicode/lowdb 

function parseCSV (csvtext) {
    return new Promise((resolve, reject) => {
        const dataArray = d3.csvParseRows(csvtext, d3.autoType);
        resolve(dataArray);
    });
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