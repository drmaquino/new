import {
    createRouter,
    createController,
    createRepository,
    createDao,
    createService,
    createModule,
    createModel,
    createProject
} from './createComponent.js'
import { extraerIntencion, logInfo, logDebug } from './utils.js'

const intencion = extraerIntencion(process.argv.slice(2))
logDebug(intencion)

if (intencion.help) {
    showHelp()
}
else if (intencion.project) {
    createProject(intencion)
}
else if (intencion.componentType === 'router') {
    createRouter(intencion)
}
else if (intencion.componentType === 'controller') {
    createController(intencion)
}
else if (intencion.componentType === 'repository') {
    createRepository(intencion)
}
else if (intencion.componentType === 'dao') {
    createDao(intencion)
}
else if (intencion.componentType === 'service') {
    createService(intencion)
}
else if (intencion.componentType === 'module') {
    createModule(intencion)
}
else if (intencion.componentType === 'model') {
    createModel(intencion)
}
else {
    console.log(`opcion inválida. consulte la ayuda ( 'make-new help' ).`)
}

function showHelp() {
    console.log(`
Opciones generales:

(npx make-new) module < nombreRecurso >:
    crea un router, controller, y dao para un nuevo recurso (en sus respectivas carpetas)

(npx make-new) < router | controller | dao | service | repository >:
    crea un archivo con el componente elegido (en su respectiva carpeta)

(npx make-new) project [nombreProyecto]:
    crea una nuevo proyecto con el nombre dado (o server + timestamp por defecto)

Opciones para creación de proyectos:
    --frontend      |  -F
        crea también ./public y ./views
    --test          |  -T
        crea también ./test e instala mocha@latest
    --environment   |  -E
        crea también .env e instala dotenv@latest
`)
}
