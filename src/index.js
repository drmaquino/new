import {
    createController,
    createRepository,
    createService,
    createRouter,
} from './createComponent.js'
import { createProject } from './createProject.js'

const args = process.argv.slice(2)
const option = args.shift()

if (option === '--help' || option === '-H') {
    console.log(`
Opciones:
(npx make-new) project [nombreProyecto]:
    crea una nuevo proyecto con el nombre dado (o server+timestamp por defecto)
(npx make-new) < middleware | service | repository >:
    crea una carpeta (si no existe aun) con el componente elegido
`)
}

else if (option === 'project') {
    createProject(args)
} else if (option === 'service') {
    createService(...args)
} else if (option === 'controller') {
    createController(...args)
} else if (option === 'repository') {
    createRepository(...args)
} else if (option === 'router') {
    createRouter(...args)
} else {
    console.log('opcion inválida. consulte la ayuda.')
}
