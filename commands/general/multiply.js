module.exports = {
    name: 'multiply',
    description: 'Multiplies inputs',
    args: true,
    usage: '<num1> <num2> ...',
    path: __filename,
    execute (message, args, ops) {
        if (args.length < 2) {
            return message.channel.send("Not enough values to multiply. Try `!multiply 2 4 10` or `!multiply 5.2 7`");
        }
        let product = 1
        args.forEach((value) => {
            product *= parseFloat(value)
        })
        message.channel.send("The product of " + args + " multiplied together is: " + product.toString())
    }
}
