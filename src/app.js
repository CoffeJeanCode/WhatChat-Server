import { config } from 'dotenv'
config()

import express from 'express'
import cors from 'cors'
import SocketIO from 'socket.io'
import http from 'http'
import sockets from "./sockets"

// Intialization
const app = express()
const server = http.createServer(app)
const io = SocketIO(server)

app.set('port', process.env.PORT || 4000)

// Socket IO
io.on('connection', (socket) => sockets(socket, io))

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.get('/', (_, res) => {
  res.send("I'm Alive")
})

export { app, server }
