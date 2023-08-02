// importing the store
import * as store from './store.js'
import * as wss from './wss.js'
import * as webRTCHandler from './webRTCHandler.js'
import * as constants from './constants.js'
import * as ui from './ui.js'
import * as recordingUtils from './recordingUtils.js'
import * as strangerUtils from './strangerUtils.js'

// not required
// import {getIncomingCallDialog} from './elements.js'

// defining the connection
const socket = io('/') // / because it's on the same directory

// execute the video function here
webRTCHandler.getLocalPreview();

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

// strangers
const strangerChatButton = document.getElementById('stranger_chat_button')
strangerChatButton.addEventListener('click', () => {
  strangerUtils.getStrangerSocketIdAndConnect(constants.callType.CHAT_STRANGER)
})

const strangerVideoButton = document.getElementById('stranger_video_button')
strangerVideoButton.addEventListener('click', () => {
  strangerUtils.getStrangerSocketIdAndConnect(constants.callType.VIDEO_STRANGER)
})

// strangers checkbox (register event for allow connections from strangers)
const checkbox = document.getElementById('allow_strangers_checkbox')
checkbox.addEventListener('click', () => {
  const checkboxState = store.getState().allowConnectionsFromStrangers
  up.updateStrangerCheckbox(!checkboxState)
  store.setAllowConnectionsfromStrangers(!checkboxstate)
  strangerUtils.changeStrangerConnectionStatus(!checkboxstate)
})

// this was for testing
// getIncomingCallDialog('VIDEO', () => {}, () => {})

// event listeners for video call buttons
const micButton = document.getElementById('mic_button')
micButton.addEventListener('click', () => {
  const localStream = store.getState().localStream
  const micEnabled = localStream.getAudioTracks()[0].enabled
  localStream.getAudioTracks()[0].enabled = !micEnabled
  ui.updateMicButton(micEnabled)
})

const cameraButton = document.getElementById('camera_button')
cameraButton.addEventListener('click', () => {
  const localStream = store.getState().localStream
  const cameraEnabled = localStream.getVideoTracks()[0].enabled
  localStream.getAudioTracks()[0].enabled = !cameraEnabled
  ui.updateCameraButton(cameraEnabled)
})

const switchForScreenSharingButton = document.getElementById('screen_sharing_button')
switchForScreenSharingButton.addEventListener('click', () => {
  const screenSharingActive = store.getState().screenSharingActive
  webRTCHandler.switchBetweenCameraAndScreenSharing(screenSharingActive)
})

// messenger functionality
const newMessageInput = document.getElementById('new_message_input')
newMessageInput.addEventListener('keydown', (event) => {
  const key = event.key
  if(key === 'Enter') {
    webRTCHandler.sendMessageUsingDataChannel(event.target.value)
    // append message
    ui.appendMessage(event.target.value, true)
    // cleaning after sent
    newMessageInput.value = ''
  }
})

const sendMessageButton = document.getElementById('send_message_button')
sendMessageButton.addEventListener('click', () => {
  const message = newMessageInput.value
  webRTCHandler.sendMessageUsingDataChannel(message)
  ui.appendMessage(message, true)
  newMessageInput.value = ""
})

// recording
const startRecodingButton = document.getElementById('start_recording_button')
startRecodingButton.addEventListener('click', () => {
  recordingUtils.startRecording()
  ui.showRecordingPanel()
})

const stopRecordingButton = document.getElementById('stop_recording_button')
stopRecordingButton.addEventListener('click', () => {
  recordingUtils.stopRecording()
  ui.resetRecordingButtons()
})

const pauseRecordingButton = document.getElementById('pause_recording_button')
pauseRecordingButton.addEventListener('click', () => {
  recordingUtils.pauseRecording()
  ui.switchRecordingButtons(true)
})

const resumeRecordingButton = document.getElementById('resume_recording_button')
resumeRecordingButton.addEventListener('click', () => {
  recordingUtils.resumeRecording()
  ui.switchRecordingButtons()
})

// hang up
const hangUpButton = document.getElementById('hang_up_button')
hangUpButton.addEventListener('click', () => {
  webRTCHandler.handleHangUp()
})

const hangUpChatButton = document.getElementById('finish_chat_call_button')
hangUpChatButton.addEventListener('click', () => {
  webRTCHandler.handleHangUp()
})
