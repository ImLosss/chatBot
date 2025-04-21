require('module-alias/register');
const path = require('path');
const fs = require('fs');
// const console = require('console');
const lockfile = require('proper-lockfile');

function readJSONFileSync(filePath) {
    let release;
    try {
        // Lock the file for reading
        release = lockfile.lockSync(filePath);
        
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        return JSON.parse(fileContent);
    } catch (error) {
        console.error('error');
    } finally {
        if (release) {
            release();
        }
    }
}

function writeJSONFileSync(filePath, data) {
    let release;
    try {
        // Pastikan direktori ada sebelum menulis file
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

         // Pastikan file ada sebelum mengunci
         if (!fs.existsSync(filePath)) {
            console.log('Membuat file:', filePath);
            fs.writeFileSync(filePath, '{}', 'utf-8'); // Buat file kosong agar bisa dikunci
        }

        // Lock the file for writing
        release = lockfile.lockSync(filePath);
        
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonData, 'utf-8');
    } catch (error) {
        console.error('Error writing file:', error);
    } finally {
        if (release) {
            release();
        }
    }
}

function getLocation() {
    const error = new Error();
    const stack = error.stack.split('\n');

    const projectRoot = getProjectRoot(__dirname);

    // Mulai dari elemen ke-2 untuk melewati baris pertama yang merupakan lokasi Error dibuat
    for (let i = 3; i < stack.length; i++) {
        const callerLine = stack[i];
        const filePathMatch = callerLine.match(/\((.*):\d+:\d+\)/) || callerLine.match(/at (.*):\d+:\d+/);
        
        if (filePathMatch) {
            const fullPath = filePathMatch[0];
            if (fullPath && fullPath.includes(projectRoot) && !fullPath.includes('node:internal/modules') && !fullPath.includes('service/utils.js') && !fullPath.includes('service/utils.js')) {
                
                // console.log(fullPath);
                let fileName = path.basename(fullPath); 
                fileName = fileName.replace(/[()]/g, '');

                return fileName;
            }
        }
    }
    return null;
}

function getLocationError() {
    const error = new Error();
    const stack = error.stack.split('\n');

    const projectRoot = getProjectRoot(__dirname);

    // Mulai dari elemen ke-2 untuk melewati baris pertama yang merupakan lokasi Error dibuat
    for (let i = 3; i < stack.length; i++) {
        const callerLine = stack[i];
        const filePathMatch = callerLine.match(/\((.*):(\d+):(\d+)\)/) || callerLine.match(/at (.*):(\d+):(\d+)/);

        if (filePathMatch) {
            const fullPath = filePathMatch[0];
            if (fullPath && fullPath.includes(projectRoot) && !fullPath.includes('node:internal/modules') && !fullPath.includes('service/utils.js') && !fullPath.includes('service/utils.js')) {
                
                // console.log(fullPath);
                let fileName = path.basename(fullPath); 
                fileName = fileName.replace(/[()]/g, '');

                return fileName;
            }
        }
    }
    return null;
}

function getProjectRoot(dir) {

    while (dir !== path.parse(dir).root) {
        if (fs.existsSync(path.join(dir, 'package.json'))) {
            return path.basename(dir);
        }
        dir = path.dirname(dir);
    }

    return 'not found';
}

function deleteFile(dir) {
    fs.unlink(dir, err => {
        if (err) {
            return;
        }
    });
}

function cutVal(value, index) {
    const words = value.split(' '); 
    return words.slice(index).join(' '); 
}

const withErrorHandling = (fn) => {
    return async (...args) => {
        try {
            await fn(...args);
        } catch (err) {
            console.error(err);
        }
    };
};

module.exports = {
    writeJSONFileSync, readJSONFileSync, cutVal, withErrorHandling, getLocation, getLocationError, deleteFile
}