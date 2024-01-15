import { Router } from 'express'
import DroneController from '../controllers/drone.js'
const droneRouter = new Router()
droneRouter.get('/', DroneController.getAllDrones)
droneRouter.post('/', DroneController.createDrone)
droneRouter.get('/available', DroneController.getAvailable)

droneRouter.post('/:serialNumber/medications', (req, res) => {
  res.json({ msg: 'loading a drone with medication items' })
})

droneRouter.get('/:serialNumber/medications', (req, res) => {
  res.json({ msg: 'checking loaded medication items for a given drone' })
})
droneRouter.get('/:serialNumber/battery', DroneController.checkBatteryLevel)

export default droneRouter
