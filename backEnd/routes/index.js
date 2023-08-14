import usersRoutes from "./users.route.js"
import authRoutes from "./auth.route.js"
import spotifyRoutes from "./spotify.route.js"
import instagramRoutes from "./instagram.route.js"
import express from "express"

const routes = express.Router()

routes.use('/users', usersRoutes)
routes.use('/auth', authRoutes)
routes.use('/spotify', spotifyRoutes)
routes.use('/instagram', instagramRoutes)

export default routes