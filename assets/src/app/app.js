import express from 'express'
import { xsRouter } from '../routers/xs.router.js'

export const app = express()

app.use(express.json())

app.use('/', xsRouter)
