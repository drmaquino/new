import fs from 'fs'
import {
  capitalize,
  log,
  pathContainsFile,
  safeWriteFileSync,
  Handlebars
} from './utils.js'

export function createRouter({ entityName, path, componentType = 'router' }) {
  log({ location: 'createRouter', arguments: arguments[0] })

  const routerTemplateUrl = new URL(`../templates/${componentType}.template`, import.meta.url)
  const routerTemplate = Handlebars.compile(fs.readFileSync(routerTemplateUrl, 'utf-8'))

  const importController = pathContainsFile(`${path}/controllers/`, `${entityName}.controller.js`)

  log({ location: 'createRouter', importController })

  const text = routerTemplate({
    entityName,
    importController
  })

  const componentsFolder = 'routers'
  const newRouterFilepath = `${path}/${componentsFolder}/${entityName}.${componentType}.js`

  log({
    location: 'createRouter',
    file: newRouterFilepath,
    action: pathContainsFile(`${path}/${componentsFolder}/`, `${entityName}.${componentType}.js`) ? 'modified' : 'created'
  })
  safeWriteFileSync(newRouterFilepath, text)

  const apiRouterFilepath = `${path}/${componentsFolder}/api.${componentType}.js`

  log({
    location: 'createRouter',
    file: apiRouterFilepath,
    action: 'modified'
  })
  fs.appendFileSync(
    apiRouterFilepath, `
import { ${entityName}Router } from './${entityName}.${componentType}.js'
apiRouter.use('/${entityName}', ${entityName}Router)
`)

}

export function createController({ entityName, path, componentType = 'controller', daoType }) {
  log({ location: 'createController', arguments: arguments[0] })

  const controllerTemplateUrl = new URL(`../templates/${componentType}.template`, import.meta.url)
  const controllerTemplate = Handlebars.compile(fs.readFileSync(controllerTemplateUrl, 'utf-8'))

  const importRepository = pathContainsFile(`${path}/repositories/`, `${entityName}.repository.js`)

  log({ location: 'createController', importRepository: importRepository ? true : 'not found' })

  const importDao = !importRepository && pathContainsFile(`${path}/daos/`, `${entityName}.dao.${daoType}.js`)

  log({
    location: 'createController',
    importDao:
      importDao
        ? true
        : importRepository
          ? 'using repository instead'
          : 'not found'
  })

  const text = controllerTemplate({
    entityName,
    importRepository,
    importDao,
    daoType
  })

  const componentsFolder = 'controllers'
  const newControllerFilepath = `${path}/${componentsFolder}/${entityName}.${componentType}.js`

  log({
    location: 'createController',
    file: newControllerFilepath,
    action: pathContainsFile(`${path}/${componentsFolder}/`, `${entityName}.${componentType}.js`) ? 'modified' : 'created'
  })
  safeWriteFileSync(newControllerFilepath, text)
}

export function createRepository({ entityName, path, componentType = 'repository', daoType }) {
  log({ location: 'createRepository', arguments: arguments[0] })

  const repositoryTemplateUrl = new URL('../templates/repository.template', import.meta.url)
  const repositoryTemplate = Handlebars.compile(fs.readFileSync(repositoryTemplateUrl, 'utf-8'))

  const daoFound = pathContainsFile(`${path}/daos/`, `${entityName}.dao.${daoType}.js`)
  if (!daoFound)
    throw new Error(`you need a ${entityName} dao to create a ${entityName} repository`)

  const text = repositoryTemplate({
    entityName,
    daoType
  })

  const componentsFolder = 'repositories'
  const newRepositoryFilepath = `${path}/${componentsFolder}/${entityName}.${componentType}.js`

  log({
    location: 'createRepository',
    file: newRepositoryFilepath,
    action: pathContainsFile(`${path}/${componentsFolder}/`, `${entityName}.${componentType}.js`) ? 'modified' : 'created'
  })
  safeWriteFileSync(newRepositoryFilepath, text)

  if (!pathContainsFile(`${path}/${componentsFolder}/`, `GenericRepository.js`)) {
    const repositoryGenericTextUrl = new URL(`../templates/${componentType}.generic.template`, import.meta.url)
    const genericRepositoryText = fs.readFileSync(repositoryGenericTextUrl, 'utf-8')
    const genericRepositoryFilepath = `${path}/${componentsFolder}/GenericRepository.js`

    log({
      location: 'createRepository',
      file: genericRepositoryFilepath,
      action: 'created'
    })
    safeWriteFileSync(genericRepositoryFilepath, genericRepositoryText)
  }
}

export function createDao({ entityName, path, componentType = 'dao', daoType }) {
  log({ location: 'createDao', arguments: arguments[0] })

  const daoTemplateUrl = new URL(`../templates/${componentType}.${daoType}.template`, import.meta.url)
  const destinationFilename = `${entityName}.${componentType}.${daoType}.js`

  const daoTemplate = Handlebars.compile(fs.readFileSync(daoTemplateUrl, 'utf-8'))

  const text = daoTemplate({
    entityName
  })

  const componentsFolder = 'daos'
  const newDaoFilepath = `${path}/${componentsFolder}/${destinationFilename}`

  log({
    location: 'createDao',
    file: newDaoFilepath,
    action: 'created'
  })
  safeWriteFileSync(newDaoFilepath, text)

  if (!pathContainsFile(`${path}/${componentsFolder}/`, `Dao${capitalize(daoType)}.js`)) {
    const genericDaoTemplateFilepath = `../templates/${componentType}.${daoType}.generic.template`
    const genericDaoTextUrl = new URL(genericDaoTemplateFilepath, import.meta.url)
    const genericDaoText = fs.readFileSync(genericDaoTextUrl, 'utf-8')
    const genericDaoFilepath = `${path}/${componentsFolder}/Dao${capitalize(daoType)}.js`

    log({
      location: 'createDao',
      file: genericDaoFilepath,
      action: 'created'
    })
    safeWriteFileSync(genericDaoFilepath, genericDaoText)
  }
}

export function createService({ entityName, path, importRepository = false }) {
  log({ location: 'createService', arguments: arguments[0] })

  const serviceTemplateUrl = new URL('../templates/service.template', import.meta.url)
  const serviceTemplate = Handlebars.compile(fs.readFileSync(serviceTemplateUrl, 'utf-8'))

  const text = serviceTemplate({
    entityName,
    importRepository
  })

  const componentType = 'services'
  safeWriteFileSync(`${path}/${componentType}/${entityName}.service.js`, text)
}

export function createModule({ entityName, path, daoType }) {
  log({ location: 'createModule', arguments: arguments[0] })

  createDao({ entityName, path, daoType })
  createRepository({ entityName, path, daoType })
  createController({ entityName, path, daoType })
  createRouter({ entityName, path })
}