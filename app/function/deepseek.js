require('module-alias/register');
const axios = require('axios');
const fs = require('fs');
const console = require('console');
const { readJSONFileSync, writeJSONFileSync } = require('function/utils');

async function deepseek(prompt, dirChat, globalChat) {
    let chatHistory = [];
    let tempChatHistory = [];

    if(fs.existsSync(dirChat)) {
        chatHistory = readJSONFileSync(dirChat)
    }

    chatHistory.push({role: "user", content: prompt});

    tempChatHistory = structuredClone(chatHistory);
    tempChatHistory.unshift({role: "system", content: globalChat});

    const response = await reqDeepseek(tempChatHistory, 'deepseek-chat')

    if(!response.status) return `Gagal: ${ response.message }`;

    chatHistory.push({role: 'assistant', content: response.message});

    if(chatHistory.length > 20) chatHistory.splice(0, 2);

    writeJSONFileSync(dirChat, chatHistory);

    return response.message;
}

async function reqDeepseek(chatHistory, model) {
    let config = readJSONFileSync(`./config.json`)

    let error;
    const url = 'https://api.deepseek.com/chat/completions';

    const headers = {
        'accept': 'application/json',
        'authorization': `Bearer ${config.DEEPSEEK_APIKEY}`,
        'content-type': 'application/json'
    };

    const data = {
        messages: chatHistory,
        model: model,
        max_tokens: 8192,
        response_format: { type: 'text' },
        temperature: 1
    };
    
    try {
        const response = await axios.post(url, data, { headers, timeout: 300000 });
        console.log(response.data);
        if(response.data == '') return { status: false, message: error };
        
        const response_message = response.data.choices[0].message.content;
        let cost_input_miss_cny = (response.data.usage.prompt_cache_miss_tokens / 1000000) * 2;
        let cost_input_hit_cny = (response.data.usage.prompt_cache_hit_tokens / 1000000) * 0.5;
        let cost_output_cny = (response.data.usage.completion_tokens / 1000000) * 8;

        return {
            status: true,
            message: response_message,
            total_tokens: response.data.usage.total_tokens,
            cost: cost_input_hit_cny + cost_input_miss_cny + cost_output_cny
        } 
    } catch (err) {
        error = err.message;

        await new Promise(resolve => setTimeout(resolve, 500)); // Delay for 1 second

        return {
            status: false,
            message: error
        };
    }
}

module.exports = {
    reqDeepseek, deepseek
}