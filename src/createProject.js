import fs from 'fs'
import { log, safeWriteFileSync } from './utils.js'

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

export function createProject({ projectName, projectExtras: { frontend, dotenv, mocha, mongoose } }) {

  log({
    location: 'createProject',
    arguments: {
      projectName,
      projectExtras: {
        frontend, dotenv, mocha, mongoose
      }
    }
  })

  packageJson.name = projectName

  const mainJsTxt = `import { PORT } from './config/server.config.js'
import { app } from './app/app.js'

app.listen(PORT, () => { console.log(\`escuchando en puerto $\{PORT\}\`) })
`
  safeWriteFileSync(`${projectName}/src/main.js`, mainJsTxt)

  const appJsTxt = `import express from 'express'
import { apiRouter } from '../routers/api.router.js'

export const app = express()

app.use(express.json())

app.use((req, res, next) => { console.log(\`(\${req.method}) \${req.url}\`); next() })

app.use('/api', apiRouter)
`

  safeWriteFileSync(`${projectName}/src/app/app.js`, appJsTxt)

  const serverConfigJsTxt = `export const PORT = parseInt(process.env.PORT || '8080')`
  safeWriteFileSync(`${projectName}/src/config/server.config.js`, serverConfigJsTxt)

  const apiRouterJsTxt = `import { Router } from 'express'

export const apiRouter = Router()

`

  safeWriteFileSync(`${projectName}/src/routers/api.router.js`, apiRouterJsTxt)

  if (frontend) {
    safeWriteFileSync(`${projectName}/public/css/style.css`, '* { }')
    safeWriteFileSync(`${projectName}/public/js/index.js`, '')

    const sampleHtml = fs.readFileSync(new URL('../templates/html.template', import.meta.url), 'utf-8')
    safeWriteFileSync(`${projectName}/views/index.html`, sampleHtml)
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
