const express = require('express');
//biblioteca nativa para ids
const crypto = require('node:crypto');

const cors = require('cors');

const movies = require('./movie.json');

const { validateMovie, validatePartialsMovie } = require('./moviesSchemas');

const app = express();

app.disable('x-powered-by');

app.use(express.json())

app.use(cors({ //esto solo es para asegurar que cors de permiso a los origenes o url que nosotros pongamos y no a todos los que quieran hacer uso de nuestro backend
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:8080',
            'http://localhost:1234',
            'https://movies.com',
            'https://midu.dev'
        ]

        if (ACCEPTED_ORIGINS.includes(origin)) {
            return callback(null, true)
        }

        if (!origin) {
            return callback(null, true)
        }

        return callback(new Error('Not allowed by CORS'))
    }
}))

app.get('/', (req, res) => {
    res.json({ mensaje: 'Inicio' })
})

app.get('/movies', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*') //(*): todos los origenes que no sean nuestro propio origen estan permitidos //el * se puede cambiar por la direcion url a la que queramos dar permiso de accesso (solucion error: ERROR CORS -fetch-) 
    // estas header las hace la dependecia cors por si solo
    res.json(movies)
})

// ⬇ segmento dinamico: parametros de la URL
app.get('/movies/:id', (req, res) => { // path-to-regexp _ regexp: poder capturar partes de la url
    const { id } = req.params;

    const movie = movies.find(movie => movie.id === id);
    if (!movie) {
        res.status(404).json({ message: 'not found movie' })
    } else {
        res.json(movie)
    }
})

// recuperar query String //deberia estar en /movie, para que sea RESt pero solo por ser mas grafico para mi lo puse aca
app.get('/moviesg', (req, res) => {
    const { genre } = req.query // query: estan todos los query params tranformados en objectos
    if (genre) {
        // const filterGenre = movies.filter(movie => movie.genre.includes(genre)); // de esta forma funciona si se lo pasamos exactamente como esta escrito

        const filterGenre = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLocaleLowerCase())); //tranformando la busqueda URL y los obj del json en minuscula para que a la hora de filtrar no inporte las minusculas o mayusculas

        return res.json(filterGenre)
    }
    res.json(movies) // estose debolveria si listar todo y los iltros son en la misma consulta, yo lo separe
})

app.post('/movies', (req, res) => {
    //esquema zod, zod validaciones en cadena
    const result = validateMovie(req.body)

    if (result.error) {
        return res.status(400).json({
            error: JSON.parse(result.error.message)
        })
    }

    // const { title, year, director, duration, poster, genre, rate } = req.body // noes necesario ya los datos los toma en la funcion -validateMovie-

    const newMovie = {
        id: crypto.randomUUID(), // uuid v4
        ...result.data, // datos que se retornaron al hacer la validacion

        // title, // no son necesario ya los datos que pasan aca estan en la funcion -validateMovie-
        // year,
        // director,
        // duration,
        // poster,
        // genre,
        // rate: rate ?? 0 //es como una condicional pon el valor rate del req.body, si no pon cero(0)
    }
    // no seria REST por que estamos guardando el estado de la app en memoria //falta la BD
    movies.push(newMovie)

    res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' })
    }

    movies.splice(movieIndex, 1)

    return res.json({ message: 'Movie deleted' })
})

app.patch('/movies/:id', (req, res) => {
    const result = validatePartialsMovie(req.body);

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params

    const movieIndex = movies.findIndex(movie => movie.id === id) //para obtener el indice para poder actualizarlo

    if (movieIndex === -1) return res.json({ error: 'movie not found' })

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie

    return res.json(updateMovie)

})

const PORT = process.env.PORT ?? 8080

app.listen(PORT, () => {
    console.log('listening on port http://localhost:' + PORT)
})