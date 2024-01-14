import express from 'express'
import logger from 'morgan'

import helloRouter from './routes/hello.js'
import droneRouter from './routes/drone.js'
const app = express()

app.use(logger('dev'))
app.use(express.json())

app.use('/api/hello', helloRouter)
app.use('/api/drones', droneRouter)
export default app
