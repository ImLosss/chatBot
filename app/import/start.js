require('module-alias/register');

module.exports = (function() {
    return function(bot) {
        require('listeners/SetupClient')(bot);
        require('listeners/CommandHandler')(bot);
    };
})();