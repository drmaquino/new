export function handleGet(req, res, next) {
    res.send('peticion "get" recibida!')
}

export function handlePost(req, res, next) {
    res.send('peticion "post" recibida!')
}

export function handlePut(req, res, next) {
    res.send('peticion "put:id" recibida!')
}

export function handleDelete(req, res, next) {
    res.send('peticion "delete:id" recibida!')
}