import app from './app.js'
import 'dotenv/config'
import db from './db/database.js'
import { setAssociations } from './models/associations.js'
import { task } from './tasks/task.js'
const PORT = process.env.PORT ?? 1234
const main = async () => {
  try {
    await db.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:')
    return
  }
  try {
    await db.sync({ force: false })
    console.log('DB sync')
  } catch (error) {
    console.error('Could not sync db')
    return
  }
  setAssociations()
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
  })
  await task()
}
main()
