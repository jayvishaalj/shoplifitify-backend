const { v4: uuidv4 } = require('uuid');

module.exports.sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports.getRandomName = () => {
    let hexString = uuidv4();
    // remove decoration
    hexString = hexString.replace(/-/g, "");
    let base64String = Buffer.from(hexString, 'hex').toString('base64')
    base64String = base64String.replace(/(\\|\/)$|^(\\|\/\/)/g, "");
    return base64String;
}
