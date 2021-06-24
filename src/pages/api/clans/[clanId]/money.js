import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import Clan from '@/models/clan'

const handler = nextConnect()

handler.use(middleware)

/**
 * @method GET
 * @endpoint /api/clans/:clanId/money
 * @description Get the total money of the clan
 * 
 * @require User authentication
 */
handler.get(async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}

	const clan = await Clan
    .findOne({_id: req.query.clanId})
    .select('properties.money')
    .lean()
	  .exec()

	res.status(200).json({money: clan.properties.money})

})

export default handler