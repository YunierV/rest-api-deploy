const z = require('zod') // validaciones de los tipos de datos

const movieSchema = z.object({ // no puedo cambiar lo que no se esta validando, aun si lo ingreso en el body
    title: z.string({
        //lo que aparece deacuerdo a los errores o condiciones que le pongamos
        // invalid_type_error: 'movie title STRING', // tipo de dato debe ser String
        required_error: 'movie title REQUIRED', // el campo es requerido
    }),
    year: z.number().int().positive().min(1999).max(2024), // que sea numero, que sea un numero entero, que sea un numero positivo, minimo permitido, maximo permitido
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(0), // valores por defecto .default(0) // opcional .optional() // nulo .nullable()
    poster: z.string().url({
        mensaje: 'movie poster URL valid'
    }), //validar si es url, que tenga cierta terminacion .endsWith('.jpg')
    genre: z.array( // una opcion es: pero damos pase a que se ingrese lo que se quiera, con el enum lo que se puede ingresar lo limitamos nosotros
        z.enum(['Action', 'Crime', 'Drama', 'Adventure', 'Sci-Fi', 'Fantasy', 'Romance', 'Biography']),
        {
            required_error: 'is REQUIRED genre',
            invalid_type_error: 'movie genre INVALID ENUM-ARRAY'
        }
    )
})

function validateMovie(object){
    return movieSchema.safeParse(object) // safeParse: devuelve un obj result que te devuelve si hay un error o si hay datos,
}

function validatePartialsMovie (input){
    return movieSchema.partial().safeParse(input) // partial: todos y cada unoa de las propiesdades las va a hacer a opcionesl, si no estan no hace nada pero si esta la valida como esta en el esquema
}

module.exports = {validateMovie, validatePartialsMovie}