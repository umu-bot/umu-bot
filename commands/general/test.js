module.exports = {
    name: 'test',
    description: 'test function',
    path: __filename,
    execute (message, args){
        message.channel.send ('UMIE ' + args);
    }
}