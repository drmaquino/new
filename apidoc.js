function pluralizar(palabra) {
    if (['a', 'e', 'i', 'o', 'u'].includes(palabra[palabra.length - 1])) {
        return palabra + 's'
    } else {
        return palabra + 'es'
    }
}

class OpenApiSpec {
    constructor(title = "Api Docs", description = "Api docs.") {
        this.openapi = "3.0.0"
        this.info = {
            "version": "1.0.0",
            "title": title,
            "description": description
        }
        this.tags = []
        this.paths = {}
        this.components = { schemas: {}, requestBodies: {} }
    }

    addResource(nombre, propiedades) {
        this.addTag(pluralizar(nombre))
        this.addSchema(nombre, propiedades)
        this.addRequestBody(`input_${nombre}`, propiedades.filter(p => p.required && p.name !== 'id'))
        this.addPost(nombre)
    }

    addTag(nombre) {
        this.tags.push({
            name: nombre,
            description: `API para administrar ${nombre}.`
        })
    }

    addSchema(nombre, propiedades) {
        const schema = {
            "type": "object",
            /** @type string[] */
            "required": [],
            "properties": {},
            "example": {},
        }

        for (const property of propiedades) {
            schema.properties[property.name] = {
                type: property.type,
                description: property.description,
            }
            if (property.required) {
                schema.required.push(property.name)
            }

            schema.example[property.name] = property.example
        }

        this.components.schemas[nombre] = schema
    }

    addRequestBody(nombre, propiedades) {
        const reqBody = {
            "type": "object",
            /** @type string[] */
            "required": [],
            "properties": {},
            "example": {},
        }

        for (const property of propiedades) {
            reqBody.properties[property.name] = {
                type: property.type,
                description: property.description,
            }
            if (property.required) {
                reqBody.required.push(property.name)
            }

            reqBody.example[property.name] = property.example
        }

        this.components.requestBodies[nombre] = reqBody
    }

    addPath(method, path, behaviour) {
        if (!this.paths[path]) this.paths[path] = {}
        this.paths[path][method] = behaviour
    }

    addGet(path, behaviour) {
        this.addPath("get", path, behaviour)
    }

    addPost(entity, behaviour = {
        "summary": `Crea una nueva instancia de ${entity}.`,
        "tags": [
            pluralizar(entity)
        ],
        "requestBody": {
            "required": true,
            "content": {
                "application/json": {
                    "schema": {
                        "$ref": `#/components/requestBodies/input_${entity}`
                    }
                }
            }
        },
        "responses": {
            "201": {
                "description": `La instancia de '${entity}' creada`,
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": `#/components/schemas/${entity}`
                        }
                    }
                }
            }
        }
    }) {
        this.addPath("post", `/api/${pluralizar(entity)}`, behaviour)
    }

    addPut(path, behaviour) {
        this.addPath("put", path, behaviour)
    }

    addDelete(path, behaviour) {
        this.addPath(path, "delete", behaviour)
    }

}

const spec = new OpenApiSpec("Express API with Swagger", "A simple CRUD API application made with Express and documented with Swagger")

spec.addResource("adopcion", [
    {
        name: 'id',
        type: "string",
        description: "El id de la adopcion.",
        example: "3j5k2hr3-t5u6-365n-sk85-h58sk24ughd7"
    },
    {
        name: 'idusuario',
        required: true,
        type: "string",
        description: "El id del usuario.",
        example: "4ughd7r3-365n-t5u6-sk85-h58sk23j5k2h"
    },
    {
        name: 'idmascota',
        required: true,
        type: "string",
        description: "El id de la mascota.",
        example: "d7r34ugh-t5u6-365n-sk85-8sk23j5k2hh5"
    }
])

spec.addResource("usuario", [
    {
        name: 'id',
        type: "string",
        description: "El id del usuario.",
        example: "4ughd7r3-365n-t5u6-sk85-h58sk23j5k2h"
    },
    {
        name: 'nombre',
        type: "string",
        description: "El nombre del usuario.",
        required: true,
        example: "juan",
    },
    {
        name: 'apellido',
        type: "string",
        description: "El apellido del usuario.",
        required: true,
        example: "perez",
    },
    {
        name: 'email',
        type: "string",
        description: "El email del usuario.",
        required: true,
        example: "juan@mail.com",
    },
    {
        name: 'password',
        type: "string",
        description: "La contraseña del usuario.",
        required: true,
        example: "abc123"
    }
])

