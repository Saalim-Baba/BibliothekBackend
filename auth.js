const express = require('express')
const app = express()
const port = 3000
const expressBasicAuth = require('express-basic-auth')
app.use(express.json())

const basicAuthmiddleware = expressBasicAuth({
  users: { "milaasHD": 'hereisit' },
  challenge: true
})

app.get('/sock', basicAuthmiddleware, (request, response) => {
  response.send(basicAuthmiddleware)
})

app.get('/public', (request, response) => {
  response.sendStatus(200)
})

app.get('/private', (request, response) => {
  const auth = 'Basic emxpOnpsaTEyMzQ='
  console.log(request.headers)
  const pw = request.headers.authorization
  if (pw === auth) {
    response.sendStatus(200)
  } else {
    response.sendStatus(401)
  }
})

app.listen(port, () => {
  console.log(`Server läuft auf Port: ${port}`)
})
