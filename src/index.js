import {
    createRouter,
    createController,
    createRepository,
    createDao,
    createService,
    createModule,
} from './createComponent.js'
import { createProject } from './createProject.js'

const args = process.argv.slice(2)
const option = args.shift()

if (option === '--help' || option === '-H') {
    console.log(`
Opciones:
(npx make-new) project [nombreProyecto]:
    crea una nuevo proyecto con el nombre dado (o server+timestamp por defecto)
(npx make-new) module < nombreRecurso >:
    crea un router, controller, y dao para un nuevo recurso (en sus respectivas carpetas)
(npx make-new) < router | controller | dao | service | repository >:
    crea un archivo con el componente elegido (en su respectiva carpeta)
`)
}

else if (option === 'project') {
    createProject(...args)
} else if (option === 'router') {
    createRouter(...args, 'src')
} else if (option === 'controller') {
    createController(...args, 'src')
} else if (option === 'repository') {
    createRepository(...args, 'src')
} else if (option === 'dao') {
    createDao(...args, 'src')
} else if (option === 'service') {
    createService(...args, 'src')
} else if (option === 'module') {
    createModule(...args, 'src')
} else {
    console.log('opcion inválida. consulte la ayuda ( -H | --help ).')
}
