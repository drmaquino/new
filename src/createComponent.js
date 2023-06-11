import fs from 'fs'
import {
  pluralize,
  capitalize,
  logInfo,
  logDebug,
  pathContainsFile,
  safeWriteFileSync,
  Handlebars,
  appendLineToFileTopSync
} from './utils.js'

export function createRouter({
  componentType = 'router',
  componentsFolder = 'routers',
  path,
  entityName,
}) {
  logDebug({ location: 'createRouter', arguments: { entityName, path, componentType, componentsFolder } })

  const routerTemplateUrl = new URL(`../templates/${componentType}.template`, import.meta.url)
  const routerTemplate = Handlebars.compile(fs.readFileSync(routerTemplateUrl, 'utf-8'))

  const importController = pathContainsFile(`${path}/controllers/`, `${pluralize(entityName)}.controller.js`)

  logDebug({ location: 'createRouter', importController })

  const text = routerTemplate({
    entityName,
    importController
  })

  const newRouterFilepath = `${path}/${componentsFolder}/${pluralize(entityName)}.${componentType}.js`

  safeWriteFileSync(newRouterFilepath, text)
  logInfo({
    location: 'createRouter',
    file: newRouterFilepath,
    action: pathContainsFile(`${path}/${componentsFolder}/`, `${pluralize(entityName)}.${componentType}.js`) ? 'modified' : 'created'
  })

  const apiRouterFilepath = `${path}/${componentsFolder}/api.${componentType}.js`

  appendLineToFileTopSync(apiRouterFilepath, `import { ${pluralize(entityName)}Router } from './${pluralize(entityName)}.${componentType}.js'`)
  fs.appendFileSync(apiRouterFilepath, `apiRouter.use('/${pluralize(entityName)}', ${pluralize(entityName)}Router)
`)

  logInfo({
    location: 'createRouter',
    file: apiRouterFilepath,
    action: 'modified'
  })
}

export function createController({
  entityName,
  path,
  componentType = 'controller',
  componentsFolder = 'controllers',
  persistenceType
}) {
  logDebug({ location: 'createController', arguments: { entityName, path, componentType, componentsFolder, persistenceType } })

  const controllerTemplateUrl = new URL(`../templates/${componentType}.template`, import.meta.url)
  const controllerTemplate = Handlebars.compile(fs.readFileSync(controllerTemplateUrl, 'utf-8'))

  const importRepository = pathContainsFile(`${path}/repositories/`, `${pluralize(entityName)}.repository.js`)

  logDebug({ location: 'createController', importRepository: importRepository ? true : 'not found' })

  const importDao = !importRepository && pathContainsFile(`${path}/daos/`, `${pluralize(entityName)}.dao.${persistenceType}.js`)

  logDebug({
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
    persistenceType,
    importModel: true
  })

  const newControllerFilepath = `${path}/${componentsFolder}/${pluralize(entityName)}.${componentType}.js`

  safeWriteFileSync(newControllerFilepath, text)
  logInfo({
    location: 'createController',
    file: newControllerFilepath,
    action: pathContainsFile(`${path}/${componentsFolder}/`, `${pluralize(entityName)}.${componentType}.js`) ? 'modified' : 'created'
  })
}

export function createRepository({
  componentType = 'repository',
  componentsFolder = 'repositories',
  path,
  entityName,
  persistenceType
}) {
  logDebug({ location: 'createRepository', arguments: { entityName, path, componentType, componentsFolder, persistenceType } })

  const repositoryTemplateUrl = new URL(`../templates/${componentType}.template`, import.meta.url)
  const repositoryTemplate = Handlebars.compile(fs.readFileSync(repositoryTemplateUrl, 'utf-8'))

  const daoFound = pathContainsFile(`${path}/daos/`, `${pluralize(entityName)}.dao.${persistenceType}.js`)
  if (!daoFound)
    throw new Error(`you need a ${pluralize(entityName)} dao to create a ${pluralize(entityName)} repository`)

  const text = repositoryTemplate({ entityName, persistenceType })

  const newRepositoryFilepath = `${path}/${componentsFolder}/${pluralize(entityName)}.${componentType}.js`

  logInfo({
    location: 'createRepository',
    file: newRepositoryFilepath,
    action: pathContainsFile(`${path}/${componentsFolder}/`, `${pluralize(entityName)}.${componentType}.js`) ? 'modified' : 'created'
  })
  safeWriteFileSync(newRepositoryFilepath, text)

  if (!pathContainsFile(`${path}/${componentsFolder}/`, `Generic${capitalize(componentType)}.js`)) {
    const repositoryGenericTextUrl = new URL(`../templates/${componentType}.generic.template`, import.meta.url)
    const genericRepositoryText = fs.readFileSync(repositoryGenericTextUrl, 'utf-8')
    const genericRepositoryFilepath = `${path}/${componentsFolder}/Generic${capitalize(componentType)}.js`

    safeWriteFileSync(genericRepositoryFilepath, genericRepositoryText)
    logInfo({
      location: 'createRepository',
      file: genericRepositoryFilepath,
      action: 'created'
    })
  }
}

