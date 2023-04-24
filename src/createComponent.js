import fs from 'fs'
import Handlebars from "handlebars"

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function decapitalize(word) {
  return word.charAt(0).toLowerCase() + word.slice(1)
}

export function createService(nombreRecurso = '', path = '.') {
  const serviceTemplateUrl = new URL('../templates/service.template', import.meta.url)
  const serviceTemplate = Handlebars.compile(fs.readFileSync(serviceTemplateUrl, 'utf-8'))
  const nombreMayuscula = capitalize(nombreRecurso)
  const nombreMinuscula = decapitalize(nombreRecurso)
  const text = serviceTemplate({ nombreMinuscula, nombreMayuscula })
  fs.mkdirSync(`${path}/services`, { recursive: true })
  fs.writeFileSync(`${path}/services/${nombreMinuscula}.service.js`, text)
}

export function createRepository(nombreRecurso, path = '.') {
  const repositoryTemplateUrl = new URL('../templates/repository.template', import.meta.url)
  const repositoryTemplate = Handlebars.compile(fs.readFileSync(repositoryTemplateUrl, 'utf-8'))
  const nombreMayuscula = capitalize(nombreRecurso)
  const nombreMinuscula = decapitalize(nombreRecurso)
  const text = repositoryTemplate({ nombreMinuscula, nombreMayuscula })
  fs.mkdirSync(`${path}/repositories`, { recursive: true })
  fs.writeFileSync(`${path}/repositories/${nombreMinuscula}.repository.js`, text)
}

export function createController(nombreRecurso, path = '.', importRepository = true) {
  const controllerTemplateUrl = new URL('../templates/controller.template', import.meta.url)
  const controllerTemplate = Handlebars.compile(fs.readFileSync(controllerTemplateUrl, 'utf-8'))
  const nombreMinuscula = decapitalize(nombreRecurso)
  const text = controllerTemplate({ nombreMinuscula, importRepository })
  fs.mkdirSync(`${path}/controllers`, { recursive: true })
  fs.writeFileSync(`${path}/controllers/${nombreMinuscula}.controller.js`, text)
}

export function createRouter(nombreRecurso, path = '.', importController = true) {
  const routerTemplateUrl = new URL('../templates/router.template', import.meta.url)
  const routerTemplate = Handlebars.compile(fs.readFileSync(routerTemplateUrl, 'utf-8'))
  const nombreMinuscula = decapitalize(nombreRecurso)
  const text = routerTemplate({ nombreMinuscula, importController })
  fs.mkdirSync(`${path}/routers`, { recursive: true })
  fs.writeFileSync(`${path}/routers/${nombreMinuscula}.router.js`, text)
}