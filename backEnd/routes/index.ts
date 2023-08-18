import usersRoutes from "./users.route"
import authRoutes from "./auth.route"
import spotifyRoutes from "./spotify.route"
import instagramRoutes from "./instagram.route"
import express from "express"

const routes = express.Router()

routes.use('/users', usersRoutes)
routes.use('/auth', authRoutes)
routes.use('/spotify', spotifyRoutes)
routes.use('/instagram', instagramRoutes)

export default routes