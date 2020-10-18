// -------------------------------------------------------
// exported:
// function addUpload (lowdb, upload)
// -------------------------------------------------------
// uploadid: cbd35731f7e95e25ff6759da60a2e332
// upload = {
//     id: "cbd35731f7e95e25ff6759da60a2e332",, 
//     filename: "Faclity_Purchase_09_2020.csv",
//     upload: "uploads/cbd35731f7e95e25ff6759da60a2e332",
//     facilityid: "1234", 
//     period: "09-2020"
// }
// -------------------------------------------------------

const UPLOADS_NODE = 'uploads'

function getUpload (lowdb, uploadid){
    let row = lowdb.get(UPLOADS_NODE)
        .find({id: uploadid})
        .value();
    return row;
}

function addUpload (lowdb, upload){
    upload.status = 0;
    upload.results = [];
    lowdb.get(UPLOADS_NODE).push(upload).write();
}

function updateStatus (lowdb, uploadid, newstatus){
    let row = lowdb.get(UPLOADS_NODE)
        .find({id: uploadid})
        .value();
    // TODO: Check row is null
    row.status = newstatus;
    lowdb.write();
}

function updateResults (lowdb, uploadid, results){
    let row = lowdb.get(UPLOADS_NODE)
        .find({id: uploadid})
        .value();
    // TODO: Check row is null
    row.status = 100;
    row.results = results;
    lowdb.write();
}

module.exports = {getUpload, addUpload, updateStatus, updateResults};