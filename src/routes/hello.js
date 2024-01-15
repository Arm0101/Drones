import { Router } from 'express'

const helloRouter = new Router()

helloRouter.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

export default helloRouter
