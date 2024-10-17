import * as dotenv from 'dotenv'
import { connection } from 'mongoose'
import { app } from './app'
import { connectToMongoDB } from './config/db'
import CandleMessageChannel from './messages/CandleMessagesChannel'

const createServer = async () => {
  dotenv.config()
  const PORT = process.env.PORT
  
  await connectToMongoDB()
  const server = app.listen(PORT, () => {
    console.log('Server running at port ' + PORT)
  })

  const candleMsgChannel = new CandleMessageChannel(server)
  candleMsgChannel.init().then(() => {
    candleMsgChannel.consumeMessages()
  })

  process.on('SIGINT', async () => {
    await connection.close()
    server.close()
    console.log('Server and connection to MongoDB closed')
  })
}  

createServer()