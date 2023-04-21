import express from 'express'
import { router } from '../routers/_.router.js'

export const app = express()

app.use('/', router)
