import { createComponent } from './createComponent.js'
import { createProject } from './createProject.js'
const args = process.argv.slice(2)

if (args[0] === '--help' || args[0] === '-H') {
    console.log(`
Opciones:
(npx make-new) project [nombreProyecto]:
    crea una carpeta con el nombre dado (o server+timestamp por defecto)
(npx make-new) [ middleware | service | repository]:
    crea una carpeta con el nombre dado (o server+timestamp por defecto)
`)
    process.exit()
}

const validComponents = [
    'middleware',
    'repository',
    'service',
]

if (args[0] === 'project') {
    args.shift()
    createProject(args)
} else if (validComponents.includes(args[0])) {
    createComponent(args[0])
} else {
    console.log('opcion inválida. consulte la ayuda.')
}