import { Router } from 'express'
import DroneController from '../controllers/drone.js'
const droneRouter = new Router()
droneRouter.get('/', DroneController.getAllDrones)
droneRouter.post('/', DroneController.createDrone)
droneRouter.get('/available', DroneController.getAvailable)
droneRouter.post('/:serialNumber/medications', DroneController.loadWithMedications)
droneRouter.get('/:serialNumber/medications', DroneController.checkLoadedMedication)
droneRouter.get('/:serialNumber/battery', DroneController.checkBatteryLevel)

export default droneRouter
