import { Op } from 'sequelize'
import Drone from '../models/drone.js'
import Model from '../models/model.js'
import State from '../models/state.js'

const BATERY_LIMIT = 25
const AVAILABLE_STATE = 'IDLE'
export default class DroneController {
  static async getAllDrones(req, res) {
    try {
      const resp = await Drone.findAll({
        include: [
          { model: Model, attributes: ['name'], as: 'droneModel' },
          { model: State, attributes: ['name'], as: 'droneState' }
        ]
      })
      const result = formatDroneResult(resp)
      res.json(result)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error get available' })
    }
  }

  static async getAvailable(req, res) {
    try {
      const resp = await Drone.findAll({
        include: [
          { model: Model, attributes: ['name'], as: 'droneModel' },
          { model: State, attributes: ['name'], as: 'droneState' }
        ],
        where: {
          '$droneState.name$': AVAILABLE_STATE,
          batteryCapacity: {
            [Op.lt]: BATERY_LIMIT
          }
        }
      })
      const result = formatDroneResult(resp)
      res.json(result)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error get available' })
    }
  }

  static async checkBatteryLevel(req, res) {
    try {
      const { serialNumber } = req.params
      const drone = await Drone.findOne({ where: { serialNumber } })
      if (!drone) return res.status(404).json({ msg: 'drone not found' })
      const { batteryCapacity } = drone.toJSON()
      res.json({ 'Battery Level': batteryCapacity })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error check battery level' })
    }
  }
}

const formatDroneResult = (resp) => {
  const result = resp.map((d) => {
    const drone = d.toJSON()
    const { name: state } = drone.droneState
    const { name: model } = drone.droneModel
    const { droneModel, droneState, ..._drone } = drone
    return { ..._drone, state, model }
  })
  return result
}
