const express = require('express')
const books = require('./books.json')
const lends = require('./lends.json')
const app = express()
const port = 3000
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger-output.json')
const session = require('express-session')

app.use(session({
  secret: 'megamind',
  resave: true,
  saveUninitialized: true,
  cookie: {}
}))

app.get('/books', (request, response) => {
  response.json(books)
})
app.get('/books/:isbn', (request, response) => {
  const isbn = request.params.isbn
  const book = books.find(b => b.isbn === JSON.parse(isbn))
  if (!book) {
    return response.status(404).send({ error: 'Book not found' })
  }
  response.json(book)
})

app.post('/books', (request, response) => {
  const newEntry = request.body
  if (isValid(newEntry)) {
    books.push(newEntry)
    response.json(books)
    response.sendStatus(201)
  } else {
    response.sendStatus(422)
  }
})

app.put('/books/:isbn', (request, response) => {
  const isbn = request.params.isbn
  const newBook = request.body
  const book = books.findIndex(b => b.isbn === isbn)
  books[book] = newBook
  response.json(newBook)
})
app.delete('/books/:isbn', (request, response) => {
  const isbn = request.params.isbn
  const book = books.findIndex(b => b.isbn === isbn)
  books.splice(book, 1)
  response.json(books)
})

app.patch('/books/:isbn', (request, response) => {
  const isbn = request.params.isbn
  const newBook = request.body
  const book = books.findIndex(b => b.isbn === isbn)
  Object.assign(books[book], newBook)
  response.json(books)
})

/// lends start here

app.get('/lends', (request, response) => {
  if (request.session.status === 'authentifiziert') {
    response.json(lends)
  } else {
    response.sendStatus(401)
  }
})
app.get('/lends/:id', (request, response) => {
  if (request.session.status === 'authentifiziert') {
    const id = request.params.id
    const lend = lends.find(b => b.identity === id)
    if (lend !== undefined) {
      response.json(lend)
    } else {
      response.sendStatus(404)
    }
  } else {
    response.sendStatus(401)
  }
})
app.post('/lends', (request, response) => {
  if (request.session.status === 'authentifiziert') {
    const newLend = request.body
    if (isValid(newLend)) {
      lends.push(newLend)
      response.sendStatus(201)
    } else {
      response.sendStatus(422)
    }
  } else {
    response.sendStatus(401)
  }
})
app.delete('/lends/:id', (request, response) => {
  if (request.session.status === 'authentifiziert') {
    const id = request.params.id
    const lend = lends.findIndex(b => b.identity === id)
    lends.splice(lend, 1)
    response.json(lends)
  } else {
    response.sendStatus(401)
  }
})

app.post('/login', (request, response) => {
  const email = request.query.email
  const password = request.query.password
  if (email === 'desk@library.example' && password === 'm295') {
    request.session.status = 'authentifiziert'
    response.sendStatus(200)
  } else {
    request.session.status = 'nicht authentifiziert'
    response.sendStatus(401)
  }
})

app.get('/verify', (request, response) => {
  if (request.session.status === 'authentifiziert') {
    response.sendStatus(200)
  } else {
    response.sendStatus(401)
  }
})
app.delete('/logout', (request, response) => {
  request.session.status = 'nicht authentifiziert'
  response.sendStatus(204)
})
function isValid (lends) {
  return lends.identity !== undefined && lends.identity !== '' &&
        lends.customer_identity !== undefined && lends.customer_identity !== '' &&
        lends.isbn !== undefined && lends.isbn !== '' &&
        lends.borrowed_at !== undefined && lends.borrowed_at !== ''
}

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
  console.log(`Server läuft auf Port: ${port}`)
})
