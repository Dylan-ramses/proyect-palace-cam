// managing ui changes
import * as constants from './constants.js'
import * as elements from './elements.js'


export const updatePersonalCode = (personalCode) => {
  const personalCodeParagraph = document.getElementById('personal_code_paragraph')
  personalCodeParagraph.innerHTML = personalCode
}

export const updateRemoteVideo = (stream) => {
  const remoteVideo = document.getElementById('remote_video')
  remoteVideo.srcObject = stream
}

export const updateLocalVideo = stream => {
  const localVideo = document.getElementById('local_video')
  // setting up the source
  localVideo.srcObject = stream
  // once loaded
  localVideo.addEventListener('loadedmetadata', () => {
    localVideo.play() // play
  })
}

export const showVideoCallButtons = () => {
  const personalCodeVideoButton = document.getElementById('personal_code_video_button')
  const strangerVideoButton = document.getElementById('stranger_video_button')
  showElement(personalCodeVideoButton)
  showElement(strangerVideoButton)
}

export const showIncomingCallDialog = (callType, acceptCallHandler, rejectCallHandler) => {
  const callTypeInfo = callType === constants.callType.CHAT_PERSONAL_CODE ? 'Chat' : 'Video'
  // display dialog
  const incomingCallDialog = elements.getIncomingCallDialog(callTypeInfo, acceptCallHandler, rejectCallHandler)
  // now let's append the dialog here
  const dialog = document.getElementById('dialog')
  // removing all dialogs inside HTML dialog element
  dialog.querySelectorAll('*').forEach((dialog) => dialog.remove())
  dialog.appendChild(incomingCallDialog)

}

export const showCallingDialog = (rejectCallHandler) => {
  const callingDialog = elements.getCallingDialog(rejectCallHandler)
  // now let's append the dialog here
  const dialog = document.getElementById('dialog')
  // removing all dialogs inside HTML dialog element
  dialog.querySelectorAll('*').forEach((dialog) => dialog.remove())
  dialog.appendChild(callingDialog)

}

export const showNoStrangerAvailableDialog = () => {
  const infoDialog = elements.getInfoDialog('No Stranger available', 'Please try again later')
  // dialog
  if(infoDialog) {
    const dialog = document.getElementById('dialog')
    dialog.appendChild(infoDialog)
    // set Timeout
    setTimeout(() => {
      removeAllDialogs()
    }, [4000])
  }
}

export const showInfoDialog = (preOfferAnswer) => {
  let infoDialog = null
  if(preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
    infoDialog = elements.getInfoDialog('Call rejected', 'Callee rejected your call')
  }
  if(preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
    infoDialog = elements.getInfoDialog('Call not found', 'Please check personal code')
  }
  if(preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
    infoDialog = elements.getInfoDialog('Call is not possible', 'Probably callee is busy, please try again later')
  }
  // dialog
  if(infoDialog) {
    const dialog = document.getElementById('dialog')
    dialog.appendChild(infoDialog)
    // set Timeout
    setTimeout(() => {
      removeAllDialogs()
    }, [4000])
  }
}

export const showCallElements = (callType) => {
  if(callType == constants.callType.CHAT_PERSONAL_CODE || callType === constants.callType.CHAT_STRANGER) {
    showChatCallElements()
  }

  if(callType == constants.callType.VIDEO_PERSONAL_CODE || callType === constants.callType.VIDEO_STRANGER) {
    showVideoCallElements()
  }
}

const showChatCallElements = () => {
  const finishConnectionChatButtonContainer = document.getElementById('finish_chat_button_container')
  showElement(finishConnectionChatButtonContainer)
  const newMessageInput = document.getElementById('new_message')
  showElement(newMessageInput)
  // block panel
  disableDashboard()
}

const showVideoCallElements = () => {
  const callButtons = document.getElementById('call_buttons')
  showElement(callButtons)

  const placeholder = document.getElementById('video_placeholder')
  hideElement(placeholder)

  const remoteVideo = document.getElementById('remote_video')
  showElement(remoteVideo)
  // disable
  const newMessageInput = document.getElementById('new_message')
  showElement(newMessageInput)
  // block panel
  disableDashboard()
}

