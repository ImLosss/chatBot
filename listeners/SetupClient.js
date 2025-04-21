require('module-alias/register');
const qr = require('qrcode');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const console = require('console');

module.exports = (function() {
    return function(bot) {
        bot.on('qr', qrdata => {
            qrcode.generate(qrdata, {
                small: true
            })
            // Generate QR code as a data URI
            qr.toDataURL(qrdata, (err, url) => {
                if (err) {
                    console.error('Failed to generate QR code:', err);
                    return;
                }
            
                // Save QR code data URI as an image file
                const qrCodeFilePath = 'qrcode.png';
                const dataUri = url.split(',')[1];
                const buffer = Buffer.from(dataUri, 'base64');
                
                fs.writeFile(qrCodeFilePath, buffer, (err) => {
                if (err) {
                    console.error('Failed to save QR code as an image:', err);
                } else {
                    console.log(`QR code successfully saved as ${ qrCodeFilePath }`);
                }
                });
            });
        });
        
        bot.once('ready', () => {
            console.log('Client is ready!');
        });
    };
})();