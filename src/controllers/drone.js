import Drone from '../models/drone.js'
import Model from '../models/model.js'
import State from '../models/state.js'

export default class DroneController {
  static async getAllDrones(req, res) {
    const resp = await Drone.findAll({
      include: [
        { model: Model, attributes: ['name'], as: 'droneModel' },
        { model: State, attributes: ['name'], as: 'droneState' }
      ]
    })
    const result = formatDroneResult(resp)
    res.json(result)
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
