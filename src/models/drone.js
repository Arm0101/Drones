import { DataTypes } from 'sequelize'
import db from '../db/database.js'
const Drone = db.define(
  'drones',
  {
    serialNumber: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      allowNull: false
    },
    model: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'models',
        key: 'id'
      }
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'states',
        key: 'id'
      }
    },
    weightLimit: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: 0,
        max: 500
      }
    },
    batteryCapacity: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    }
  },
  { timestamps: false }
)

export default Drone