function createGenericDao({ path, componentsFolder, componentType = 'dao', persistenceType }) {
  const genericDaoTemplateFilepath = `../templates/${componentType}.${persistenceType}.generic.template`
  const genericDaoTextUrl = new URL(genericDaoTemplateFilepath, import.meta.url)
  const genericDaoText = fs.readFileSync(genericDaoTextUrl, 'utf-8')
  const genericDaoFilepath = `${path}/${componentsFolder}/Dao${capitalize(persistenceType)}.js`

  safeWriteFileSync(genericDaoFilepath, genericDaoText)
  logInfo({
    location: 'createDao',
    file: genericDaoFilepath,
    action: 'created'
  })
}

export function createDao({ entityName, path, componentType = 'dao', componentsFolder = 'daos', persistenceType }) {
  logDebug({ location: 'createDao', arguments: { entityName, path, componentType, componentsFolder, persistenceType } })

  const daoTemplateUrl = new URL(`../templates/${componentType}.${persistenceType}.template`, import.meta.url)
  const destinationFilename = `${pluralize(entityName)}.${componentType}.${persistenceType}.js`

  const daoTemplate = Handlebars.compile(fs.readFileSync(daoTemplateUrl, 'utf-8'))

  const text = daoTemplate({ entityName })

  const newDaoFilepath = `${path}/${componentsFolder}/${destinationFilename}`

  safeWriteFileSync(newDaoFilepath, text)
  logInfo({
    location: 'createDao',
    file: newDaoFilepath,
    action: 'created'
  })

  if (!pathContainsFile(`${path}/${componentsFolder}/`, `Dao${capitalize(persistenceType)}.js`)) {
    createGenericDao({ path, componentsFolder, persistenceType })
  }
}

export function createService({ entityName, path, importRepository = false, componentType = 'service', componentsFolder = 'services' }) {
  logDebug({ location: 'createService', arguments: { entityName, path, importRepository, componentType, componentsFolder } })

  const serviceTemplateUrl = new URL('../templates/service.template', import.meta.url)
  const serviceTemplate = Handlebars.compile(fs.readFileSync(serviceTemplateUrl, 'utf-8'))

  const text = serviceTemplate({
    entityName,
    importRepository
  })

  const newServiceFilePath = `${path}/${componentsFolder}/${pluralize(entityName)}.${componentType}.js`

  safeWriteFileSync(newServiceFilePath, text)
  logInfo({
    location: 'createService',
    file: newServiceFilePath,
    action: 'created'
  })
}

export function createIdModel({ path, componentType = 'model', componentsFolder = 'models', entityName = 'id' }) {
  const text = `import { randomUUID } from 'crypto'

export class ${capitalize(entityName)} extends String {
  constructor() {
    super(randomUUID())
  }
}`

  const newIdModelFilePath = `${path}/${componentsFolder}/${capitalize(entityName)}.${componentType}.js`

  safeWriteFileSync(newIdModelFilePath, text)
  logInfo({
    location: 'createModel',
    file: newIdModelFilePath,
    action: 'created'
  })
}

export function createModel({ entityName, path, componentType = 'model', componentsFolder = 'models' }) {
  logDebug({ location: 'createModel', arguments: { entityName, path, componentType, componentsFolder } })

  if (!pathContainsFile(`${path}/${componentsFolder}/`, `Id.model.js`)) {
    createIdModel({ path, componentsFolder })
  }

  const destinationFilename = `${capitalize(entityName)}.${componentType}.js`
  const newModelFilepath = `${path}/${componentsFolder}/${destinationFilename}`

  const text = `import { Id } from './Id.model.js'

export class ${capitalize(entityName)} {
  constructor({ id = new Id() }) {
    this.id = id
  }
}
`
  //TODO: cambiar el string hardcodeado por leer el template de handlebars!

  safeWriteFileSync(newModelFilepath, text)

  logInfo({
    location: 'createModel',
    file: newModelFilepath,
    action: 'created'
  })
}

export function createModule({ entityName, path, persistenceType }) {
  logDebug({ location: 'createModule', arguments: { entityName, path, persistenceType } })

  createModel({ entityName, path })
  createDao({ entityName, path, persistenceType })
  createRepository({ entityName, path, persistenceType })
  createController({ entityName, path, persistenceType })
  createRouter({ entityName, path })
}