spec.addResource("mascota", [
    {
        name: 'id',
        type: "string",
        description: "El id de la mascota.",
        example: "4ughd7r3-365n-t5u6-sk85-h58sk23j5k2h"
    },
    {
        name: 'nombre',
        type: "string",
        description: "El nombre de la mascota.",
        required: true,
        example: "pepe"
    },
    {
        name: 'especie',
        type: "string",
        description: "La especie de la mascota.",
        required: true,
        example: "loro"
    },
    {
        name: 'fechaNacimiento',
        type: "string",
        description: "La fecha de nacimiento de la mascota.",
        required: true,
        example: "2010-06-15"
    },
    {
        name: 'adoptada',
        type: "string",
        description: "Indica si la mascota se encuentra adoptada o no.",
        example: false
    },
    {
        name: 'duenio',
        type: "string",
        description: "El id del dueño de la mascota.",
        example: "j4u6j83k-r3j8-2wsa-567u-ab3465i923e0"
    },
    {
        name: 'foto',
        type: "string",
        description: "La foto de la mascota.",
        example: "/fotos/645753246343-foto.png"
    },
])

//--------------------------------------------------------------------------------------------------

// spec.addPath("get", '/api/mascotas', {
//     "summary": "Devuelve todas las mascotas disponibles.",
//     "tags": [
//         "mascotas"
//     ],
//     "responses": {
//         "200": {
//             "description": "Cada mascota disponible.",
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "type": "array",
//                         "items": {
//                             "$ref": "#/components/schemas/mascota"
//                         }
//                     }
//                 }
//             }
//         }
//     }
// })

// spec.addPath("get", "/api/mascotas/{id}", {
//     "summary": "Devuelve la mascota con el ID dado.",
//     "tags": [
//         "mascotas"
//     ],
//     "parameters": [
//         {
//             "name": "id",
//             "in": "path",
//             "description": "parametro de ruta con el ID de la mascota.",
//             "required": true,
//             "type": "string"
//         }
//     ],
//     "responses": {
//         "200": {
//             "description": "La mascota con el ID dado.",
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "$ref": "#/components/schemas/mascota"
//                     }
//                 }
//             }
//         },
//         "404": {
//             "description": "Error de mascota no encontrada."
//         }
//     }
// })

// spec.addPath("get", "/api/usuarios", {
//     "summary": "Devuelve todos los usuarios disponibles.",
//     "tags": [
//         "usuarios"
//     ],
//     "responses": {
//         "200": {
//             "description": "Cada usuario disponible.",
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "type": "array",
//                         "items": {
//                             "$ref": "#/components/schemas/usuario"
//                         }
//                     }
//                 }
//             }
//         }
//     }
// })

// spec.addPath("get", "/api/usuarios/{id}", {
//     "summary": "Devuelve el usuario con el ID dado.",
//     "tags": [
//         "usuarios"
//     ],
//     "parameters": [
//         {
//             "name": "id",
//             "in": "path",
//             "description": "parametro de ruta con el ID del usuario.",
//             "required": true,
//             "type": "string"
//         }
//     ],
//     "responses": {
//         "200": {
//             "description": "El usuario con el ID dado.",
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "$ref": "#/components/schemas/usuario"
//                     }
//                 }
//             }
//         },
//         "404": {
//             "description": "Error de usuario no encontrado."
//         }
//     }
// })

// spec.addPath("get", "/api/adopciones", {
//     "summary": "Devuelve todas las adopciones disponibles.",
//     "tags": [
//         "adopciones"
//     ],
//     "responses": {
//         "200": {
//             "description": "Cada adopción disponible.",
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "type": "array",
//                         "items": {
//                             "$ref": "#/components/schemas/adopcion"
//                         }
//                     }
//                 }
//             }
//         }
//     }
// })

// spec.addPath("get", "/api/adopciones/{id}", {
//     "summary": "Devuelve la adopción con el ID dado.",
//     "tags": [
//         "adopciones"
//     ],
//     "parameters": [
//         {
//             "name": "id",
//             "in": "path",
//             "description": "parametro de ruta con el ID de la adopción.",
//             "required": true,
//             "type": "string"
//         }
//     ],
//     "responses": {
//         "200": {
//             "description": "La adopcion con el ID dado.",
//             "content": {
//                 "application/json": {
//                     "schema": {
//                         "$ref": "#/components/schemas/adopcion"
//                     }
//                 }
//             }
//         },
//         "404": {
//             "description": "Error de adopción no encontrada."
//         }
//     }
// })

export { spec }