import cron from 'node-cron'
import Drone from '../models/drone.js'
import winston from 'winston'
export const task = async () => {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.File({ filename: 'history.log', level: 'info' })]
  })

  return cron.schedule('*/5 * * * * *', async () => {
    const data = await getBatteryLevels()
    logger.log('info', data)
  })
}

export const getBatteryLevels = async () => {
  try {
    const resp = await Drone.findAll({ attributes: ['serialNumber', 'batteryCapacity'] })
    const result = resp.map((d) => {
      const { serialNumber, batteryCapacity } = d.toJSON()
      return { [serialNumber]: batteryCapacity }
    })
    const date = new Date()
    const logData = { date, batteryLevels: result }
    return logData
  } catch (error) {
    console.error(error)
  }
}
