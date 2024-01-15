import { Association, Op } from 'sequelize'
import Drone from '../models/drone.js'
import Model from '../models/model.js'
import State from '../models/state.js'
import { validateDrone } from '../schemas/drone.js'
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

  static async createDrone(req, res) {
    try {
      const { body } = req
      const resV = validateDrone(body)
      if (!resV.Ok) {
        return res.status(400).json({ err: resV.msg })
      }
      const idState = await checkState(body.state)
      if (!idState) return res.status(400).json({ err: 'invalid state' })
      const idModel = await checkModel(body.model)
      if (!idModel) return res.status(400).json({ err: 'invalid model' })
      const checkSerial = await checkDrone(body.serialNumber)
      if (!checkSerial) return res.status(400).json({ err: 'this drone already exists' })
      const droneData = { ...body, state: idModel, model: idModel }
      const drone = await Drone.create(droneData)
      res.status(201).json({ drone })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error create' })
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
const checkState = async (state) => {
  state = state.toLowerCase()
  const states = await getStates()
  for (const s of states) {
    const { id, name } = s
    if (name.toLowerCase() === state) return id
  }
  return false
}
const checkModel = async (model) => {
  model = model.toLowerCase()
  const models = await getModels()
  for (const m of models) {
    const { id, name } = m
    if (name.toLowerCase() === model) return id
  }
  return false
}

const getModels = async () => {
  const resp = await Model.findAll()
  const result = resp.map((m) => m.toJSON())
  return result
}
const getStates = async () => {
  const resp = await State.findAll()
  const result = resp.map((s) => s.toJSON())
  return result
}
const checkDrone = async (serialNumber) => {
  const resp = await Drone.findOne({ where: { serialNumber } })
  return !resp
}