//-----------------------------------------------------------

export function createProject({ projectName, projectExtras: { frontend, dotenv, mocha, mongoose } }) {

  const packageJson = {
    type: "module",
    name: undefined,
    version: "1.0.0",
    main: "src/main.js",
    scripts: {
      start: "node .",
      test: "nodemon ."
    },
    keywords: [],
    author: "drmaquino",
    license: "ISC",
    description: "",
    dependencies: {
      express: "latest"
    },
    devDependencies: {
      nodemon: "latest",
      "@types/node": "latest",
      "@types/express": "latest",
    }
  }

  logDebug({
    location: 'createProject',
    arguments: {
      projectName,
      projectExtras: {
        frontend, dotenv, mocha, mongoose
      }
    }
  })

  packageJson.name = projectName

  createMainJs(projectName)
  createAppJs(projectName)
  createServerConfigJs(projectName)
  createApiRouterJs(projectName)

  if (frontend) {
    createFrontEndFiles(projectName)
  }

  if (mocha) {
    const sampleIntegrationTest = `describe('app', () => {
    it('should', () => {
        /*...*/
    })
})
`
    safeWriteFileSync(`${projectName}/test/app/app.test.js`, sampleIntegrationTest)

    const sampleUnitTest = `describe('service', () => {
    it('should...', () => {
        /*...*/
    })
})
`
    safeWriteFileSync(`${projectName}/test/service/service.test.js`, sampleUnitTest)

    packageJson.devDependencies.mocha = 'latest'
    packageJson.devDependencies['@types/mocha'] = 'latest'

    packageJson.scripts.test = 'mocha --recursive'
  }

  if (dotenv) {
    safeWriteFileSync(`${projectName}/.env`, 'PORT=8080')

    packageJson.dependencies.dotenv = 'latest'
  }

  if (mongoose) {
    safeWriteFileSync(`${projectName}/src/config/mongodb.config.js`,
      `export const CNX_STR = process.env.CNX_STR || 'mongodb://localhost'`)
    packageJson.dependencies.mongoose = 'latest'

    fs.appendFileSync(`${projectName}/src/main.js`, `import mongoose from 'mongoose'
import { CNX_STR } from './config/mongodb.config.js'
await mongoose.connect(CNX_STR)
console.log(\`conectado a base de datos en '\${CNX_STR}'\`)`
    )
  }

  safeWriteFileSync(`${projectName}/package.json`, JSON.stringify(packageJson, null, 2))
}

function createFrontEndFiles(projectName) {
  safeWriteFileSync(`${projectName}/public/css/style.css`, '* { }')
  safeWriteFileSync(`${projectName}/public/js/index.js`, '')

  const sampleHtml = fs.readFileSync(new URL('../templates/html.template', import.meta.url), 'utf-8')
  safeWriteFileSync(`${projectName}/views/index.html`, sampleHtml)
}

function createApiRouterJs(projectName) {
  //TODO: agregar lectura de carpeta de routers y carga automatica de todo lo que encuentre?

  const apiRouterJsTxt = `import { Router } from 'express'

export const apiRouter = Router()

`

  safeWriteFileSync(`${projectName}/src/routers/api.router.js`, apiRouterJsTxt)
}

function createServerConfigJs(projectName) {
  const serverConfigJsTxt = `export const PORT = parseInt(process.env.PORT || '8080')`
  safeWriteFileSync(`${projectName}/src/config/server.config.js`, serverConfigJsTxt)
}

function createAppJs(projectName) {

  const sections = {
    imports: [
      `import express from 'express'`,
      `import { apiRouter } from '../routers/api.router.js'`
    ],
    body: ['const app = express()'],
    middlewares: [
      `app.use(express.json())`,
      `app.use((req, res, next) => { console.log(\`(\${req.method}) \${req.url}\`); next() })`,
      `app.use('/api', apiRouter)`,
    ],
    exports: [
      'export { app }'
    ]
  }

  const lines = []
  for (const section in sections) {
    for (const line of sections[section]) {
      lines.push(line)
    }
    lines.push('')
  }
  const appJsTxt = lines.join('\n')

  safeWriteFileSync(`${projectName}/src/app/app.js`, appJsTxt)
}

function createMainJs(projectName) {
  const mainJsTxt = `import { PORT } from './config/server.config.js'
import { app } from './app/app.js'

app.listen(PORT, () => { console.log(\`escuchando en puerto $\{PORT\}\`) })
`
  safeWriteFileSync(`${projectName}/src/main.js`, mainJsTxt)
}
