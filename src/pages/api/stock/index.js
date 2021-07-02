import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import Clan from '@/models/clan'
import Stock from '@/models/stock'
import StockHistory from '@/models/stock-history'

import moment from 'moment-timezone'

const handler = nextConnect()

const OPEN_MARKET_TIME = 9
const CLOSE_MARKET_TIME = 22

handler
  .use(middleware)

/**
 * @method GET
 * @endpoint /api/stock
 * @description Get current price of stocks
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
  let stocks = null

  const currentTime = moment().utcOffset('+0700')

  if (currentTime.hour() < OPEN_MARKET_TIME || currentTime.hour() > CLOSE_MARKET_TIME) {
    return Response.denined(res, 'market closed!!!')
  }

  stocks = await Stock
    .find()
    .select('symbol rate')
    .exec()

  const yesterdayStockHistory = await StockHistory
    .find({ date: new Date(currentTime.startOf('day').valueOf() - 86400000) })
    .select('symbol rate')
    .exec()

  const data = stocks.map(v => ({ ...v._doc, changed: v.rate - yesterdayStockHistory.find(f => f.symbol == v.symbol).rate }))

  res.status(200)
    .json({
      sucesss: !!data,
      data: data,
      timestamp: new Date()
    })
})

export default handler