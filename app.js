const express = require('express')
const http = require('http')

// server port
const PORT = process.env.PORT || 3000

// creating the app
const app = express()

// creating web server
const server = http.createServer(app)

// creating the socketIO instance
const io = require('socket.io')(server)

// storing the connected peers (array of connected users)
let connectedPeers = []

// listening on logic
io.on('connection', socket => {
  console.log('user connected to socket server', socket.id)
  connectedPeers.push(socket.id)
  // listing the peers
  console.log(connectedPeers)
  // pre-offer event
  socket.on("pre-offer-answer", data => {
    console.log('pre offer answer came', data)
    // grabbing the peer based on data
    const { callerSocketId } = data
    const connectedPeer = connectedPeers.find((peerSocketId) => peerSocketId === callerSocketId)
    if(connectedPeer) {
      io.to(data.callerSocketId).emit('pre-offer-answer', data)
    }
  })
  // disconnecting event
  socket.on('disconnect', () => {
    // user disconnected
    console.log('user disconnected')
    // listing the remaining connected peers
    const newConnectedPeers = connectedPeers.filter((peerSocketId) => peerSocketId !== socket.id)
    // now equaling
    connectedPeers = newConnectedPeers;
    // listing peers
    console.log('remaining', connectedPeers)
  })

  // pre-offer logic
  socket.on('pre-offer', data => {
    console.log('pre-offer-came')
    // extracting values
    const {calleePersonalCode, callType} = data
    // grabbing the peer based on data
    const connectedPeer = connectedPeers.find((peerSocketId) => peerSocketId === calleePersonalCode)
    // checking existence
    if(connectedPeer) {
      const data = {
        callerSocketId: socket.id, // callee itself emitted pre-offer
        callType,
      }
      // emitting then to the callee
      io.to(calleePersonalCode).emit('pre-offer', data)
    } else {
      const data = {preOfferAnswer: 'CALLEE_NOT_FOUND'}
      io.to(socket.id).emit('pre-offer-answer', data)
    }
  })
})

// registering a middleware (public directory as static)
app.use(express.static('public'))

// routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

// listening
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
