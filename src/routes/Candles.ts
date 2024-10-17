import { Request, Response, Router } from 'express'
import CandleController from '../controllers/CandleController'

const candleRouter = Router()
const candleController = new CandleController()

candleRouter.get('/:quantity', async (req: Request, res: Response): Promise<any> => {
  const quantity = parseInt(req.params.quantity)

  const candles = await candleController.findLastCandles(quantity)
  console.log(`Capturou ${candles.length} candles`)
  return res.status(200).json(candles)
})

export default candleRouter