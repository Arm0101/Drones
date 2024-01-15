import { DataTypes } from 'sequelize'
import db from '../db/database.js'
const Medication = db.define(
  'medications',
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false
    },
    weight: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  },
  { timestamps: false }
)

export default Medication
