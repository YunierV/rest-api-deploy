The code is a simple API REST that allows you to manage movies.

* npm run start

To run the code, first install the dependencies with the following command:

```
npm install
```

Then, start the server with the following command:

```
npm start
```

The API will be available at http://localhost:8080.

You can test the API with the following requests:

* GET /movies: get all movies
* GET /movies/:id: get a movie by id
* POST /movies: create a new movie
* PATCH /movies/:id: update a movie
* DELETE /movies/:id: delete a movie

The request body for the POST and PATCH requests should be a JSON object with the following properties:

* title: the title of the movie
* year: the year the movie was released
* director: the director of the movie
* duration: the duration of the movie in minutes
* poster: the URL of the movie poster
* genre: an array of strings with the genres of the movie
* rate: the rating of the movie from 0 to 10

The response body for all requests will be a JSON object with the following properties:

* id: the id of the movie
* title: the title of the movie
* year: the year the movie was released
* director: the director of the movie
* duration: the duration of the movie in minutes
* poster: the URL of the movie poster
* genre: an array of strings with the genres of the movie
* rate: the rating of the movie from 0 to 10

In addition to the API, there is also a web page that you can use to test the API. The web page is located at http://localhost:8080/web.

- npx servor ./web

The web page allows you to list all movies, create new movies, update existing movies, and delete movies.