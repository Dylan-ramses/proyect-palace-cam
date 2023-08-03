// this is for state management

import * as constants from './constants.js'

let state = {
  socketId: null,
  localStream: null,
  remoteStream: null,
  screenSharingStream: null,
  allowConnectionsFromStrangers: false,
  screenSharingActive: false,
  callState: constants.callState.CALL_AVAILABLE_ONLY_CHAT
};

// seting the socket ID method
export const setSocketId = (socketId) => {
  state = {
    ...state, // this is a spread operator (values from the previous state)
    // socketId: socketId,
    socketId,
  }
  console.log(state)
}

// seting the localStream method
export const setLocalStream = (stream) => {
  state = {
    ...state, // this is a spread operator (values from the previous state)
    localStream: stream,
  }
}

// setting setAllowConnectionsfromStrangers
export const setAllowConnectionsfromStrangers = (allowConnection) => {
  state = {
    ...state,
    allowConnectionsFromStrangers: allowConnection
  }
}

// doing the same for the screenSharing
export const setScreenSharingActive = (screenSharingActive) => {
  state = {
    ...state,
    screenSharingActive
  }
}

// doing the same for the screenSharing
export const setScreenSharingStream = (stream) => {
  state = {
    ...state,
    screenSharingStream: stream
  }
}

// doing the same for the remoteStream
export const setRemoteStream = (stream) => {
  state = {
    ...state,
    remoteStream: stream
  }
}

export const setCallState = callState => {
  state = {
    ...state,
    callState,
  }
}

// getting the state
export const getState = () => {
  return state
}
