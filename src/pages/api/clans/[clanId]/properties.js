import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'

import Clan from '@/models/clan'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Please login in' })
	}

	const clan = await Clan
    .findById(req.query.clanId)
    .select('properties')
    .lean()
		.exec()

	res.status(200).json({sucesss: true, data: clan.properties, timestamp: new Date()})

})

export default handler