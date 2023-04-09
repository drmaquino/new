import { createProject } from './createProject.js'
const args = process.argv.slice(2)

if (args[0] === '--help' || args[0] === '-H') {
    console.log(`
Opciones:
(npx new) project [nombreProyecto]:
    crea una carpeta con el nombre dado (o server+timestamp por defecto)
`)
    process.exit()
}

if (args[0] === 'project') {
    args.shift()
    createProject(args)
} else {
    console.log('opcion inválida. consulte la ayuda.')
}