const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const fsp = require('fs').promises;
const cors = require('cors');
const multer  = require('multer')
const pharmProcessor = require('./src/pharmacyProcessor');
// add lowdb: https://github.com/typicode/lowdb 

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

const ServerRunner = {
    dbFileName: 'db.json',
    port: 44373,
    database: null,
    app: express(),
    status: 0,

    loadDatabase: function(dbFileName) {
        const self = this;
        return new Promise((resolve, reject) => {
            fs.readFile(dbFileName, 'utf8', function (err, data) {
                if (err) throw err;
                self.database = JSON.parse(data);
                console.log("[OK] database loaded");
                resolve();
            })
        });
    },
    startHttpServer: function(app, port) {
        return new Promise((resolve, reject) => {
            var server = app.listen(port, function () {
                console.log("[OK] Express server started: http://%s:%s",
                    server.address().address, 
                    server.address().port);
                resolve(app);
            })            
        });
    },
    appGetResults: function (req, res) {
        res.json(this.database.results);
        console.log("[HTTP] GET /results");
    },
    appPostImport: function (req, res) {
        console.log('[HTTP] POST %s (%s)', req.url, new Date().toISOString());
        this.status=0;
        if ((req.file) && (req.body.facilityid) && (req.body.period)) {
            const uploadid = genUUID();
            setTimeout(() => pharmProcessor.processFile(req.file,uploadid), 0);
            res.json({uploadid: uploadid });
        }
        else
            res.json({uploadid: "11111111-2222-3333-76b2-08d866c9db60"});
    },
    start: function () {
        const self = this;
        const dbFileName = this.dbFileName;
        const app = this.app;
        const port = this.port;
        // support json encoded bodies
        // no support for extended encoded bodies (eg. MIME)
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false })); 
        app.use(cors());
        self.loadDatabase(dbFileName)
            .then( () => self.startHttpServer(app, port) )
            .then( (app) => {
                app.get('/results', 
                    (req, res) => self.appGetResults(req, res)
                );
                app.post('/import', multerUpload.single('file'), 
                    (req, res, next) => self.appPostImport(req, res)
                );
                app.get('/progress', 
                    (req, res) => res.json({status: self.status+=1})
                );
            } )
        ;
    }
}

ServerRunner.start();