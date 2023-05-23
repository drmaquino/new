import {
    createRouter,
    createController,
    createRepository,
    createDao,
    createService,
    createModule,
} from './createComponent.js'
import { createProject } from './createProject.js'
import { extraerIntencion } from './utils.js'

const args = process.argv.slice(2)

const firstOption = args[0]

if (firstOption === '--help' || firstOption === '-H') {
    console.log(`
Opciones:
(npx make-new) project [nombreProyecto]:
    crea una nuevo proyecto con el nombre dado (o server+timestamp por defecto)
(npx make-new) module < nombreRecurso >:
    crea un router, controller, y dao para un nuevo recurso (en sus respectivas carpetas)
(npx make-new) < router | controller | dao | service | repository >:
    crea un archivo con el componente elegido (en su respectiva carpeta)
`)
    process.exit()
}

const intencion = extraerIntencion(args)

if (firstOption === 'project') {
    args.shift()
    createProject(...args)
} else if (intencion.componentType === 'router') {
    createRouter(intencion)
} else if (intencion.componentType === 'controller') {
    createController(intencion)
} else if (intencion.componentType === 'repository') {
    createRepository(intencion)
} else if (intencion.componentType === 'dao') {
    createDao(intencion)
} else if (intencion.componentType === 'service') {
    createService(intencion)
} else if (intencion.componentType === 'module') {
    createModule(intencion)
} else {
    console.log('opcion inválida. consulte la ayuda ( -H | --help ).')
}
