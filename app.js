var Server = require('./Server');
var defaults = require('lodash.defaultsdeep');
var result = require('lodash.result');
var pick = require('lodash.pick');
var yargs = require('yargs');


function readConfig(file) {
    try {
        return require('./' + file);
    } catch(e) {
        return null;
    }
}

function checkRequiredOpts(optKey, options) {
    var errorFound = false;
    optKey.forEach(function (key) {
        if (!result(options, key)) {
            process.stdout.write("Error: Missing " + key + " option\n");
            errorFound = true;
        }
    });

    if (errorFound) {
        process.stdout.write("\n" + yargs.help());
        process.exit(1);
    }
}

var argv = yargs
    .option('jira.auth.username', {
        alias: 'u',
        describe: 'Jira user name'
    })
    .option('jira.auth.password', {
        alias: 'p',
        describe: 'Jira user password'
    })
    .option('jira.board.id', {
        alias: 'i',
        describe: 'Jira agile board id'
    })
    .option('jira.host', {
        alias: 'o',
        describe: 'Jira host name'
    })
    .option('jira.protocol', {
        alias: 'r',
        default: 'https',
        describe: 'Jira server protocol'
    })
    .option('app.host', {
        alias: 's',
        default: 'localhost',
        describe: 'App server bind address'
    })
    .option('app.port', {
        alias: 't',
        default: 8080,
        describe: 'App server port'
    })
    .options('config',  {
        alias: 'f',
        default: 'config.json',
        describe: 'Configuration file'
    })
    .usage('Usage: $0 [options]')
    .help('help')
    .alias('h', 'help')
    .argv;

var cmdLineOptions = pick(argv, ['jira', 'auth', 'board', 'app']);
var options = defaults({}, cmdLineOptions, readConfig(argv.config));

checkRequiredOpts([
    'jira.host',
    'jira.protocol',
    'jira.auth.username',
    'jira.auth.password',
    'jira.board.id',
    'app.host',
    'app.port'
], options);

var server = new Server(options);
server.start();