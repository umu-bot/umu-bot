module.exports = {
    name: 'add',
    description: 'Adds inputs',
    args: true,
    usage: '<num1> <num2> ...',
    path: __filename,
    execute (message, args, ops) {
        if (args.length < 2) {
            return message.channel.send("Not enough values to add. Try `!add 2 4 10` or `!add 5.2 7`");
        }
        let sum = 0
        args.forEach((value) => {
            sum += parseFloat(value)
        })
        message.channel.send("The sum of " + args + " added together is: " + sum.toString())
    }
}
