// this is for registering web socket listeners
import * as store from './store.js'
import * as ui from './ui.js'
import * as webRTCHandler from './webRTCHandler.js'
import * as constants from './constants.js'
import * as strangerUtils from './strangerUtils.js'

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

  socket.on('webRTC-signaling', data => {
    switch(data.type) {
      case constants.webRTCSignaling.OFFER:
        webRTCHandler.handleWebRTCOffer(data)
        break
      case constants.webRTCSignaling.ANSWER:
        webRTCHandler.handleWebRTCAnswer(data)
        break
      case constants.webRTCSignaling.ICE_CANDIDATE:
        webRTCHandler.handleWebRTCCandidate(data)
        break
      default:
        return
    }
  })

  socket.on('user-hanged-up', () => {
    webRTCHandler.handleConnectedUserHangedUp()
  })

  // getting the random id
  socket.on('stranger-socket-id', data => {
    strangerUtils.connectWithStranger(data)
  })
}

export const sendPreOffer = (data) => {
  console.log('emitting to server pre-offer event')
  socketIO.emit('pre-offer', data) // emit this to the server (emitting pre-offer)
}

export const sendPreOfferAnswer = (data) => {
  socketIO.emit('pre-offer-answer', data)
}

// only one for passing the type through signaling
export const sendDataUsingWebRTCSignaling = (data) => {
  socketIO.emit('webRTC-signaling', data)
}

// hanging up logic
export const sendUserHangedUp = data => {
  socketIO.emit('user-hanged-up', data)
}

export const changeStrangerConnectionStatus = (data) => {
  socketIO.emit('stranger-connection-status', data)
}

export const getStrangerSocketId = () => {
  socketIO.emit('get-stranger-socket-id')
}
