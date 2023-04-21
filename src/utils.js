import fs from 'fs'

export function findPath(folderName) {
  const fullPath = `../assets/${folderName}`
  return new URL(fullPath, import.meta.url)
}
export function curryClone(projectName) {
  return function (path) {
    fs.cpSync(findPath(path), `${projectName}/${path}`, { recursive: true })
  }
}



// export function getAssetFilePath(filename) {
//   return new URL(`../assets/src/${filename}`, import.meta.url)
// }

// export function cloneInto(folderName) {
//   return function (path) {
//     fs.cpSync(getAssetFilePath(path), `${folderName}/${path}`, { recursive: true })
//   }
// }

// function pluralized(word) {
//   if (word.endsWith('s'))
//     return word
//   if (word.endsWith('y')) {
//     return word.slice(0, -1) + 'ies'
//   } else {
//     return word + 's'
//   }
// }

// const assetPaths = {
//   // root:
//   public: new URL('../assets/public', import.meta.url),
//   src: new URL('../assets/src', import.meta.url),
//   test: new URL('../assets/test', import.meta.url),
//   views: new URL('../assets/views', import.meta.url),

//   // src:
//   app: new URL('../assets/src/app', import.meta.url),
//   config: new URL('../assets/src/config', import.meta.url),
//   controllers: new URL('../assets/src/controllers', import.meta.url),
//   middlewares: new URL('../assets/src/middlewares', import.meta.url),
//   repositories: new URL('../assets/src/repositories', import.meta.url),
//   routers: new URL('../assets/src/routers', import.meta.url),
//   services: new URL('../assets/src/services', import.meta.url),
// }

// // const validComponentTypes = [
// //   'public',
// //   'src',
// //   'test',
// //   'views',
// //   'app',
// //   'config',
// //   'controllers',
// //   'middlewares',
// //   'repositories',
// //   'routers',
// //   'services',
// // ]

// // function validateComponentType(assetType) {
// //   if (!Object.keys(assetPaths).includes(assetType)) throw new Error(assetType + ' no es un tipo valido de componente. consulte la ayuda para mas información.')
// // }

// export function createAsset(assetName) {
//   switch (assetName) {
//     case 'repository':
//       fs.cpSync(assetPaths[pluralized(assetName)], `./${pluralized(assetName)}`, { recursive: true })
//       break
//   }
//   // const assetInPlural = pluralized(assetName)
//   // validateComponentType(assetInPlural)
//   // fs.cpSync(assetPaths[assetInPlural], `./${assetInPlural}`, { recursive: true })
// }