import { Channel, connect } from 'amqplib'
import * as dotenv from 'dotenv'
import CandleController from '../controllers/CandleController'
import { Server } from 'socket.io'
import * as http from 'http'
import { Candle } from '../models/Candle'

dotenv.config()

export default class CandleMessageChannel {
  private _channel!: Channel
  private _candleController: CandleController
  private _io: Server

  constructor(server: http.Server) {
    this._candleController = new CandleController()
    this._io = new Server(server, {
      cors: {
        origin: process.env.SOCKET_CLIENT_SERVER,
        methods: ["GET", "POST"]
      }
    })
    this._io.on('connection', () => console.log('WebSocket connection success'))
  }

  public async init() {
    await this.createMessageChannel()
  }

  private async createMessageChannel() {
    try {
      const connection = await connect(process.env.AMQP_SERVER!)
      console.log('Connected to RabbitMQ')
      this._channel = await connection.createChannel()
      this._channel.assertQueue(process.env.QUEUE_NAME!)
    } catch (error) {
      console.error('Connection to RabbitMQ failed')
      console.log(error)
    }
  }

  consumeMessages() {
    this._channel.consume(process.env.QUEUE_NAME!, async msg => {
      if(!msg) {
        console.log("No message found")
        return
      }
      const candleObj = JSON.parse(msg.content.toString())
      console.log('- Candle received')
      console.log(candleObj)

      try {
        const candle: Candle = await this._candleController.save(candleObj)
        console.log("- Candle saved at Database")
        this._io.emit(process.env.SOCKET_EVENT_NAME!, candle)
        this._channel.ack(msg)
        console.log("- Candle emitted to Client via WebSocket")

      } catch (error) {
        console.log(error)
        console.log('Error while trying to process Candle')
      }

    })
    console.log('Candle consumer started')
  }
}