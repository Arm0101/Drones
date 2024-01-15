import { DataTypes } from 'sequelize'
import db from '../db/database.js'
const Model = db.define(
  'models',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  },
  { timestamps: false }
)
export default Model
