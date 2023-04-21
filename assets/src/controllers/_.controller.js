export function get_(req, res, next) {
    res.send('peticion "get" recibida!')
}

export function post_(req, res, next) {
    res.send('peticion "post" recibida!')
}

export function put_(req, res, next) {
    res.send('peticion "put:id" recibida!')
}

export function delete_(req, res, next) {
    res.send('peticion "delete:id" recibida!')
}