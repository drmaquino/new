import fs from 'node:fs'
import Handlebars from 'handlebars'

export function extraerIntencion(words) {
  const excluded = ['con', 'y', 'de', 'para', '--verbose']
  const helpFlags = ['help']
  const projectFlags = ['project']
  const projectExtrasFlags = ['frontend', 'mocha', 'dotenv', 'mongoose']
  const persistenceTypes = ['memoria', 'mongoose']
  const componentTypes = ['module', 'router', 'controller', 'service', 'repository', 'dao', 'model']

  const result = {
    help: false,
    /***/
    project: false,
    projectName: '',
    projectLibs: [],
    projectExtras: {
      frontend: false,
      dotenv: false,
      mocha: false,
      mongoose: false,
    },
    /***/
    component: false,
    componentType: '',
    entityName: '',
    /***/
    persistenceType: 'memoria',
    path: './src',
  }

  for (const word of words) {
    if (excluded.includes(word)) {
      continue
    }

    if (helpFlags.includes(word.toLowerCase())) {
      result.help = true
    }
    else if (projectFlags.includes(word.toLowerCase())) {
      result.project = true
    }
    else if (componentTypes.includes(word.toLowerCase())) {
      result.component = true
      result.componentType = word.toLowerCase()
    }
    else if (persistenceTypes.includes(word.toLowerCase())) {
      result.persistenceType = word.toLowerCase()
    }
    else if (projectExtrasFlags.includes(word.toLowerCase())) {
      // @ts-ignore
      result.projectExtras[word.toLowerCase()] = true
    }
    else if (word.startsWith('./')) {
      result.path = word.toLowerCase()
    }
    else {
      result.entityName = word
    }
  }

  if (result.project) {
    result.projectName = result.entityName
    //@ts-ignore
    delete result.entityName

    if (!result.projectName) {
      result.projectName = `server-${Date.now()}`
    }

    if (result.persistenceType === 'mongoose') {
      result.projectExtras.mongoose = true
    }
  }

  if (result.component && !result.entityName) throw new Error('falta el nombre de la entidad')
  if (result.component && !result.componentType) throw new Error('falta el tipo de componente')

  return result
}

//----------------------------------------------------------------

import { inspect } from 'node:util'
let VERBOSE_MODE = false
if (process.argv.slice(2).includes('--verbose')) {
  VERBOSE_MODE = true
}

function log(context) {
  const location = context.location
  delete context.location
  console.log(`${new Date().toLocaleString()}: [${location}] ${inspect(context, false, 10)}`)
}

export function logInfo(context) {
  log(context)
}

export function logDebug(context) {
  if (VERBOSE_MODE) {
    log(context)
  }
}

//----------------------------------------------------------------

export function safeWriteFileSync(path, content) {
  const lastBarIndex = path.lastIndexOf('/')
  const dirPath = path.slice(0, lastBarIndex)
  fs.mkdirSync(dirPath, { recursive: true })
  fs.writeFileSync(path, content)
}

export function appendLineToFileTopSync(path, content) {
  const rows = fs.readFileSync(path).toString().split('\n')
  rows.unshift(content)
  fs.writeFileSync(path, rows.join('\n'))
}

// TODO: usar para algo!
export function appendLineToFileBottom(path, content) {
  const rows = fs.readFileSync(path).toString().split('\n')
  rows.push(content)
  fs.writeFileSync(path, rows.join('\n'))
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
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function decapitalize(word) {
  return word.charAt(0).toLowerCase() + word.slice(1)
}

export function pluralize(palabra) {
  if (palabra.endsWith('s')) return palabra
  if (['a', 'e', 'i', 'o', 'u'].includes(palabra[palabra.length - 1])) return palabra + 's'
  return palabra + 'es'
}

//----------------------------------------------------------------

Handlebars.registerHelper('capitalized', function (word) {
  return capitalize(word)
})

Handlebars.registerHelper('decapitalized', function (word) {
  return decapitalize(word)
})

Handlebars.registerHelper('pluralized', function (word) {
  return pluralize(word)
})

Handlebars.registerHelper('pluralizedCaps', function (word) {
  return pluralize(capitalize(word))
})

export { Handlebars }

//----------------------------------------------------------------
