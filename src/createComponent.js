import fs from 'fs'
import Handlebars from "handlebars"
import { decapitalize, capitalize } from './utils.js'

const routerTemplateUrl = new URL('../templates/router.template', import.meta.url)
const routerTemplate = Handlebars.compile(fs.readFileSync(routerTemplateUrl, 'utf-8'))

export function createRouter(nombreRecurso, path = '.', importController = false) {
  const nombreMinuscula = decapitalize(nombreRecurso)
  const text = routerTemplate({ nombreMinuscula, importController })
  fs.mkdirSync(`${path}/routers`, { recursive: true })
  fs.writeFileSync(`${path}/routers/${nombreMinuscula}.router.js`, text)
}

const controllerTemplateUrl = new URL('../templates/controller.template', import.meta.url)
const controllerTemplate = Handlebars.compile(fs.readFileSync(controllerTemplateUrl, 'utf-8'))

export function createController(nombreRecurso, path = '.', importDao = false, daoType = 'memoria') {
  const nombreMinuscula = decapitalize(nombreRecurso)
  const text = controllerTemplate({ nombreMinuscula, importDao, daoType })
  fs.mkdirSync(`${path}/controllers`, { recursive: true })
  fs.writeFileSync(`${path}/controllers/${nombreMinuscula}.controller.js`, text)
}

export function createDao(nombreRecurso, type = 'memoria', path = '.') {
  let daoTemplateUrl
  let destinationFilename

  const nombreMayuscula = capitalize(nombreRecurso)
  const nombreMinuscula = decapitalize(nombreRecurso)

  if (type === 'mongoose') {
    daoTemplateUrl = new URL('../templates/dao.mongoose.template', import.meta.url)
    destinationFilename = `${nombreMinuscula}.dao.mongoose.js`
  } else {
    daoTemplateUrl = new URL('../templates/dao.memoria.template', import.meta.url)
    destinationFilename = `${nombreMinuscula}.dao.memoria.js`
  }

  const daoTemplate = Handlebars.compile(fs.readFileSync(daoTemplateUrl, 'utf-8'))
  const text = daoTemplate({ nombreMinuscula, nombreMayuscula })
  fs.mkdirSync(`${path}/daos`, { recursive: true })
  fs.writeFileSync(`${path}/daos/${destinationFilename}`, text)
}

export function createModule(nombreRecurso, daoType = 'memoria', path = '.') {
  const modulePath = `${path}`
  fs.mkdirSync(modulePath, { recursive: true })
  createRouter(nombreRecurso, modulePath, true)
  createController(nombreRecurso, modulePath, true, daoType)
  createDao(nombreRecurso, daoType, modulePath)
}

const serviceTemplateUrl = new URL('../templates/service.template', import.meta.url)
const serviceTemplate = Handlebars.compile(fs.readFileSync(serviceTemplateUrl, 'utf-8'))

export function createService(nombreRecurso, path = '.') {
  const nombreMayuscula = capitalize(nombreRecurso)
  const nombreMinuscula = decapitalize(nombreRecurso)
  const text = serviceTemplate({ nombreMinuscula, nombreMayuscula })
  fs.mkdirSync(`${path}/services`, { recursive: true })
  fs.writeFileSync(`${path}/services/${nombreMinuscula}.service.js`, text)
}

const repositoryTemplateUrl = new URL('../templates/repository.template', import.meta.url)
const repositoryTemplate = Handlebars.compile(fs.readFileSync(repositoryTemplateUrl, 'utf-8'))

export function createRepository(nombreRecurso, path = '.', importRepository = false) { //TODO: agregar importar dao!
  const nombreMayuscula = capitalize(nombreRecurso)
  const nombreMinuscula = decapitalize(nombreRecurso)
  const text = repositoryTemplate({ nombreMinuscula, nombreMayuscula })
  fs.mkdirSync(`${path}/repositories`, { recursive: true })
  fs.writeFileSync(`${path}/repositories/${nombreMinuscula}.repository.js`, text)
}
