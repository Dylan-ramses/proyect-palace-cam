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
// array of strangers
let connectedPeersStrangers = []

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
  // socket on WebRTC signaling
  socket.on('webRTC-signaling', data => {
    const {connectedUserSocketId} = data
    const connectedPeer = connectedPeers.find((peerSocketId) => peerSocketId === connectedUserSocketId)
    if(connectedPeer) {
      io.to(connectedUserSocketId).emit('webRTC-signaling', data)
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
    // new connected peers
    const newConnectedPeersStrangers = connectedPeersStrangers.filter((peerSocketId) => peerSocketId !== socket.id)
    connectedPeersStrangers = newConnectedPeersStrangers
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

  // user hanged up
  socket.on('user-hanged-up', data => {
    const {connectedUserSocketId} = data
    // grabbing the peer based on data
    const connectedPeer = connectedPeers.find((peerSocketId) => peerSocketId === calleePersonalCode)
    if(connectedPeer) {
      io.to(connectedUserSocketId).emit('user-hanged-up')
    }
  })

  socket.on('stranger-connection-status', data => {
    const {status} = data
    if(status) {
      connectedPeersStrangers.push(socket.id)
    } else {
      const newConnectedPeersStrangers = connectedPeersStrangers.filter(peerSocketId => peerSocketId !== socket.id)
    }
    connectedPeersStrangers = newConnectedPeersStrangers
    console.log(connectedPeersStrangers)
  })

  socket.on('get-stranger-socket-id', () => {
    // generating a random socket ID
    let randomStrangerSocketId
    const filteredConnectedPeersStrangers = connectedPeersStrangers.filter((peerSocketId) => peerSocketId !== socket.id)
    if(filteredConnectedPeersStrangers.length > 0) {
      // getting the random
      randomStrangerSocketId = filteredConnectedPeersStrangers[Math.floor(Math.random() * filteredConnectedPeersStrangers.length)]
    } else {
      randomStrangerSocketId = null
    }
    // preparing data
    const data = {
      randomStrangerSocketId
    }
    // emitting
    io.to(socket.id).emit('stranger-socket-id', data)
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
