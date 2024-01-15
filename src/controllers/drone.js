import { Op } from 'sequelize'
import Drone from '../models/drone.js'
import Model from '../models/model.js'
import State from '../models/state.js'
import Medication from '../models/medication.js'
import Cargo from '../models/cargo.js'
import { validateDrone } from '../schemas/drone.js'
import { validateCargo } from '../schemas/cargo.js'
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
      console.error(error)
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
            [Op.gt]: BATERY_LIMIT
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
      res.status(201).json(drone)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error create' })
    }
  }

  static async loadWithMedications(req, res) {
    try {
      const { body } = req
      if (!validateCargo(body)) return res.status(400).json('invalid input')

      const { serialNumber } = req.params
      const _drone = await Drone.findOne({
        include: [{ model: State, attributes: ['name'], as: 'droneState' }],
        where: { serialNumber }
      })
      if (!_drone) return res.status(404).json({ msg: 'drone not found' })

      const drone = _drone.toJSON()

      if (drone.droneState.name !== AVAILABLE_STATE) {
        return res.status(400).json({ msg: 'drone is not available' })
      }
      const { weightLimit, batteryCapacity } = drone

      if (BATERY_LIMIT > batteryCapacity) {
        return res.status(400).json({ msg: `The drone's battery is below ${BATERY_LIMIT}%` })
      }
      let totalWeight = 0
      const idCargo = (await getLastIdCargo()) + 1
      const data = []
      for (const medCode in body) {
        const _med = await Medication.findOne({ where: { code: medCode } })
        if (!_med) return res.status(404).json({ msg: `Medication with code ${medCode} not found` })
        const med = _med.toJSON()
        const { weight, code } = med
        totalWeight += weight * parseInt(body[medCode])
        if (totalWeight > weightLimit) return res.status(400).json({ msg: 'weight limit exceeded' })
        data.push({ idCargo, idDrone: serialNumber, idMedication: code })
      }
      const result = await Cargo.bulkCreate(data)
      const idStateLoaded = await getIdStateLoaded()
      const newState = { state: idStateLoaded }
      await Drone.update(newState, { where: { serialNumber } })
      res.status(201).json(result)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error load medication' })
    }
  }

  static async checkLoadedMedication(req, res) {
    try {
      const { serialNumber } = req.params
      const _drone = await Drone.findOne({ where: { serialNumber } })
      if (!_drone) return res.status(404).json({ msg: 'drone not found' })

      const drone = _drone.toJSON()
      const { state } = drone
      const idStateLoaded = await getIdStateLoaded()

      if (idStateLoaded !== state) {
        return res.status(400).json({ msg: 'this drone doesnt have medications loaded ' })
      }
      const idCargo = await getLastIdCargo({ idDrone: serialNumber })
      const resp = await Cargo.findAll({ where: { idDrone: serialNumber, idCargo } })
      const result = resp.map((c) => {
        const { idMedication } = c.toJSON()
        return idMedication
      })
      const resultMed = []
      for (const codeM of result) {
        const _med = await Medication.findOne({ where: { code: codeM } })
        const med = _med.toJSON()
        resultMed.push(med)
      }
      res.json(resultMed)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error checking medication' })
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
const getLastIdCargo = async (condition) => {
  const idCargo = await Cargo.max('idCargo', { where: condition })
  return idCargo ?? 0
}
const getIdStateLoaded = async () => {
  const idState = await State.findOne({ where: { name: 'LOADED' } })
  const { id } = idState.toJSON()
  return id
}
