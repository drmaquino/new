import fs from 'fs'
import { createModule } from './createComponent.js'

function findPath(folderName) {
  const fullPath = `../assets/${folderName}`
  return new URL(fullPath, import.meta.url)
}
function curryClone(projectName) {
  return function (path) {
    fs.cpSync(findPath(path), `${projectName}/${path}`, { recursive: true })
  }
}

export function createProject(args = []) {

  if (args[0] === '--help' || args[0] === '-H') {
    console.log(`
Opciones:
--frontend      |  -F
    crea también ./public y ./views
--test          |  -T
    crea también ./test e instala mocha@latest
--environment   |  -E
    crea también .env e instala dotenv@latest
    `)
    process.exit()
  }

  let projectName
  if (args.length === 0 || args[0].startsWith('-')) {
    projectName = `server-${Date.now()}`
  } else {
    projectName = args[0]
    args = args.slice(1)
  }

  try {
    fs.mkdirSync(projectName)
  } catch (error) {
    if (error.message?.startsWith('EEXIST')) {
      projectName += `${Date.now()}`
      fs.mkdirSync(projectName)
    } else {
      throw error
    }
  }

  const packageJsonObj = JSON.parse(fs.readFileSync(findPath('package.json'), 'utf-8'))
  packageJsonObj.name = projectName

  fs.mkdirSync(`${projectName}/src`)

  const clone = curryClone(projectName)

  clone('src/main.js')
  clone('src/app')
  clone('src/config')
  createModule('xs', 'memoria', `${projectName}/src`)

  if (args.includes('--frontend') || args.includes('-F')) {
    clone('public')
    clone('views')
  }

  if (args.includes('--test') || args.includes('-T')) {
    clone('test')
    packageJsonObj.devDependencies.mocha = 'latest'
    packageJsonObj.scripts.test = 'mocha --recursive'
  }

  if (args.includes('--environment') || args.includes('-E')) {
    fs.writeFileSync(`${projectName}/.env`, '')
    packageJsonObj.dependencies.dotenv = 'latest'
  }

  fs.writeFileSync(`${projectName}/package.json`, JSON.stringify(packageJsonObj, null, 2))
}