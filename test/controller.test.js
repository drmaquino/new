import * as controllers from ''

function testHandler(handler, request) {

  return new Promise((resolve, reject) => {

    const response = {
      json: data => {
        console.log(data)
        resolve(data)
      }
    }

    const next = error => {
      if (error) {
        console.log(error)
        reject(error)
      }
    }

    handler(request, response, next)
  })
}

await testHandler(controllers.handlePost, {
  body: {
    nombre: 'marian',
    apellido: 'aquino',
    edad: 37
  }
})

await testHandler(controllers.handleGet, {
  params: {},
  query: {
    edad: 37
  }
})


