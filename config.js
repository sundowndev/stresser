'use strict';
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const url = argv._[0];

if (argv.h || argv.help || !url) {
    console.log(
        `
    Usage: stresser <URL> [options]

    Options:
        -h | --help
            Outputs this helpful information

        --html=<path/to/report/file.html> [${path.join(__dirname, 'report', `report-${Date.now()}.html`)}]
            Outputs an HTML report file to location
            Set --html=false if you want to disable it

        -t | --timeout= <milliseconds> [10000]
            Sets the time a request waits for response

        -n | --count= <number> [10]
            Sets the number of seconds

        -c | --concurrent= <number> [100]
            Sets the number of concurrent requests

        -m | --method <GET|HEAD|POST|PUT|DELETE|*> [GET]
            Sets the request method

        -v | --verbose <e|hc>
            Sets verbosity
                - e: Errors
                - c: HTTP Status Codes
                - b: HTTP body
    Example: stresser http://example.com/page.html -c 500 -n 20000 -t 20000 --html=/home/reports/report-$(date +%s).html
`
    );

    process.exit(1);
}

const html = argv.html === false || argv.html === 'false' ? null : argv.html || path.join(__dirname, 'report', `report-${Date.now()}.html`);
const timeout = argv.t || argv.timeout || 10000;
const count = argv.n || argv.count || 10;
const concurrent = argv.c || argv.concurrent || 100;
const method = argv.m || argv.method || 'get';

const _v = argv.v || argv.verbose || '';
const verbose = {
    e: ~_v.indexOf('e'),
    c: ~_v.indexOf('c'),
    b: ~_v.indexOf('b')
};

const CPUs = require('os').cpus().length;
const concurrentPerCPU = Math.floor(concurrent / CPUs);

module.exports = {
    url,
    method,
    count,
    concurrent,
    timeout,
    html,
    verbose,
    concurrentPerCPU,
    CPUs
};