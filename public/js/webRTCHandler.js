// webRTC related stuff
import * as wss from './wss.js'
import * as constants from './constants.js'
import * as ui from './ui.js'
import * as store from './store.js'

let connectedUserDetails;
let peerConnection;
let dataChannel; // this is for messaging

const defaultConstraints = {
  audio: true,
  video: true,
}

const configuration = {
  iceServers: [ // STUN servers address
    {
      urls: 'stun:stun.l.google.com:13902' // getting to us back our ICE candidates
    }
  ]
}

// getting the local stream for previewing the video
export const getLocalPreview = () => {
  // access to the media
  navigator.mediaDevices.getUserMedia(defaultConstraints).then(stream => {
    ui.updateLocalVideo(stream) // updating the UI
    ui.showVideoCallButtons()
    store.setCallState(constants.callState.CALL_AVAILABLE)
    store.setLocalStream(stream)
  }).catch(err => {
    console.log('error occurred when trying to get an access to camera')
    console.log(err)
  })
}

// creating the peer Connection (+ listeners)
const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(configuration)
  // creating a data channel
  dataChannel = peerConnection.createDataChannel('chat')
  // we should write an event listener for it
  peerConnection.ondatachannel = event => {
    const dataChannel = event.channel
    dataChannel.onopen = () => {
      console.log('peer connection is ready to receive data channel messages')
    }
    dataChannel.onmessage = event => {
      console.log('message came from data channel')
      // getting the message
      const message = JSON.parse(event.data)
      // printing the message
      ui.appendMessage(message)
      // console
      console.log(message)
    }
  }

  // RTC connection between local and remote computer -> provide methods to connect to a remote peer and monitor/maintain connections, and also close it
  console.log('getting ice candidates from stun server')
  peerConnection.onicecandidate = (event) => {
    // receiving ICE candidates -> information about internet connections as soon as we create a webRTC offer
    if(event.candidate) {
      // send our ice candidate to other peers here
      wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: constants.webRTCSignaling.ICE_CANDIDATE,
        candidate: event.candidate
      })
    }
  }
  // on connected
  peerConnection.onconnectionstatechange = (event) => {
    if(peerConnection.connectionState === 'connected') {
      console.log('successfully connected with other peer')
    }
  }
  // receiving tracks
  const remoteStream = new MediaStream()
  store.setRemoteStream(remoteStream)
  ui.updateRemoteVideo(remoteStream)

  // check on track
  peerConnection.ontrack = event => {
    remoteStream.addTrack(event.track)
  }

  // add our stream to the peer connection
  if(connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE ||  connectedUserDetails.callType === constants.callType.VIDEO_STRANGER) {
    // getting our stream
    const localStream = store.getState().localStream;
    // now we can get the tracks for the local stream and add it to the peer connection
    // when the connection is established, we'll start sending the stream to other users
    for(const track of localStream.getTracks()) {
      peerConnection.addTrack(track, localStream)
    }
  }
}

// send message function
export const sendMessageUsingDataChannel = (message) => {
  const stringifiedMessage = JSON.stringify(message)
  dataChannel.send(stringifiedMessage)
}

// webRTC offer
const sendWebRTCOffer = async () => {
  const offer = await peerConnection.createOffer() // this contain the SDP information
  await peerConnection.setLocalDescription(offer)
  // creating the peer connection, if callee accepted the call - sending the offer to the callee side (other user) which we would like to connected
  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignaling.OFFER,
    offer: offer
  })
}

// data comming from the callee side
export const handleWebRTCOffer = async data => {
  console.log('webRTC offer came', data)
  await peerConnection.setRemoteDescription(data.offer) // caller side offer (remote because it's the client)
  const answer = await peerConnection.createAnswer() // this answer (creating the SDP)
  // save it as local description
  await peerConnection.setLocalDescription(answer)
  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignaling.ANSWER,
    answer: answer
  })
  // at this point we just exchanged SDP information (local-remote) = in both sides
  // now: exchange ICE candidates, see if one person will be able to see others
}

export const handleWebRTCAnswer = async data => {
  console.log('handling webRTC answer')
  await peerConnection.setRemoteDescription(data.answer)
}

export const handleWebRTCCandidate = async data => {
  console.log('handling incoming webRTC candidates')
  try {
    await peerConnection.addIceCandidate(data.candidate)
  } catch(err) {
    console.error("Error occurred when trying to add received ICE candidate", err)
  }
}

export const sendPreOffer = (callType, calleePersonalCode) => {
  connectedUserDetails = {
    callType,
    socketId: calleePersonalCode
  }
  // checking for the call type
  if(callType === constants.callType.CHAT_PERSONAL_CODE || callType === constants.callType.VIDEO_PERSONAL_CODE) {
    console.log('pre offer func executed', callType, calleePersonalCode)
    // formatting
    const data = {callType, calleePersonalCode}
    // showing the dialog
    ui.showCallingDialog(callingDialogRejectCallHandler)
    // setting up the state the pre-offer
    store.setCallState(constants.callState.CALL_UNAVAILABLE)
    // sending pre-offer
    wss.sendPreOffer(data)
  }
  // stranger handle
  if(callType === constants.callType.CHAT_STRANGER_CODE || callType === constants.callType.VIDEO_STRANGER_CODE) {
    // formatting
    const data = {callType, calleePersonalCode}
    store.setCallState(constants.callState.CALL_UNAVAILABLE)
    wss.sendPreOffer(data)
  }
}

