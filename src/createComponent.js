import { curryClone } from './utils.js'

const clone = curryClone('.')

export function createComponent(name) {
    switch (name) {
        case 'repository':
            clone('src/repositories'); break
        case 'middleware':
            clone('src/middlewares'); break
        case 'service':
            clone('src/services'); break
    }
}
