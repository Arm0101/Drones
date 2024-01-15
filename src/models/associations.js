import Drone from './drone.js'
import Model from './model.js'
import State from './state.js'

export const setAssociations = () => {
  Drone.belongsTo(Model, { foreignKey: 'model', as: 'droneModel' })
  Drone.belongsTo(State, { foreignKey: 'state', as: 'droneState' })
  Model.hasMany(Drone, { foreignKey: 'model', as: 'drones' })
  State.hasMany(Drone, { foreignKey: 'state', as: 'drones' })
}
