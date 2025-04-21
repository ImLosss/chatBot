require('module-alias/register');
const console = require('console');
const { withErrorHandling, readJSONFileSync } = require('utils')
const { deepseek } = require('function/deepseek');

const ask = withErrorHandling(async (arg, chat) => {
    let config = readJSONFileSync(`./config.json`)
    let response;
    
    if(!arg) return await chat.sendMessage('Command salah/kurang');
    else response = await deepseek(arg, 'database/data_chat/deepseek', config.GLOBAL_CHAT);
    
    await chat.sendMessage(response);
})

module.exports = {
    ask
}