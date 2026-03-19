import express from 'express'
import dotenv from 'dotenv'
import http from 'http'
import { Server } from 'socket.io'
import axios from 'axios'
dotenv.config()

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 5000

const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_BASE_URL
  }
})

io.on('connection', socket => {
  //console.log(`User connected: ${socket.id}`)

  socket.on('identity', async (userId)  => {
   // console.log(userId)
    await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/connect`, {
      userId,
      socketId: socket.id
    })
  })

  socket.on('update-location', async ({userId,latitude,longitude})=>{
    const location = {
        type:"Point",
        coordinates:[longitude, latitude]
    }
    await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/update-location`, {
      userId,
      location
    })
  })

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`)
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
