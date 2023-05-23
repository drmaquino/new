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

function safeWriteFileSync(path, content) {
  const lastBarIndex = path.lastIndexOf('/')
  const dirPath = path.slice(0, lastBarIndex)
  fs.mkdirSync(dirPath, { recursive: true })
  fs.writeFileSync(path, content)
}

export function createRouter(nombreRecurso, path = '.', importController = false) {

  const nombreMayuscula = capitalize(nombreRecurso)
  const nombreMinuscula = decapitalize(nombreRecurso)

  const text = routerTemplate({
    nombreMayuscula,
    nombreMinuscula,
    importController
  })
  const componentType = 'routers'
  safeWriteFileSync(`${path}/${componentType}/${nombreMinuscula}.router.js`, text)
}

export function createController(nombreRecurso, path = '.', importRepository = false, importDao = false, daoType = 'memoria') {

  const nombreMinuscula = decapitalize(nombreRecurso)

  const text = controllerTemplate({
    nombreMinuscula,
    importRepository,
    importDao,
    daoType
  })

  const componentType = 'controllers'
  safeWriteFileSync(`${path}/${componentType}/${nombreMinuscula}.controller.js`, text)
}

export function createRepository(nombreRecurso, path = '.', daoType = 'memoria') {

  const nombreMayuscula = capitalize(nombreRecurso)
  const nombreMinuscula = decapitalize(nombreRecurso)
  const daoTypeLower = decapitalize(daoType)
  const daoTypeUpper = capitalize(daoType)

  const text = repositoryTemplate({
    nombreMayuscula,
    nombreMinuscula,
    daoTypeLower,
    daoTypeUpper
  })

  const componentType = 'repositories'
  safeWriteFileSync(`${path}/${componentType}/${nombreMinuscula}.repository.js`, text)
}

export function createDao(nombreRecurso, path = '.', daoType = 'memoria') {

  const nombreMayuscula = capitalize(nombreRecurso)
  const nombreMinuscula = decapitalize(nombreRecurso)

  const daoTemplateUrl = new URL(`../templates/dao.${daoType}.template`, import.meta.url)
  const destinationFilename = `${nombreMinuscula}.dao.${daoType}.js`

  const daoTemplate = Handlebars.compile(fs.readFileSync(daoTemplateUrl, 'utf-8'))

  const text = daoTemplate({
    nombreMayuscula,
    nombreMinuscula
  })

  const componentType = 'daos'
  safeWriteFileSync(`${path}/${componentType}/${destinationFilename}`, text)
}

export function createService(nombreRecurso, path = '.', importRepository = false) {

  const nombreMayuscula = capitalize(nombreRecurso)
  const nombreMinuscula = decapitalize(nombreRecurso)

  const text = serviceTemplate({
    nombreMayuscula,
    nombreMinuscula,
    importRepository
  })

  const componentType = 'services'
  safeWriteFileSync(`${path}/${componentType}/${nombreMinuscula}.service.js`, text)
}

export function createModule(nombreRecurso, modulePath = '.', daoType = 'memoria') {
  createRouter(nombreRecurso, modulePath, true)
  createController(nombreRecurso, modulePath, true)
  createRepository(nombreRecurso, modulePath, daoType)
  createDao(nombreRecurso, modulePath, daoType)

  fs.appendFileSync(
    `${modulePath}/routers/api.router.js`, `
import { ${nombreRecurso}Router } from './${nombreRecurso}.router.js'
apiRouter.use('/${nombreRecurso}', ${nombreRecurso}Router)
`)
}