const amqp = require("amqplib/callback_api")

amqp.connect("amqp://localhost", (connError, connection) => {
    if(connError){
        console.log("aa")
        throw connError
    }

    connection.createChannel((channelError, chanel ) => {
        if(channelError){
            console.log("bb")
            throw channelError
        }
        const QUEUE = `codingtest`
        chanel.assertQueue(QUEUE)
        chanel.sendToQueue(QUEUE, Buffer.from("Hello from its coding time."))
        console.log (`Message send ${QUEUE}`)
    })
})