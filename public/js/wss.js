// this is for registering web socket listeners
import * as store from './store.js'
import * as ui from './ui.js'
import * as webRTCHandler from './webRTCHandler.js'

let socketIO = null;

// grabbing the function
export const registerSocketEvents = (socket) => {
  // init socketIO object
  socketIO = socket
  // registering the listeners
  socket.on('connect', () => {
    // protocol for transfering data
    console.log('successfully connected to socket.io server', socket.id)
    store.setSocketId(socket.id) // storing in object
    ui.updatePersonalCode(socket.id) // setting things up inside the UI component
  })
  // receiving the pre-offer
  socket.on('pre-offer', data => {
    console.log('pre offer came')
    webRTCHandler.handlePreOffer(data)
  })

  socket.on('pre-offer-answer', data => {
    webRTCHandler.handlePreOfferAnswer(data)
  })
}

export const sendPreOffer = (data) => {
  console.log('emitting to server pre-offer event')
  socketIO.emit('pre-offer', data) // emit this to the server (emitting pre-offer)
}

export const sendPreOfferAnswer = (data) => {
  socketIO.emit('pre-offer-answer', data)
}
