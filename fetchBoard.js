var https = require('https');

function fetchBoard(params) {
    var authString = new Buffer(params.auth.username + ':' + params.auth.password).toString('base64');
    var options = {
        hostname: params.host,
        protocol: params.protocol + ':',
        path: '/rest/greenhopper/1.0/xboard/work/allData/?rapidViewId=' + params.board.id,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + authString
        }
    };

    return new Promise(function (resolve, reject) {
        var data = [];

        https.get(options, function(res) {
            console.log('Fetching board id=%d in progress...', params.board.id);

            if (res.statusCode === 200) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    data.push(chunk);
                }).on('end', function () {
                    console.log('Fetching board id=%d is done.', params.board.id);
                    resolve(data.join(''));
                });
            } else {
                console.log("Fetching failed: %d %s", res.statusCode, res.statusMessage);
                reject(new Error("Jira server respond with: " + res.statusCode + " " + res.statusMessage));
            }
        }).on('error', function(e) {
            console.log("Fetching failed: error occurred");
            reject(new Error("Error occurred"));
        });
    });
}

module.exports = fetchBoard;
