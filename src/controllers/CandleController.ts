import { Candle, CandleModel } from "../models/Candle";

export default class CandleController {
  async save(candle: Candle): Promise<Candle> {
    const newCandle = await CandleModel.create(candle)

    return newCandle
  }

  async findLastCandles(quantity: number): Promise<Candle[]> {
    const n = quantity > 0 ? quantity : 10

    const lastCandles = await CandleModel
      .find()
      .sort({ _id: -1 })
      .limit(n)
    
    return lastCandles
  }
}