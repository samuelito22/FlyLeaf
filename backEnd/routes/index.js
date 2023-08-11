import usersRoutes from "./users/index.js"
import authRoutes from "./auth/index.js"
import spotifyRoutes from "./spotify/index.js"
import express from "express"

const routes = express.Router()

routes.use('/users', usersRoutes)
routes.use('/auth', authRoutes)
routes.use('/spotify', spotifyRoutes)

export default routes
