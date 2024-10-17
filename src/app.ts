import express from 'express'
import cors from 'cors'
import candleRouter from './routes/Candles'

export const app = express()

app.use(cors({
  origin: '*', 
  // methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
  // credentials: true,
}))
app.use('/candles', candleRouter)
app.use(express.json())
