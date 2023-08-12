const { Router } = require("express")
var http = require("http")

const routes = new Router()
// não permite essas solicitações: PUT e GET
routes.put("/api/*", (req, res) =>{
    return res.status(400).end()
})

routes.get("/api/db", (req, res) => {
    return res.status(404).end(http.STATUS_CODES[404])
})

module.exports = { routes }