// importing the store
import * as store from './store.js'
import * as wss from './wss.js'
import * as webRTCHandler from './webRTCHandler.js'
import * as constants from './constants.js'

// not required
// import {getIncomingCallDialog} from './elements.js'

// defining the connection
const socket = io('/') // / because it's on the same directory

// then, we need to import the registering socket events
wss.registerSocketEvents(socket)

// register event listener for personal code copy button
const personalCodeCopyButton = document.getElementById('personal_code_copy_button')
personalCodeCopyButton.addEventListener('click', () => {
  // getting the socketid from the getState object
  const personalCode = store.getState().socketId;
  // clipboard functionality
  navigator.clipboard && navigator.clipboard.writeText(personalCode)
})

// register event listeners for connection buttons
const personalCodeChatButton = document.getElementById('personal_code_chat_button')
const personalCodeVideoButton = document.getElementById('personal_code_video_button')

personalCodeChatButton.addEventListener('click', () => {
  console.log("chat button clicked")
  // callee, person that I want to connected
  const calleePersonalCode = document.getElementById('personal_code_input').value
  const callType = constants.callType.CHAT_PERSONAL_CODE
  // send information to the server
  webRTCHandler.sendPreOffer(callType, calleePersonalCode)
})

personalCodeVideoButton.addEventListener('click', () => {
  console.log("video button clicked")
  // callee, person that I want to connected
  const calleePersonalCode = document.getElementById('personal_code_input').value
  const callType = constants.callType.VIDEO_PERSONAL_CODE
  // send information to the server
  webRTCHandler.sendPreOffer(callType, calleePersonalCode)
})

// this was for testing
// getIncomingCallDialog('VIDEO', () => {}, () => {})
