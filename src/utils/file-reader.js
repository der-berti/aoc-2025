const fs = require('fs');
const MAIN_DIR = './inputs/';
const readFileSync = (filePath) => {
    return fs.readFileSync(MAIN_DIR + filePath, { encoding: 'utf8' });
}

module.exports = {
    readFileSync,
}