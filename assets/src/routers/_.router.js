import { Router } from 'express'
import * as _ from '../controllers/_.controller.js'

export const router = Router()

router.get('/:id?', _.get_)
router.post('/', _.post_)
router.put('/:id', _.put_)
router.delete('/:id', _.delete_)
