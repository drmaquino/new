import { Router } from 'express'
import * as _ from '../controllers/_.controller.js'

export const router = Router()

router.get('/:id?', _.handleGet)
router.post('/', _.handlePost)
router.put('/:id', _.handlePut)
router.delete('/:id', _.handleDelete)
