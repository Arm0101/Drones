import { DataTypes } from 'sequelize'
import db from '../db/database.js'
const Cargo = db.define(
  'cargo',
  {
    idCargo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    idDrone: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'drones',
        key: 'serialNumber'
      }
    },
    idMedication: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'medications',
        key: 'code'
      }
    }
  },
  { timestamps: false, tableName: 'cargo' }
)

export default Cargo
