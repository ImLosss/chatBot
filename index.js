require('module-alias/register');
const { Client, LocalAuth } = require('whatsapp-web.js');

const bot = new Client({
    authStrategy: new LocalAuth(), // your authstrategy here
    puppeteer: {
        args: ['--no-sandbox'],
        // executablePath: "/usr/bin/chromium-browser"
    }
});

require('import')(bot);

bot.initialize();