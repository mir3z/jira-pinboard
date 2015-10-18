var express = require('express');
var fetchBoard = require('./fetchBoard');

function Server(config) {
    this.config = config || {};

    this.app = express();

    this.setupRouting();
}

Server.prototype.setupRouting = function () {
    this.app.use(express.static('www'));

    this.app.get('/fetch-board', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        fetchBoard(this.config.jira)
            .then(function (board) {
                res.end(board);
            })
            .catch(function (e) {
                res.status(500);
                res.end(JSON.stringify({
                    error: e.message
                }));
            });
    }.bind(this));
};

Server.prototype.start = function () {
    var server = this.app.listen(this.config.app.port, this.config.app.host, function () {
        var addr = server.address();
        console.log('App listening at http://%s:%s', addr.address, addr.port);
    });
};

module.exports = Server;