export const removeAllDialogs = () => {
  const dialog = document.getElementById('dialog')
  // removing all dialogs inside HTML dialog element
  dialog.querySelectorAll('*').forEach((dialog) => dialog.remove())
}

const micOnImageSrc = './utils/images/mic.png'
const micOffImageSrc = './utils/images/micOff.png'

// ui call buttons
export const updateMicButton = (micActive) => {
  const micButtonImage = document.getElementById('mic_button_image')
  micButtonImage.src = micActive ? micOffImageSrc : micOnImageSrc
}

const cameraOnImgSrc = './utils/images/camera.png'
const cameraOffImgSrc = './utils/images/cameraOff.png'

export const updateCameraButton = (cameraActive) => {
  const cameraButtonImage = document.getElementById('camera_button_image')
  cameraButtonImage.src = cameraActive ? cameraOffImgSrc : cameraOnImgSrc
}

// ui messages
export const appendMessage = (message, right = false) => {
  const messagesContainer = document.getElementById('messages_container')
  const messageElement = right ? elements.getRightMessage(message) : elements.getLeftMessage(message)
  messagesContainer.appendChild(messageElement)
}

export const clearMessenger = () => {
  const messagesContainer = document.getElementById('messages_container')
  messagesContainer.querySelectorAll('*').forEach((n) => n.remove())
}

// recoding
export const showRecordingPanel = () => {
  const recordingButtons = document.getElementById('video_recording_buttons')
  showElement(recordingButtons)
  // hide start recording buttons if it is active
  const startRecordingButton = document.getElementById('start_recording_button')
  hideElement(startRecordingButton)
}

export const switchRecordingButtons = (switchForResumeButton = false) => {
  const resumeButton = document.getElementById('resume_recording_button')
  const pauseButton = document.getElementById('pause_recording_button')
  if(switchForResumeButton) {
    hideElement(pauseButton)
    showElement(resumeButton)
  } else {
    hideElement(resumeButton)
    showElement(pauseButton)
  }
}

// ui after hang up
export const updateUIAfterHangUp = (callType) => {
  enableDashboard()
  // hide the call buttons
  if(callType === constants.callType.VIDEO_PERSONAL_CODE || callType === constants.callType.VIDEO_STRANGER) {
    const callButtons = document.getElementById('call_buttons')
    hideElement(callButtons)
  } else {
    const chatCallButtons = document.getElementById('finish_chat_button_container')
    hideElement(chatCallButtons)
  }

  const newMessageInput = document.getElementById('new_message')
  hideElement(newMessageInput)
  clearMessenger()
  updateMicButton(false)
  updateCameraButton(false)
  // hide remote video and show the place holder
  const placeholder = document.getElementById('video_placeholder')
  showElement(placeholder)

  const remoteVideo = document.getElementById('remote_video')
  hideElement(remoteVideo)

  removeAllDialogs()
}

// changing status of checkbox
export const updateStrangerCheckbox = (allowConnections) => {
  const checkboxCheckImg = document.getElementById('allow_strangers_checkbox_image')
  allowConnections ? showElement(checkboxCheckImg) : hideElement(checkboxCheckImg)
}

export const resetRecordingButtons = () => {
  const startRecordingButton = document.getElementById('start_recording_button')
  showElement(startRecordingButton)
  const recordingButtons = document.getElementById('video_recording_buttons')
  hideElement(recordingButtons)
}

const enableDashboard = () => {
  const dashboardBlocker = document.getElementById('dashboard_blur')
  if(!dashboardBlocker.classList.contains('display_none')) {
    dashboardBlocker.classList.add('display_none')
  }
}

const disableDashboard = () => {
  const dashboardBlocker = document.getElementById('dashboard_blur')
  if(dashboardBlocker.classList.contains('display_none')) {
    dashboardBlocker.classList.remove('display_none')
  }
}

const hideElement = (element) => {
  if (!element.classList.contains("display_none")) {
    element.classList.add("display_none");
  }
}

const showElement = (element) => {
  if(element.classList.contains('display_none')) {
    element.classList.remove('display_none')
  }
}
