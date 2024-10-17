import { connect } from 'mongoose'
import * as dotenv from 'dotenv'

export const connectToMongoDB = async () => {
  dotenv.config()
  await connect(process.env.MONGODB_URL!).
    then(() => console.info('Connected to Database'))
}
