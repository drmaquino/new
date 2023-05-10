import fs from 'fs'
import Handlebars from "handlebars"
import { decapitalize, capitalize } from './utils.js'

const routerTemplateUrl = new URL('../templates/router.template', import.meta.url)
const routerTemplate = Handlebars.compile(fs.readFileSync(routerTemplateUrl, 'utf-8'))
const controllerTemplateUrl = new URL('../templates/controller.template', import.meta.url)
const controllerTemplate = Handlebars.compile(fs.readFileSync(controllerTemplateUrl, 'utf-8'))
const serviceTemplateUrl = new URL('../templates/service.template', import.meta.url)
const serviceTemplate = Handlebars.compile(fs.readFileSync(serviceTemplateUrl, 'utf-8'))
const repositoryTemplateUrl = new URL('../templates/repository.template', import.meta.url)
const repositoryTemplate = Handlebars.compile(fs.readFileSync(repositoryTemplateUrl, 'utf-8'))

const daoMongooseTemplateUrl = new URL('../templates/dao.mongoose.template', import.meta.url)
const daoMongooseTemplate = Handlebars.compile(fs.readFileSync(daoMongooseTemplateUrl, 'utf-8'))
const daoMemoriaTemplateUrl = new URL('../templates/dao.memoria.template', import.meta.url)
const daoMemoriaTemplate = Handlebars.compile(fs.readFileSync(daoMemoriaTemplateUrl, 'utf-8'))


function createFile(dirPath, filePath, content) {
  fs.mkdirSync(dirPath, { recursive: true })
  fs.writeFileSync(`${dirPath}/${filePath}`, content)
}

function createContext(nombreRecurso, includeImports = true) {
  return {
    nombreMayuscula: capitalize(nombreRecurso),
    nombreMinuscula: decapitalize(nombreRecurso),
    includeImports
  }
}

export function createRouter(nombreRecurso, path = '.', importController = false) {
  const context = createContext(nombreRecurso)
  const text = routerTemplate(context)
  const componentType = 'routers'
  createFile(`${path}/${componentType}`, `${context.nombreMinuscula}.router.js`, text)
}

export function createController(nombreRecurso, path = '.', importDao = false, daoType = 'memoria') {
  const nombreMinuscula = decapitalize(nombreRecurso)
  const text = controllerTemplate({ nombreMinuscula, importDao, daoType })
  fs.mkdirSync(`${path}/controllers`, { recursive: true })
  fs.writeFileSync(`${path}/controllers/${nombreMinuscula}.controller.js`, text)
}

export function createDao(nombreRecurso, soporte = 'memoria', path = '.') {

  const nombreMayuscula = capitalize(nombreRecurso)
  const nombreMinuscula = decapitalize(nombreRecurso)

  const componentType = 'daos'
  const daoTemplateUrl = new URL(`../templates/dao.${soporte}.template`, import.meta.url)
  const destinationFilename = `${nombreMinuscula}.dao.${soporte}.js`

  const daoTemplate = Handlebars.compile(fs.readFileSync(daoTemplateUrl, 'utf-8'))
  const text = daoTemplate(createContext(nombreRecurso))
  createFile(`${path}/${componentType}`, destinationFilename, text)
}

export function createService(nombreRecurso, path = '.') {
  const context = createContext(nombreRecurso)
  const text = serviceTemplate(context)
  const componentType = 'services'
  createFile(`${path}/${componentType}`, `${context.nombreMinuscula}.service.js`, text)
}

export function createRepository(nombreRecurso, path = '.', importRepository = false) { //TODO: agregar importar dao!
  const context = createContext(nombreRecurso)
  const text = repositoryTemplate(createContext(nombreRecurso))
  const componentType = 'repositories'
  createFile(`${path}/${componentType}`, `${context.nombreMinuscula}.repository.js`, text)
}

export function createModule(nombreRecurso, daoType = 'memoria', path = '.') {
  const modulePath = `${path}`
  fs.mkdirSync(modulePath, { recursive: true })
  createRouter(nombreRecurso, modulePath, true)
  createController(nombreRecurso, modulePath, true, daoType)
  createDao(nombreRecurso, daoType, modulePath)
}