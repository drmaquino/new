import { Router } from 'express'

export const router = Router()

router.get('/', (req, res, next) => { res.send('peticion "get" recibida!') })
router.get('/:id', (req, res, next) => { res.send('peticion "get:id" recibida!') })
router.post('/', (req, res, next) => { res.send('peticion "post" recibida!') })
router.put('/:id', (req, res, next) => { res.send('peticion "put:id" recibida!') })
router.delete('/:id', (req, res, next) => { res.send('peticion "delete:id" recibida!') })
