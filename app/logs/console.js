require('module-alias/register');
const fs = require('fs');
const moment = require('moment-timezone');
const lockfile = require('proper-lockfile');
const { getLocation, getLocationError, readJSONFileSync, writeJSONFileSync } = require('function/utils');
const CircularJSON = require('circular-json');

async function error(errorMsg) {
    try {
        // Tentukan zona waktu Makassar
        const time = getTime();
        const file = getLocationError();

        console.log(`[${ time } / error] ${ errorMsg.message }`);

        let errorData = [];

        if(fs.existsSync(`app/logs/error.json`)) {
            errorData = readJSONFileSync(`app/logs/error.json`)
        }

        const stackLines = errorMsg.stack.split('\n');

        const data = {
            type: 'Error',
            date: time,
            errorLocation: file,
            errorMessage: errorMsg.message? errorMsg.message : null,
            error: errorMsg instanceof Error ? `${errorMsg.message}\n${errorMsg.stack}` : errorMsg
        }

        errorData.push(data);

        if(errorData.length > 50) errorData.splice(0, 1);

        writeJSONFileSync('app/logs/error.json', errorData);
    } catch (error) {
        console.log('error saat menulis log: ', error.message);
    }
}

async function log(log, type = 'info') {
    try {
        // Tentukan zona waktu Makassar
        const file = getLocation();

        const time = getTime();
        if(typeof(log) == 'object') {
            log = CircularJSON.stringify(log);
            type = "object"
        }
        console.log(`[${ time } / ${ type }] ${ log }`);

        let logData = [];

        if(fs.existsSync(`app/logs/log.json`)) {
            logData = readJSONFileSync(`app/logs/log.json`)
        }
         
        const data = {
            type: type,
            date: time,
            location: file,
            message: log
        }

        logData.push(data);

        if(logData.length > 500) logData.splice(0, 1);

        writeJSONFileSync('app/logs/log.json', logData);
    } catch (error) {
        console.log('error saat menulis log: ', error.message);
    }
}

function getTime() {
    // Tentukan zona waktu Makassar
    const time = moment().tz('Asia/Makassar');

    // Ambil tanggal, jam, dan menit
    const tanggal = time.format('YYYY-MM-DD');
    const jam = time.format('HH');
    const menit = time.format('mm');

    return `${ tanggal } / ${ jam }:${ menit }`;
}

module.exports = {
    log, error
}