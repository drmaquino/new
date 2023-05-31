import fs from 'node:fs'
import Handlebars from 'handlebars'

export function extraerIntencion(words) {
  const excluded = ['con', 'y', 'de', 'para', '--verbose']
  const helpFlags = ['help']
  const projectFlags = ['project']
  const projectExtrasFlags = ['frontend', 'mocha', 'dotenv', 'mongoose']
  const persistenceTypes = ['memoria', 'mongoose']
  const componentTypes = ['module', 'router', 'controller', 'service', 'repository', 'dao']

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

  words = words.map(w => w.toLowerCase())

  for (const word of words) {
    if (excluded.includes(word)) {
      continue
    }

    if (helpFlags.includes(word)) {
      result.help = true
    }
    else if (projectFlags.includes(word)) {
      result.project = true
    }
    else if (componentTypes.includes(word)) {
      result.component = true
      result.componentType = word
    }
    else if (persistenceTypes.includes(word)) {
      result.persistenceType = word
    }
    else if (projectExtrasFlags.includes(word)) {
      // @ts-ignore
      result.projectExtras[word] = true
    }
    else if (word.startsWith('./')) {
      result.path = word
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
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function decapitalize(word) {
  return word.charAt(0).toLowerCase() + word.slice(1)
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
