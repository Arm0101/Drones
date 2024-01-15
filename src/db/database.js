import { Sequelize } from 'sequelize'

const db = new Sequelize('drones_db', process.env.DATABASE_USER, process.env.DATABASE_PASS, {
  dialect: 'mysql',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  logging: false
})
export default db
