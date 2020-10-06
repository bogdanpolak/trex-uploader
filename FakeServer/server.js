var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

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
    start: function () {
        const self = this;
        const dbFileName = this.dbFileName;
        const app = this.app;
        const port = this.port;
        app.use(bodyParser.json()); // support json encoded bodies
        app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
        self.loadDatabase(dbFileName)
            .then( () => self.startHttpServer(app, port) )
            .then( (app) => {
                app.get('/results', (req, res) => self.appGetResults(req, res));   
            } )
        ;
    }
}

ServerRunner.start();