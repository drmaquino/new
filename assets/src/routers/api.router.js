import { Router } from 'express'

export const apiRouter = Router()

apiRouter.use((req, res, next) => {
  console.log(`(${req.method}) ${req.url}`)
  next()
})
