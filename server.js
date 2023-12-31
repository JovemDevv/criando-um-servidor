const express = require('express')
const cors = require("cors")
const {server: api} = require("./src/api/index")
const { routes } = require("./src/routes/index")


const app = express()
const port = process.env.port || 8080

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(cors())
app.use(express.json())
app.use(routes)
app.use("/api", api)

app.listen(port, () => {
  console.log(`O servidor está funcionando na porta: ${port}`)
})