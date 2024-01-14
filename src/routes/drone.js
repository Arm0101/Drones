import { Router } from 'express'

const droneRouter = new Router()
droneRouter.get('/', (req, res) => {
  res.json({ msg: 'get all drones' })
})
droneRouter.post('/', (req, res) => {
  res.json({ msg: 'registering a drone' })
})

droneRouter.get('/available', (req, res) => {
  res.json({ msg: 'checking available drones for loading' })
})
droneRouter.post('/:serialNumber/medications', (req, res) => {
  res.json({ msg: 'loading a drone with medication items' })
})
droneRouter.get('/:serialNumber/medications', (req, res) => {
  res.json({ msg: 'checking loaded medication items for a given drone' })
})
droneRouter.get('/:serialNumber/battery', (req, res) => {
  res.json({ msg: 'check drone battery level for a given drone' })
})

export default droneRouter
