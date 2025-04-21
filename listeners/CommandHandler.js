require('module-alias/register');
const fs = require('fs');
const console = require('console');
const { ask } = require('controller/AskController');
const { cutVal } = require('utils');

module.exports = (function() {
    return function(bot) {
        bot.on('message', async (msg) => {
            const prefixFunctions = {
                'ask': (msg, sender, client, arg, chat) => ask(arg, chat),
            };    
            
            const prefix = ['/', '!'];

            let config = fs.readFileSync(`./config.json`, 'utf-8');
            config = JSON.parse(config);

            const chat = await msg.getChat();
            
            bot.sendPresenceAvailable();

            const text = msg.body.toLowerCase() || '';

            let sender = msg.from;

            // console.log(msg.body, `MessageFrom:${ chat.name }`);
            const value = cutVal(msg.body, 1);

            if(!chat.isGroup) {
                for (const pre of prefix) {
                    if (text.startsWith(`${pre}`)) {
                        const funcName = text.replace(pre, '').trim().split(' ');

                        if (prefixFunctions[funcName[0]]) {     
                            console.log(value, `cmd:${ funcName[0] }`);
                            return prefixFunctions[funcName[0]](msg, sender, bot, value, chat);
                        } 
                    }
                }
            }
        });
    };
})();