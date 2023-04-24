// import { PersonasDao, personasDao } from './PERSONAS/daos/personas.dao.js'

// class PersonasRepository {
//   #personasDao
//   constructor(/** @type { PersonasDao } */ personasDao) {
//     this.#personasDao = personasDao
//   }
//   create(data, options) {
//     return this.#personasDao.create(data)
//   }

//   readOne(criteria, options) {
//     return this.#personasDao.readOne(criteria)
//   }

//   readMany(criteria, options) {
//     return this.#personasDao.readMany(criteria)
//   }

//   updateOne(criteria, newData, options) {
//     return this.#personasDao.updateOne(criteria, newData)
//   }

//   updateMany(criteria, newData, options) {
//     return this.#personasDao.updateMany(criteria, newData)
//   }

//   deleteOne(criteria, options) {
//     return this.#personasDao.deleteOne(criteria)
//   }

//   deleteMany(criteria, options) {
//     this.#personasDao.deleteMany(criteria)
//   }
// }

// export const personasRepository = new PersonasRepository(personasDao)