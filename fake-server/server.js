const express = require('express');
const fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const upload = multer({ dest: 'uploads/' });

const ServerRunner = {
    dbFileName: 'db.json',
    port: 44373,
    database: null,
    app: express(),

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
        // res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
        res.json(this.database.results);
        console.log("[HTTP] GET /results");
    },
    handleFormPostRequest: function (req, res) {
        console.log('\n-- INCOMING REQUEST AT ' + new Date().toISOString());
        console.log(req.method + ' ' + req.url);
        console.log(req.body);
        res.json({uploadid: "aaaaaaaaaaa"});
        // res.json(this.database.results[0]);
    },
    start: function () {
        const self = this;
        const dbFileName = this.dbFileName;
        const app = this.app;
        const port = this.port;
        app.use(bodyParser.json()); // support json encoded bodies
        app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
        app.use(cors());
        self.loadDatabase(dbFileName)
            .then( () => self.startHttpServer(app, port) )
            .then( (app) => {
                app.get('/results', (req, res) => self.appGetResults(req, res));
                app.post('/import', // upload.any(), 
                    (req, res) => self.handleFormPostRequest(req, res));
            } )
        ;
    }
}

ServerRunner.start();