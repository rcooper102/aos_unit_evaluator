const fs = require('fs');
const http = require('http');
const shell = require('shelljs');

const OUTPUT = './application/osiris-es5.js';
const CDN_LINK = 'http://osirisjs.net/osiris-1.1-min.js';

const download = (url, dest, cb) => {
    const file = fs.createWriteStream(dest);

    const request = http.get(url, (response) => {
        // check if response is success
        if (response.statusCode !== 200) {
            return cb('Response status was ' + response.statusCode);
        }

        response.pipe(file);
    });

    // close() is async, call cb after close completes
    file.on('finish', () => file.close(cb));

    // check for request error too
    request.on('error', (err) => {
        fs.unlink(dest);
        return cb(err.message);
    });

    file.on('error', (err) => { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result) 
        return cb(err.message);
    });
};

download(CDN_LINK , OUTPUT, (e)=>{
    shell.exec(`npx babel ${OUTPUT} -o ${OUTPUT} >/dev/null 2>&1`);
});

