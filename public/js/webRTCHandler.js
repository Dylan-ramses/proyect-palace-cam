// webRTC related stuff
import * as wss from './wss.js'
import * as constants from './constants.js'
import * as ui from './ui.js'

let connectedUserDetails;

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
    // sending pre-offer
    wss.sendPreOffer(data)
  }
}

export const handlePreOffer = (data) => {
  console.log('pre-offer in webRTC handler', data)
  const {callType, callerSocketId} = data
  connectedUserDetails = {
    socketId: callerSocketId,
    callType,
  }
  // checking the type of call
  if(callType === constants.callType.CHAT_PERSONAL_CODE || callType === constants.callType.VIDEO_PERSONAL_CODE) {
    ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler)
  }
}

// handler
const acceptCallHandler = () => {
  console.log('call accepted')
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED)
  ui.showCallElements(connectedUserDetails.callType)
}

const rejectCallHandler = () => {
  console.log('call rejected')
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED)
}

const callingDialogRejectCallHandler = () => {
  console.log('rejecting the call')
}

export const sendPreOfferAnswer = (preOfferAnswer) => {
  const data = {
    callerSocketId: connectedUserDetails.socketId,
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
  }

  if(preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
    // show dialog that callee is not able to connect
    ui.showInfoDialog(preOfferAnswer)
  }

  if(preOfferAnswer == constants.preOfferAnswer.CALL_REJECTED) {
    // show dialog that call is rejected by the callee
    ui.showInfoDialog(preOfferAnswer)
  }

  if(preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED) {
    // show dialog that send webRTC offer
    ui.showCallElements(connectedUserDetails.callType)
  }
}