export const handlePreOffer = (data) => {
  console.log('pre-offer in webRTC handler', data)
  const {callType, callerSocketId} = data
  // check what's our call state
  if(!checkCallPossibility()) {
    return sendPreOfferAnswer(constants.preOfferAnswer.CALL_UNAVAILABLE, callerSocketId)
  }
  // setting up the details
  connectedUserDetails = {
    socketId: callerSocketId,
    callType,
  }
  // setting up the state
  store.setCallState(constants.callState.CALL_UNAVAILABLE)
  // checking the type of call
  if(callType === constants.callType.CHAT_PERSONAL_CODE || callType === constants.callType.VIDEO_PERSONAL_CODE) {
    ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler)
  }
  // preoffer for strangers
  if(callType === constants.callType.CHAT_STRANGER_CODE || callType === constants.callType.VIDEO_STRANGER_CODE) {
    createPeerConnection()
    sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED)
    ui.showCallElements(connectedUserDetails.callType)
  }
}

// handler
const acceptCallHandler = () => {
  console.log('call accepted')
  // creating the peer connection
  createPeerConnection()
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED)
  ui.showCallElements(connectedUserDetails.callType)
}

const rejectCallHandler = () => {
  console.log('call rejected')
  sendPreOfferAnswer()
  setIncomingCallsAvailable()
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED)
}

const callingDialogRejectCallHandler = () => {
  console.log('rejecting the call')
  const data = {connectedUserSocketId: connectedUserDetails.socketId}
  closePeerConnectionAndResetState()
  wss.sendUserHangedUp(data)
}

export const sendPreOfferAnswer = (preOfferAnswer, callerSocketId = null) => {
  const socketId = callerSocketId ? callerSocketId : connectedUserDetails.socketId
  const data = {
    callerSocketId: socketId,
    preOfferAnswer
  }
  // removing prev dialogs
  ui.removeAllDialogs()
  // sending data to the server here
  wss.sendPreOfferAnswer(data)
}

export const handlePreOfferAnswer = (data) => {
  const { preOfferAnswer } = data
  console.log('pre offer answer came', data)
  ui.removeAllDialogs()

  if(preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
    // showing the dialog that callee has not been found
    ui.showInfoDialog(preOfferAnswer)
    // managing state
    setIncomingCallsAvailable()
  }

  if(preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
    // show dialog that callee is not able to connect
    setIncomingCallsAvailable()
    ui.showInfoDialog(preOfferAnswer)
  }

  if(preOfferAnswer == constants.preOfferAnswer.CALL_REJECTED) {
    // show dialog that call is rejected by the callee
    setIncomingCallsAvailable()
    ui.showInfoDialog(preOfferAnswer)
  }

  if(preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED) {
    // show dialog that send webRTC offer
    store.setCallState(constants.callState.CALLEE_NOT_FOUND)
    ui.showCallElements(connectedUserDetails.callType)
    createPeerConnection()
    // send webRTC Offer now
    sendWebRTCOffer()
  }
}

let screenSharingStream

export const switchBetweenCameraAndScreenSharing = async (screenSharingActive) => {
  if(screenSharingActive) {
    const localStream = store.getState().localStream
    const senders = peerConnection.getSenders()
    const sender = senders.find(sender => {
      return (sender.track.kind === localStream.getVideoTracks()[0].kind)
    })
    if(sender) {
      sender.replaceTrack(localStream.getVideoTracks()[0])
    }
    // stop screen sharing screen
    store.getState().screenSharingStream.getTracks().forEach(track => track.stop())

    store.setScreenSharingActive(!screenSharingActive)
    ui.updateLocalVideo(localStream)
  } else {
    console.log('switching for screen sharing')
    try {
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({video: true})
      store.setScreenSharingStream(screenSharingStream)
      // replace track which sender is sending
      const senders = peerConnection.getSenders()
      const sender = senders.find(sender => {
        return (sender.track.kind === screenSharingStream.getVideoTracks()[0].kind)
      })
      if(sender) {
        sender.replaceTrack(screenSharingStream.getVideoTracks()[0])
      }
      store.setScreenSharingActive(!screenSharingActive)
      ui.updateLocalVideo(screenSharingStream)
    } catch(err) {
      console.log('error occured when trying to get screen sharing screen stream', err)
    }
  }
}

// han up
export const handleHangUp = () => {
  console.log('finishing the call')
  const data = {
    connectedUserSocketId: connectedUserDetails.socketId
  }
  // sending data
  wss.sendUserHangedUp(data)
  closePeerConnectionAndResetState()
}

export const handleConnectedUserHangedUp = () => {
  console.log('connected peer hanged up')
  closePeerConnectionAndResetState()
}

const closePeerConnectionAndResetState = () => {
  if(peerConnection) {
    peerConnection.close()
    peerConnection = null
  }
  // active mic and camera
  if(connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE || connectedUserDetails.callType === constants.callType.VIDEO_STRANGER) {
    store.getState().localStream.getVideoTracks()[0].enabled = true
    store.getState().localStream.getAudioTracks()[0].enabled = true
  }
  ui.updateUIAfterHangUp(connectedUserDetails.callType)
  setIncomingCallsAvailable()
  connectedUserDetails = null
}

// checking call
const checkCallPossibility = callType => {
  const callState = store.getState().callState
  if(callState === constants.callState.CALL_AVAILABLE) {
    return true
  }
  // checking call type type
  if((callType === constants.callType.VIDEO_PERSONAL_CODE || callType === constants.callType.VIDEO_STRANGER) && callState === constants.callState.CALL_AVAILABLE_ONLY_CHAT) {
    return false
  }
  return false
}

const setIncomingCallsAvailable = () => {
  const localStream = store.getState().localStream
  if(localStream) {
    store.setCallState(constants.callState.CALL_AVAILABLE)
  } else {
    store.setCallState(constants.callState.CALL_AVAILABLE_ONLY_CHAT)
  }
}
