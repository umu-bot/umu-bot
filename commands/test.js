module.exports = {
    name: 'test',
    description: 'test function',
    execute (message, args){
        message.channel.send ('test ' + args);
    }
}