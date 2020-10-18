const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const fsp = require('fs').promises;
const cors = require('cors');
const multer  = require('multer')
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
// TRex ---------
const pharmacyProcessor = require('./pharmacy-processor');
const uploadsRepository = require('./uploads-repository');

const multerUpload = multer({ dest: 'uploads/' });

function genUUID() {
    var UUID= 'xxxxxxx-xxxx-4xxx-yxxx-xzx'.replace(/[xy]/g, 
        (ch) => {
            const rand = Math.random() * 16 | 0;
            const hex = (ch == 'x') ? rand : (rand & 3 | 8);
            return hex.toString(16);
        });
    var str = new Date().getTime().toString(16).slice(1);
    return UUID.replace(/[z]/, str);
}

const dbfilename = 'db.json';
const adapter = new FileSync(dbfilename);
const db = lowdb(adapter);
// Uncomment next line to delete all uploads from database
db.set('uploads', [{
    id: "11112222333344445555666677778888",
    original: "Purchase_09_2020.csv",
    upload: "../data/Purchase_09_2020.csv",
    facilityid: "1111",
    period: "2020-09",
    created: "2020-10-01",
    status: 100,
    results: [{
        type: "error",
        message: "NDC is empty",
        row: 1,
        column: 2
        }, {
        type: "error",
        message: "Invalid NDC format, expected: 5-4-2",
        row: 4,
        column: 2
        }]
}]).write();

const CreateUpload = (request, created) => ({
    id: request.file.filename, 
    original: request.file.originalname, // AFaclity_Purchase_09_2020.csv
    upload: request.file.path, // uploads/cbd35731f7e95e25ff6759da60a2e332
    facilityid: request.body.facilityid, 
    period: request.body.period,
    created: created.toISOString(), 
});

const ServerRunner = {
    status: 0,

    appPostImport: function (req, res) {
        console.log('[HTTP] POST %s (%s)', req.url, new Date().toISOString());
        this.status=0;
        if ((req.file) && (req.body.facilityid) && (req.body.period)) {
            // Verify uploade file format
            if (req.file.mimetype!='text/csv' || req.file.encoding != '7bit') {
                res.status(406)
                    .send('{"error":"Not Found. Unsupported file format, expected text file in CSV format"}');
                return;
            }
            const upload = CreateUpload(req, new Date());
            uploadsRepository.addUpload(db, upload);
            pharmacyProcessor.processFile(db, upload);
            uploadsRepository.updateStatus(db, upload.id, 10);
            res.json({ uploadid: upload.id });
        }
        else
            res.json({uploadid: "11111111-2222-3333-76b2-08d866c9db60"});
    },
    appGetResults: function (req, res, next) {
        console.log("[HTTP] GET /results");
        if (!'uploadid' in req.query) {
            res.status(404)
                .send('{"error":"Not Found. Unsupported file format, expected text file in CSV format"}');
            return;
        }
        const uploadid = req.query.uploadid;
        const upload = uploadsRepository.getUpload(db, uploadid);
        // TODO: Check row is null
        res.json({status: upload.status, results: upload.results});
    }
}

function startHttpServer(app, port) {
    const server = app.listen(port, () => {
        const a = server.address();
        const host = a.address='::' ? 'localhost' : a.address;
        console.log( "[OK] Server started: http://%s:%s", host, a.port);
    });
    return server;
}

function runExpressServer(port) {
    const app = express();
    app.use(express.static('../TRexUploader'))
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false })); 
    app.use(cors());
    startHttpServer(app, port);

    app.post('/import', multerUpload.single('file'), 
        (req, res, next) => ServerRunner.appPostImport(req, res)
    );
    app.get('/progress', 
        (req, res) => res.json( {status: ServerRunner.status+=1} )
    );
    app.get('/results', 
        (req, res, next) => ServerRunner.appGetResults(req, res, next)
    );
}

module.exports = {runExpressServer};