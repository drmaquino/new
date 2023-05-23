import fs from 'node:fs'
import Handlebars from 'handlebars'

export function extraerIntencion(words) {
  const daoTypes = ['memoria', 'mongoose']
  const componentTypes = ['router', 'controller', 'service', 'repository', 'dao', 'project', 'module']

  const result = {
    daoType: 'memoria',
    path: './src',
    entityName: '',
    componentType: ''
  }

  words = words.map(w => w.toLowerCase())

  for (const word of words) {
    if (daoTypes.includes(word)) {
      result.daoType = word
    } else if (componentTypes.includes(word)) {
      result.componentType = word
    } else if (word.startsWith('./')) {
      result.path = word
    } else {
      result.entityName = word
    }
  }

  if (!result.entityName) throw new Error('falta el nombre de la entidad')
  if (!result.componentType) throw new Error('falta el tipo de commponente')
  if (!result.daoType) throw new Error('falta el tipo de persistencia')
  if (!result.path) throw new Error('falta la ruta')

  return result
}

//----------------------------------------------------------------

import { inspect } from 'node:util'
let VERBOSE_MODE = false
if (process.argv.slice(2).includes('--verbose')) {
  VERBOSE_MODE = true
}

export function log(context) {
  if (VERBOSE_MODE) {
    const location = context.location
    delete context.location
    console.log(`${new Date().toLocaleString()}: [${location}] ${inspect(context, false, 10)}`)
  }
}

//----------------------------------------------------------------

export function safeWriteFileSync(path, content) {
  const lastBarIndex = path.lastIndexOf('/')
  const dirPath = path.slice(0, lastBarIndex)
  fs.mkdirSync(dirPath, { recursive: true })
  fs.writeFileSync(path, content)
}

export function pathContainsFile(path, filename) {
  try {
    const daos = fs.readdirSync(path)
    return daos.includes(filename)
  } catch (error) {
    return false
  }
}

//----------------------------------------------------------------

export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

export function decapitalize(word) {
  return word.toLowerCase()
}

//----------------------------------------------------------------

Handlebars.registerHelper('capitalized', function (word) {
  return capitalize(word)
})

Handlebars.registerHelper('decapitalized', function (word) {
  return decapitalize(word)
})

export { Handlebars }

//----------------------------------------------------------------
