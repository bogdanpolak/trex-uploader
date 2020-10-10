function processFile (file) {
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
    return {
        started: Date(), 
        original: file.destination + file.originalname,
        upload: file.path
    }
};

module.exports = {processFile};