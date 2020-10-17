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

const ServerRunner = {
    status: 0,

    appGetResults: function (req, res, next) {
        console.log("[HTTP] GET /results");
        results=db.get('results').value();
        res.json(results);
    },
    appPostImport: function (req, res) {
        console.log('[HTTP] POST %s (%s)', req.url, new Date().toISOString());
        this.status=0;
        if ((req.file) && (req.body.facilityid) && (req.body.period)) {
            const uploadid = pharmacyProcessor.processFile(req.file, db);
            res.json({ uploadid: uploadid });
        }
        else
            res.json({uploadid: "11111111-2222-3333-76b2-08d866c9db60"});
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