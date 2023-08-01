// this is for state management

let state = {
  socketId: null,
  localStream: null,
  remoteStream: null,
  screenSharingStream: null,
  allowConnectionsFromStrangers: false,
  screenSharingActive: false
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
export const setScreenSharingStream = (strem) => {
  state = {
    ...state,
    screenSharingStream: stream
  }
}

// doing the same for the remoteStream
export const setRemoteStream = (strem) => {
  state = {
    ...state,
    remoteStream: stream
  }
}

// getting the state
export const getState = () => {
  return state
}
